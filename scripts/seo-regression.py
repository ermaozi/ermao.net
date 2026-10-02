#!/usr/bin/env python3
"""Validate generated SEO contracts; --live checks the exact deployed article revision."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'docs/.vuepress/dist'
HOST = 'https://www.ermao.net'

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.schemas = []
        self.text = []
        self.script = None
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'script':
            self.script = '' if attrs.get('type') == 'application/ld+json' else False
    def handle_data(self, data):
        if isinstance(self.script, str):
            self.script += data
        elif self.script is None:
            self.text.append(data)
    def handle_endtag(self, tag):
        if tag == 'script':
            if isinstance(self.script, str):
                self.schemas.append(json.loads(self.script))
            self.script = None
    def select(self, tag, key, value):
        return [attrs for name, attrs in self.tags if name == tag and attrs.get(key) == value]

def local(route):
    return (ROOT / (route.strip('/') + '/index.html' if route.endswith('/') and route != '/' else 'index.html' if route == '/' else route.lstrip('/'))).read_text()

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def fetch(url, follow=True):
    try:
        opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
        response = opener.open(urllib.request.Request(url, headers={'User-Agent': 'Ermao-Deployment-Verification/1.0'}), timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    return response.status, response.headers, response.read().decode('utf-8', errors='replace')

def validate(read):
    for prefix in ('/', '/en/'):
        home, second = Document(read(prefix)), Document(read(prefix + 'page/2/'))
        for route, doc in ((prefix, home), (prefix+'page/2/', second)):
            assert doc.select('link', 'rel', 'canonical') == [{'rel': 'canonical', 'href': HOST+route}], route
            assert sum(tag == 'div' and 'vp-post-item' in attrs.get('class', '').split() for tag, attrs in doc.tags) == 15, route
            assert doc.select('a', 'rel', 'next')[0]['href'] == prefix + ('page/2/' if route == prefix else 'page/3/'), route
        assert home.text != second.text
        for anchor in ('airport-comparison', 'ios-subscription'):
            assert any(attrs.get('href') == prefix+'posts/vpn/#'+anchor for tag, attrs in home.tags if tag == 'a')
            assert any(attrs.get('id') == anchor for _, attrs in Document(read(prefix+'posts/vpn/')).tags)
        flybit = Document(read(prefix+'blog/flybit/'))
        faq = [s for s in flybit.schemas if s.get('@type') == 'FAQPage']
        assert len(faq) == 1 and len(faq[0]['mainEntity']) == 3
        visible = re.sub(r'\s+', ' ', ' '.join(flybit.text))
        for question in faq[0]['mainEntity']:
            assert question['name'] in visible
            assert question['acceptedAnswer']['text'] in visible, question['name']
        article = next(s for s in flybit.schemas if s.get('@type') == 'BlogPosting')
        modified = flybit.select('meta', 'property', 'article:modified_time')[0]['content']
        assert article['dateModified'] == modified
        expected = next(s for s in Document(local(prefix+'blog/flybit/')).schemas if s.get('@type') == 'BlogPosting')
        assert article['dateModified'] == expected['dateModified'], 'Deployment has not reached this commit yet'
        ctas = [attrs for tag, attrs in flybit.tags if tag == 'a' and 'goflybit.com/' in attrs.get('href', '')]
        assert len(ctas) >= (2 if prefix == '/' else 1)
        assert all({'sponsored','nofollow','noopener'} <= set(a.get('rel','').split()) and a['href'].endswith('#/register?code=7h1NCdM7') for a in ctas)
        print('PASS HTML, pagination, anchors, FAQ, dates, affiliate links:', prefix, flush=True)
    assert 'noindex' in Document(read('/404.html')).select('meta', 'name', 'robots')[0]['content']
    assert 'Sitemap: '+HOST+'/sitemap.xml' in read('/robots.txt')
    sitemap = read('/sitemap.xml')
    ET.fromstring(sitemap)
    assert '/404.html' not in sitemap and '/sub/reachable/' not in sitemap
    assert HOST+'/page/2/' in sitemap
    print('PASS robots, sitemap and 404 noindex', flush=True)


def audit_http():
    from concurrent.futures import ThreadPoolExecutor
    urls = [HOST + route for route in (
        '/', '/page/2/', '/page/2/index.html', '/page/2/?seo_revision=20261002',
        '/en/page/2/', '/blog/flybit/', '/robots.txt', '/sitemap.xml',
        '/404.html', '/seo-missing-check-20261002/', '/sub/reachable/clash/ermao.net',
    )] + ['https://api.ermao.net/posts/vpn/', 'https://ermaozi.github.io/ermao.net/page/2/']
    def audit(url):
        try:
            status, headers, body = fetch(url, follow=False)
            doc = Document(body) if 'text/html' in headers.get('content-type','') else None
            details = {key: headers.get(key) for key in ('content-type', 'server', 'cf-cache-status', 'age', 'cache-control', 'location', 'x-robots-tag')}
            details.update(status=status, url=url)
            if doc:
                details['canonical'] = doc.select('link', 'rel', 'canonical')
                details['robots'] = doc.select('meta', 'name', 'robots')
                details['title'] = re.findall(r'<title>(.*?)</title>', body, re.S)
                details['static_pagination_link'] = 'href="/page/2/"' in body
                details['flybit_evidence_note'] = '缺少完整的测试时间' in body
            print('HTTP AUDIT ' + json.dumps(details, ensure_ascii=False), flush=True)
        except Exception as error:
            print('HTTP AUDIT UNAVAILABLE', url, type(error).__name__, str(error), flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(audit, urls))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--live', action='store_true')
    parser.add_argument('--http-audit', action='store_true')
    args = parser.parse_args()
    if args.http_audit:
        audit_http()
    elif not args.live:
        validate(local)
    else:
        def live(route):
            status, headers, text = fetch(HOST+route)
            expected = (200, 404) if route == '/404.html' else (200,)
            assert status in expected, f'{route}: HTTP {status}'
            return text
        deadline = time.monotonic() + 180
        while True:
            try:
                validate(live)
                break
            except (AssertionError, urllib.error.URLError, TimeoutError, IndexError, StopIteration) as error:
                if time.monotonic() >= deadline:
                    raise
                print('Waiting for production:', str(error), flush=True)
                time.sleep(20)
