#!/usr/bin/env python3
"""Dependency-free positive and negative tests for the deployment SEO gate."""
import importlib.util
from pathlib import Path
import unittest
from contextlib import redirect_stdout
from io import StringIO
from urllib.parse import urlsplit, parse_qs
spec = importlib.util.spec_from_file_location('seo_regression', Path(__file__).with_name('seo-regression.py'))
seo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seo)
SHA = '6add12d63e379b7d84c1bf3b3cfb0a6c0c25f9f0'
ROUTE = '/posts/vpn/'
HEAD = f'''<meta name="ermao:build-revision" content="{SHA}"><link rel="canonical" href="{seo.HOST}{ROUTE}"><meta property="og:url" content="{seo.HOST}{ROUTE}"><meta name="description" content="Source-backed description.">'''
ROBOTS = f'User-agent: *\nAllow: /\nSitemap: {seo.HOST}/sitemap.xml\n'
ROUTES = ['/', '/en/', '/posts/vpn/', '/en/posts/vpn/', '/airport/', '/page/2/', '/blog/freeappleid/', '/en/blog/freeappleid/', '/article/z747kgjd/', '/en/article/z747kgjd/']
def sitemap(routes=ROUTES):
    return '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{seo.HOST}{p}</loc></url>' for p in routes) + '</urlset>'
