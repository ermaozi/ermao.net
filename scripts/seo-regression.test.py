#!/usr/bin/env python3
"""Dependency-free positive and negative tests for the deployment SEO gate."""
import importlib.util
from pathlib import Path
import unittest
import json
from datetime import datetime
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
TUTORIAL_FIXTURES = {
    '/article/anytls-guide/': 'sha256(password) stop=8 只处理序号 0–7 ghcr.io/sagernet/sing-box:latest 软件包安装 沿用安装包自带服务 address name 是用于区分用户配置的标签',
    '/en/article/anytls-guide/': 'sha256(password) reference implementation name identifies the entry address',
    '/blog/clashmi/': 'iPhone 和 iPad 用户 Mac 版通过官方 DMG 安装包安装和更新 macOS 12（Monterey）或更高版本 <a href="https://clashmi.app/download#macos">下载</a><a href="https://clashmi.app/guide/macos">指南</a>',
    '/en/blog/clashmi/': 'iPhone and iPad users The Mac version is installed and updated using an official DMG package macOS 12 (Monterey) or later <a href="https://clashmi.app/download#macos">Download</a><a href="https://clashmi.app/guide/macos">Guide</a>',
    '/blog/telegram/': 'Two-Step Verification 额外的账号登录密码 本机密码锁 不一定同时发送到邮箱和手机号 不能替代账号两步验证',
    '/en/blog/telegram/': 'Two-Step Verification Passcode Lock separate from the account',
    '/blog/9esim/': '实体可编程卡 卡片出厂不含号码 365 天 按流量、分钟和短信计费 不含号码、语音或短信 第三方验证码均不保证成功 预计约两周 该时效未重新核实',
    '/en/blog/9esim/': 'physical, SIM-shaped programmable eUICC card obtain profiles separately does not prove future support permanent number or lifetime service',
    '/article/6vxkmmuh/': 'macOS 12 及以上系统 仅影响遵循 macOS 系统代理设置的应用 实际范围受路由和排除项等配置影响 已进入客户端的流量统一使用全局策略组中选定的出口 独立开关 仅把应用移到废纸篓不等于卸载服务 先备份 uninstall-service 不要强行打开 这一修复不代表所有断网或 DNS 故障都有同一原因',
    '/en/article/6vxkmmuh/': 'macOS 12 or later affects only apps that honor the macOS system proxy settings Coverage depends on routes and exclusions Sends captured traffic through the selected global outbound independent switches moving the app to Trash alone does not uninstall it Back up subscriptions uninstall-service do not force it open This does not establish the cause of every connectivity or DNS failure',
    '/posts/vpn/': '96元/年 60GB/月 99元/年 59GB/月 2026-02-24版文章的历史价目 已被客户端接管的流量 不会自动接管所有应用 不保证全设备流量均已加密',
    '/en/posts/vpn/': 'Historical prices from the 2026-02-24 article version captured traffic uses the selected global outbound does not automatically capture every app or guarantee encryption of all device traffic',
}
for route in ('/article/6vxkmmuh/', '/en/article/6vxkmmuh/'):
    TUTORIAL_FIXTURES[route] += ''.join('<a href="' + url + '">Source</a>' for url in (
        'https://www.clashverge.dev/install.html', 'https://www.clashverge.dev/guide/term.html',
        'https://www.clashverge.dev/uninstall.html', 'https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.8'))


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
            html = HEAD.replace(ROUTE, route) + '<p>' + TUTORIAL_FIXTURES.get(route, '') + '</p>'
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

    def test_changed_content_routes_join_release_and_propagation_checks(self):
        for route in ('/blog/guangsuyun/', '/en/blog/guangsuyun/', '/blog/asspp-download-guide/', '/en/blog/asspp-download-guide/', '/blog/superbiu/', '/en/blog/superbiu/'):
            self.assertIn(route, seo.CORE_ROUTES)

    def test_content_corrections_cannot_pass_with_stale_copy(self):
        for route, good in [('/posts/vpn/', TUTORIAL_FIXTURES['/posts/vpn/']),
                            ('/blog/asspp-download-guide/', '停止安装，不要绕过告警；无法确认来源或完整性时停止安装'),
                            ('/en/blog/freeappleid/', 'Recovery applies only to an account you own')]:
            with self.subTest(route=route):
                seo.validate_content_freshness(route, seo.Document('<p>' + good + '</p>'))
                with self.assertRaisesRegex(AssertionError, 'missing corrected content'):
                    seo.validate_content_freshness(route, seo.Document('<p>Old article</p>'))

    def test_selection_guide_and_client_links_have_release_coverage(self):
        target = '<a href="/posts/vpn/#airport-comparison">套餐与风险对比</a>'
        for route in ('/article/choose-good-airport/', '/article/0gematwc/', '/article/eh8f4n86/'):
            with self.subTest(route=route):
                self.assertIn(route, seo.CORE_ROUTES)
                good = target + '<p>订阅兼容性</p>'
                if route == '/article/choose-good-airport/':
                    good += '<a href="/review-methodology/">证据标准</a><p>不代表每家都经过一周实测；三天自测只能反映这段时间的体验</p>'
                seo.validate_content_freshness(route, seo.Document(good))
                with self.assertRaisesRegex(AssertionError, 'missing direct comparison link'):
                    seo.validate_content_freshness(route, seo.Document(good.replace('/posts/vpn/#airport-comparison', '/posts/vpn')))
                bad = good + ('<p>规避 90% 的风险</p>' if route == '/article/choose-good-airport/' else '<a href="/posts/vpn">旧链接</a>')
                with self.assertRaises(AssertionError):
                    seo.validate_content_freshness(route, seo.Document(bad))

    def test_tutorial_facts_join_local_release_and_propagation_checks(self):
        samples = TUTORIAL_FIXTURES
        for route, good in samples.items():
            with self.subTest(route=route):
                self.assertIn(route, seo.CORE_ROUTES)
                seo.validate_content_freshness(route, seo.Document('<p>' + good + '</p>'))
                with self.assertRaisesRegex(AssertionError, 'missing corrected content'):
                    seo.validate_content_freshness(route, seo.Document('<p>Old tutorial</p>'))
        for route, old in [('/article/anytls-guide/', 'singbox/sing-box:latest'),
                           ('/article/anytls-guide/', '停止填充的连接数'),
                           ('/blog/telegram/', '独立的密码（App Passcode）'),
                           ('/blog/9esim/', '无需实体 SIM 卡'),
                           ('/blog/clashmi/', 'iOS / iPadOS / macOS'),
                           ('/en/blog/clashmi/', 'iOS, iPadOS, and macOS')]:
            with self.subTest(route=route), self.assertRaisesRegex(AssertionError, 'unsupported tutorial claim'):
                seo.validate_content_freshness(route, seo.Document(samples[route] + '<p>' + old + '</p>'))

    def test_clashmi_sources_and_public_body_are_verified(self):
        for target in ('/blog/clashmi/', '/en/blog/clashmi/'):
            for url in ('https://clashmi.app/download#macos', 'https://clashmi.app/guide/macos'):
                with self.subTest(target=target, url=url), self.assertRaisesRegex(AssertionError, 'missing official macOS source'):
                    seo.validate_content_freshness(target, seo.Document(TUTORIAL_FIXTURES[target].replace(url, 'https://example.com/')))
            def response(url):
                route = urlsplit(url).path
                html = HEAD.replace(ROUTE, route) + ('<p>Old tutorial</p>' if route == target else TUTORIAL_FIXTURES.get(route, ''))
                return 200, {'content-type': 'text/html'}, html
            with self.subTest(target=target), redirect_stdout(StringIO()) as output:
                self.assertEqual(seo.canonical_status(SHA, set(), response), 1)
            self.assertIn('missing corrected content', output.getvalue())

    def test_anytls_current_public_body_and_reintroduced_errors_fail(self):
        target = '/article/anytls-guide/'
        for obsolete in ('由 sing-box 团队维护', '用户名+密码的认证方式', '停止填充的连接数',
                         '继续填充标记', 'singbox/sing-box:latest', 'deb-install.sh', '"inet4_address"'):
            with self.subTest(obsolete=obsolete), self.assertRaisesRegex(AssertionError, 'unsupported tutorial claim'):
                seo.validate_content_freshness(target, seo.Document(TUTORIAL_FIXTURES[target] + '<p>' + obsolete + '</p>'))
        def response(url):
            route = urlsplit(url).path
            html = HEAD.replace(ROUTE, route) + ('<p>Old tutorial</p>' if route == target else TUTORIAL_FIXTURES.get(route, ''))
            return 200, {'content-type': 'text/html'}, html
        with redirect_stdout(StringIO()) as output:
            self.assertEqual(seo.canonical_status(SHA, set(), response), 1)
        self.assertIn(target, output.getvalue())
        self.assertIn('missing corrected content', output.getvalue())

    def test_proxy_guidance_rejects_old_claims_and_missing_evidence(self):
        claims = {
            '/article/6vxkmmuh/': ('所有流量都通过代理', '所有网络流量将通过 Clash Verge Rev', 'TUN 模式和系统代理模式不能同时启用', '清空废纸篓，完成卸载'),
            '/en/article/6vxkmmuh/': ('Sends all supported traffic through the proxy', 'The source guide advises choosing either TUN mode or system-proxy mode', 'Empty the Trash'),
            '/posts/vpn/': ('所有流量走代理，适合需要全程加密的场景',),
            '/en/posts/vpn/': ('Sends all supported traffic through the proxy',),
        }
        for route, values in claims.items():
            for old in values:
                with self.subTest(route=route, old=old), self.assertRaisesRegex(AssertionError, 'unsupported tutorial claim'):
                    seo.validate_content_freshness(route, seo.Document(TUTORIAL_FIXTURES[route] + '<p>' + old + '</p>'))
        for route in ('/article/6vxkmmuh/', '/en/article/6vxkmmuh/'):
            for url in ('https://www.clashverge.dev/install.html', 'https://www.clashverge.dev/guide/term.html', 'https://www.clashverge.dev/uninstall.html', 'https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.8'):
                with self.subTest(route=route, url=url), self.assertRaisesRegex(AssertionError, 'missing official proxy source'):
                    seo.validate_content_freshness(route, seo.Document(TUTORIAL_FIXTURES[route].replace(url, 'https://example.com/')))

    def test_proxy_current_public_pages_cannot_pass_with_stale_body(self):
        for target in ('/article/6vxkmmuh/', '/en/article/6vxkmmuh/', '/posts/vpn/', '/en/posts/vpn/'):
            def response(url):
                route = urlsplit(url).path
                html = HEAD.replace(ROUTE, route) + ('<p>Old tutorial</p>' if route == target else TUTORIAL_FIXTURES.get(route, ''))
                return 200, {'content-type': 'text/html'}, html
            with self.subTest(target=target), redirect_stdout(StringIO()) as output:
                self.assertEqual(seo.canonical_status(SHA, set(), response), 1)
            self.assertIn(target, output.getvalue())
            self.assertIn('missing corrected content', output.getvalue())

    def test_git_modification_dates_follow_cross_utc_day_squash_and_future_edits(self):
        def document(meta, schema=None):
            schema = meta if schema is None else schema
            return seo.Document('<meta property="article:modified_time" content="' + meta + '">'
                                + '<script type="application/ld+json">'
                                + json.dumps({'@type': 'BlogPosting', 'dateModified': schema}) + '</script>')
        def unix(iso):
            return str(int(datetime.fromisoformat(iso.replace('Z', '+00:00')).timestamp()))
        source = seo.TUTORIAL_SOURCES['/blog/clashmi/']
        branch_date = '2026-10-09T23:31:42.000Z'
        merge_date = '2026-10-10T01:32:47.000Z'
        later_date = '2026-10-12T02:15:00.000Z'
        for expected in (branch_date, merge_date, later_date):
            calls = []
            def read_log(args, **kwargs):
                calls.append((args, kwargs))
                return unix(branch_date) + '\n' + unix(expected) + '\n'
            actual = seo.git_modified_time(source, read_log)
            self.assertEqual(actual, expected)
            self.assertEqual(calls[0][0], ['git', 'log', '--format=%at', '--follow', '--', source])
            for route in seo.TUTORIAL_SOURCES:
                with self.subTest(expected=expected, route=route):
                    seo.validate_article_dates(route, document(expected), actual)
                    for wrong in ('2026-10-08T23:59:59.000Z', '2026-11-01T00:00:00.000Z', 'not-a-date'):
                        with self.assertRaisesRegex(AssertionError, 'differs from verified source'):
                            seo.validate_article_dates(route, document(wrong), actual)
                    with self.assertRaisesRegex(AssertionError, 'dates disagree'):
                        seo.validate_article_dates(route, document(expected, '2026-10-08T23:59:59.000Z'), actual)
        with self.assertRaisesRegex(AssertionError, 'differs from verified source'):
            seo.validate_article_dates('/blog/clashmi/', document(branch_date), merge_date)
        for output in ('', 'not-a-date\n', '1791595967\ninvalid\n'):
            with self.subTest(output=output), self.assertRaisesRegex(AssertionError, 'missing or invalid Git author dates'):
                seo.git_modified_time(source, lambda *args, **kwargs: output)
        for html in ('', '<script type="application/ld+json">{"@type":"BlogPosting"}</script>',
                     '<meta property="article:modified_time" content="' + merge_date + '">' * 2):
            with self.subTest(html=html), self.assertRaisesRegex(AssertionError, 'missing or duplicate article dates'):
                seo.validate_article_dates('/blog/clashmi/', seo.Document(html), merge_date)

    def test_live_dates_use_verified_build_not_shallow_deployment_git_history(self):
        date = '2026-10-10T01:32:48.000Z'
        html = '<meta property="article:modified_time" content="' + date + '">' + '<script type="application/ld+json">' + json.dumps({'@type': 'BlogPosting', 'dateModified': date}) + '</script>'
        def no_git(_):
            self.fail('Live validation must not use shallow deployment Git history')
        def no_build(_):
            self.fail('Local validation must independently verify Git dates')
        for route, path in seo.TUTORIAL_SOURCES.items():
            with self.subTest(route=route):
                self.assertEqual(seo.expected_article_date(route, False, lambda _: html, no_git), date)
                self.assertEqual(seo.expected_article_date(route, True, no_build, lambda source: date if source == path else None), date)
                expected = seo.expected_article_date(route, False, lambda _: html, no_git)
                seo.validate_article_dates(route, seo.Document(html), expected)
                with self.assertRaisesRegex(AssertionError, 'differs from verified source'):
                    seo.validate_article_dates(route, seo.Document(html.replace(date, '2026-10-11T01:32:48.000Z')), expected)

    def test_current_public_tutorial_cannot_pass_with_wrong_body(self):
        def response(url):
            route = urlsplit(url).path
            if route.startswith('/assets/'):
                return 200, {'content-type': 'text/javascript'}, 'export default 1'
            return 200, {'content-type': 'text/html'}, HEAD.replace(ROUTE, route)
        with redirect_stdout(StringIO()) as output:
            self.assertEqual(seo.canonical_status(SHA, set(), response), 1)
        self.assertIn('missing corrected content', output.getvalue())

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
