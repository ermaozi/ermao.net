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
            assert len(doc.select('div', 'class', 'vp-post-item')) == 15, route
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

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--live', action='store_true')
    args = parser.parse_args()
    if not args.live:
        validate(local)
    else:
        def live(route):
            status, headers, text = fetch(HOST+route)
            expected = (200, 404) if route == '/404.html' else (200,)
            assert status in expected, f'{route}: HTTP {status}'
            return text
        deadline = time.monotonic() + 600
        while True:
            try:
                validate(live)
                break
            except (AssertionError, urllib.error.URLError, TimeoutError, IndexError, StopIteration) as error:
                if time.monotonic() >= deadline:
                    raise
                print('Waiting for production:', str(error), flush=True)
                time.sleep(20)
        for url in (HOST+'/404.html', HOST+'/seo-missing-check-20261002/', HOST+'/sub/reachable/clash/ermao.net', 'https://api.ermao.net/posts/vpn/'):
            try:
                status, headers, body = fetch(url, follow=False)
                canonicals = Document(body).select('link','rel','canonical') if 'text/html' in headers.get('content-type','') else []
                print('HTTP AUDIT', url, status, 'type='+headers.get('content-type',''), 'location='+headers.get('location',''), 'x-robots-tag='+headers.get('x-robots-tag',''), 'canonical='+str(canonicals), flush=True)
            except Exception as error:
                print('HTTP AUDIT UNAVAILABLE', url, type(error).__name__, flush=True)