class SeoContracts(unittest.TestCase):
    def test_current_indexable_document(self):
        seo.validate_indexable(ROUTE, seo.Document(HEAD), SHA)
    def test_stale_release_cannot_pass_on_unchanged_article_dates(self):
        with self.assertRaisesRegex(AssertionError, 'stale or mixed'):
            seo.validate_indexable(ROUTE, seo.Document(HEAD.replace(SHA, '0' * 40)), SHA)
    def test_missing_or_duplicate_revision(self):
        for html in ('', HEAD + f'<meta name="ermao:build-revision" content="{SHA}">'):
            with self.subTest(html=html), self.assertRaisesRegex(AssertionError, 'build revision'):
                seo.revision(seo.Document(html))
    def test_wrong_canonical_and_duplicate_description(self):
        for html in (HEAD.replace('rel="canonical"', 'rel="alternate"'), HEAD + '<meta name="description" content="duplicate">'):
            with self.subTest(html=html), self.assertRaises(AssertionError):
                seo.validate_indexable(ROUTE, seo.Document(html), SHA)
    def test_noindex_and_bot_specific_blocks(self):
        for name in ('robots', 'googlebot', 'bingbot'):
            for value in ('noindex,follow', 'NONE'):
                with self.subTest(name=name, value=value), self.assertRaisesRegex(AssertionError, 'blocked'):
                    seo.validate_indexable(ROUTE, seo.Document(HEAD + f'<meta name="{name}" content="{value}">'), SHA)
    def test_valid_discovery(self):
        seo.validate_discovery(ROBOTS, sitemap())
    def test_robot_disallow(self):
        with self.assertRaisesRegex(AssertionError, 'blocked'):
            seo.validate_discovery(ROBOTS.replace('Allow: /', 'Disallow: /posts/'), sitemap())
    def test_sitemap_excludes_error_private_and_subscription_urls(self):
        for path in ('/404.html', '/stats/', '/sub/reachable/clash/ermao.net'):
            with self.subTest(path=path), self.assertRaises(AssertionError):
                seo.validate_discovery(ROBOTS, sitemap(ROUTES + [path]))
    def test_sitemap_missing_duplicate_and_noncanonical_urls(self):
        for xml in (sitemap(ROUTES[1:]), sitemap(ROUTES + ['/']), sitemap().replace('www.ermao.net', 'api.ermao.net')):
            with self.subTest(xml=xml), self.assertRaises(AssertionError):
                seo.validate_discovery(ROBOTS, xml)
    def test_critical_asset_extraction(self):
        doc = seo.Document('<script type="module" src="/assets/app-1.js"></script><link rel="stylesheet" href="/assets/style-1.css?v=1"><link rel="modulepreload" href="/assets/page-1.js"><script src="https://example.com/optional.js"></script>')
        self.assertEqual(seo.critical_assets(doc), {'/assets/app-1.js', '/assets/style-1.css?v=1', '/assets/page-1.js'})
    def test_valid_assets(self):
        seo.validate_asset('/assets/app.js', 200, 'application/javascript; charset=utf-8', 'export default 1')
        seo.validate_asset('/assets/style.css?v=1', 200, 'text/css', 'body{}')
    def test_bad_status_mime_empty_or_html_assets(self):
        cases = [(404, 'text/javascript', 'not found'), (200, 'text/html', '<html>oops</html>'), (200, 'application/javascript', ''), (200, 'application/javascript', '<!doctype html><html>oops</html>')]
        for status, mime, body in cases:
            with self.subTest(status=status, mime=mime, body=body), self.assertRaises(AssertionError):
                seo.validate_asset('/assets/app.js', status, mime, body)
    def test_probe_urls_preserve_asset_query_and_change_per_attempt(self):
        first = seo.probe_url(seo.HOST + '/assets/style.css?v=1', SHA, 1)
        second = seo.probe_url(seo.HOST + '/assets/style.css?v=1', SHA, 2)
        self.assertNotEqual(first, second)
        query = parse_qs(urlsplit(first).query)
        self.assertEqual(query['v'], ['1'])
        self.assertEqual(query['ermao_release'], [SHA])
        self.assertEqual(query['ermao_probe'], ['1'])

    def test_canonical_propagation_pass_pending_and_error_are_distinct(self):
        def response(url, stale=False, error=False, asset_error=False):
            route = urlsplit(url).path
            if route.startswith('/assets/'):
                return 200, {'content-type': 'text/html' if asset_error else 'text/javascript'}, 'export default 1'
            html = HEAD.replace(ROUTE, route)
            if stale:
                html = html.replace(SHA, '0' * 40)
            return 503 if error else 200, {'content-type': 'text/html', 'age': '45', 'cache-control': 'max-age=7200'}, html
        for kwargs, expected in [({}, 0), ({'stale': True}, 2), ({'error': True}, 1), ({'asset_error': True}, 1)]:
            with self.subTest(kwargs=kwargs), redirect_stdout(StringIO()) as output:
                actual = seo.canonical_status(SHA, {'/assets/app.js'}, lambda url: response(url, **kwargs))
                self.assertEqual(actual, expected)
                self.assertIn('CANONICAL_STATUS', output.getvalue())
        self.assertIn('/blog/freeappleid/', seo.CORE_ROUTES)
        self.assertIn('/en/blog/freeappleid/', seo.CORE_ROUTES)
        self.assertIn('/article/z747kgjd/', seo.CORE_ROUTES)
        self.assertIn('/en/article/z747kgjd/', seo.CORE_ROUTES)

    def test_stale_html_with_missing_referenced_asset_is_a_real_error(self):
        requested = []
        def response(url):
            requested.append(url)
            route = urlsplit(url).path
            if route == '/assets/old-app.js':
                return 404, {'content-type': 'text/html'}, '<html>not found</html>'
            html = HEAD.replace(ROUTE, route).replace(SHA, '0' * 40)
            html += '<script type="module" src="/assets/old-app.js"></script>'
            return 200, {'content-type': 'text/html'}, html
        with redirect_stdout(StringIO()):
            self.assertEqual(seo.canonical_status(SHA, {'/assets/new-app.js'}, response), 1)
        self.assertIn(seo.HOST + '/assets/old-app.js', requested)

    def test_http_robots_block_is_not_treated_as_cache_propagation(self):
        for value in ('noindex', 'googlebot: noindex, nofollow'):
            with self.subTest(value=value), self.assertRaisesRegex(AssertionError, 'X-Robots-Tag'):
                seo.validate_http_indexability(ROUTE, {'content-type': 'text/html', 'x-robots-tag': value})

if __name__ == '__main__':
    unittest.main(verbosity=2)
