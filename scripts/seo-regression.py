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
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from urllib.robotparser import RobotFileParser
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

def revision(doc):
    values = doc.select('meta', 'name', 'ermao:build-revision')
    assert len(values) == 1 and values[0].get('content'), 'Missing or duplicate build revision'
    return values[0]['content']


def validate_indexable(route, doc, expected_revision):
    assert revision(doc) == expected_revision, f'{route}: stale or mixed deployment revision'
    assert doc.select('link', 'rel', 'canonical') == [{'rel': 'canonical', 'href': HOST + route}], route
    descriptions = doc.select('meta', 'name', 'description')
    assert len(descriptions) == 1 and descriptions[0].get('content', '').strip(), f'{route}: missing/duplicate description'
    for name in ('robots', 'googlebot', 'bingbot'):
        for meta in doc.select('meta', 'name', name):
            tokens = re.split(r'[\s,;]+', meta.get('content', '').lower())
            assert not {'noindex', 'none'} & set(tokens), f'{route}: indexing is blocked'
    urls = doc.select('meta', 'property', 'og:url')
    assert len(urls) == 1 and urls[0].get('content') == HOST + route, f'{route}: wrong Open Graph URL'


def validate_discovery(robots, sitemap):
    parser = RobotFileParser()
    parser.parse(robots.splitlines())
    for crawler in ('Googlebot', 'Bingbot', 'YandexBot'):
        for route in ('/', '/posts/vpn/', '/airport/', '/blog/freeappleid/', '/article/z747kgjd/'):
            assert parser.can_fetch(crawler, HOST + route), f'{crawler} blocked from {route}'
    assert 'Sitemap: ' + HOST + '/sitemap.xml' in robots
    root = ET.fromstring(sitemap)
    namespace = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    locations = [node.text for node in root.findall('s:url/s:loc', namespace)]
    assert len(locations) == len(set(locations)), 'Duplicate sitemap URLs'
    for url in locations:
        parsed = urlsplit(url)
        assert parsed.scheme == 'https' and parsed.netloc == 'www.ermao.net', f'Noncanonical sitemap host: {url}'
        assert not parsed.query and not parsed.fragment, f'Parameterized sitemap URL: {url}'
        assert parsed.path not in ('/404', '/404.html', '/en/404.html', '/stats/', '/en/stats/'), url
        assert not parsed.path.startswith('/sub/'), url
    for route in ('/', '/en/', '/posts/vpn/', '/en/posts/vpn/', '/airport/', '/page/2/', '/blog/freeappleid/', '/en/blog/freeappleid/', '/article/z747kgjd/', '/en/article/z747kgjd/'):
        assert HOST + route in locations, f'Missing sitemap URL: {route}'


def critical_assets(doc):
    paths = set()
    for tag, attrs in doc.tags:
        url = attrs.get('src') if tag == 'script' and attrs.get('type') == 'module' else None
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'modulepreload'):
            url = attrs.get('href')
        if url and url.startswith('/assets/'):
            paths.add(url)
    return paths


def validate_asset(url, status, content_type, body):
    assert status == 200, f'{url}: HTTP {status}'
    mime = content_type.partition(';')[0].strip().lower()
    suffix = Path(urlsplit(url).path).suffix
    allowed = {'text/css'} if suffix == '.css' else {'text/javascript', 'application/javascript', 'application/x-javascript'}
    assert mime in allowed, f'{url}: unexpected Content-Type {content_type}'
    assert body.strip() and not body.lstrip().lower().startswith(('<!doctype html', '<html')), f'{url}: empty or HTML asset response'



CORE_ROUTES = tuple(
    prefix + suffix
    for prefix in ('/', '/en/')
    for suffix in ('', 'page/2/', 'posts/vpn/', 'airport/', 'blog/freeappleid/', 'article/z747kgjd/', 'blog/flybit/', 'blog/guangsuyun/', 'blog/asspp-download-guide/')
)


def probe_url(url, expected_revision, nonce):
    parts = urlsplit(url)
    query = parse_qsl(parts.query, keep_blank_values=True)
    query.extend((('ermao_release', expected_revision), ('ermao_probe', str(nonce))))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def validate_http_indexability(route, headers):
    mime = headers.get('content-type', '').partition(';')[0].lower().strip()
    assert mime == 'text/html', f'{route}: unexpected HTML Content-Type {mime}'
    robots = headers.get('x-robots-tag', '').lower()
    assert not re.search(r'\b(?:noindex|none)\b', robots), f'{route}: blocked by X-Robots-Tag'


def canonical_status(expected_revision, assets, fetcher=fetch):
    results = []
    public_assets = set()
    pending = False
    try:
        for route in CORE_ROUTES:
            status, headers, body = fetcher(HOST + route)
            assert status == 200, f'{route}: HTTP {status}'
            validate_http_indexability(route, headers)
            doc = Document(body)
            public_assets.update(critical_assets(doc))
            markers = doc.select('meta', 'name', 'ermao:build-revision')
            actual = markers[0].get('content') if len(markers) == 1 else None
            current = actual == expected_revision
            if current:
                validate_indexable(route, doc, expected_revision)
            else:
                pending = True
            results.append({'route': route, 'revision': actual, 'current': current,
                            'age': headers.get('age'), 'cache_control': headers.get('cache-control'),
                            'cf_cache_status': headers.get('cf-cache-status')})
        # Stale HTML is only a healthy propagation delay if the assets it
        # currently asks browsers to load are still available.
        if not pending:
            public_assets.update(assets)
        for asset in sorted(public_assets):
            status, headers, body = fetcher(HOST + asset)
            validate_asset(asset, status, headers.get('content-type', ''), body)
    except (AssertionError, urllib.error.URLError, TimeoutError, ValueError) as error:
        print('CANONICAL_STATUS ' + json.dumps({'status': 'error', 'expected_revision': expected_revision,
              'error': str(error), 'routes': results}, ensure_ascii=False), flush=True)
        return 1
    state = 'pending' if pending else 'current'
    print('CANONICAL_STATUS ' + json.dumps({'status': state, 'expected_revision': expected_revision,
          'routes': results}, ensure_ascii=False), flush=True)
    print('Public URL cache propagation is still pending; release verification does not establish propagation.'
          if pending else 'PASS public URLs and their critical assets have reached the expected release.', flush=True)
    return 2 if pending else 0


def validate_content_freshness(route, doc):
    visible = re.sub(r'\s+', '', ' '.join(doc.text))
    required = {
        '/posts/vpn/': ('96元/年60GB/月', '99元/年59GB/月'),
        '/blog/guangsuyun/': ('历史优惠记录', '尚未核实商家是否延期或另有活动'),
        '/en/blog/guangsuyun/': ('An extension or replacement offer has not been verified',),
        '/blog/freeappleid/': ('不能保证免验证', '以上恢复操作仅适用于你自己的账户'),
        '/en/blog/freeappleid/': ('Recovery applies only to an account you own',),
        '/blog/asspp-download-guide/': ('停止安装，不要绕过告警', '无法确认来源或完整性时停止安装'),
        '/en/blog/asspp-download-guide/': ('Do not bypass the warning', 'stop and contact the developer if the source or integrity is uncertain'),
    }
    for text in required.get(route, ()):
        assert re.sub(r'\s+', '', text) in visible, f'{route}: missing corrected content: {text}'
    if route == '/blog/guangsuyun/':
        description = doc.select('meta', 'name', 'description')[0]['content']
        assert '当前优惠待商家确认' in description, 'Guangsu coupon metadata is stale'
        faq = next(s for s in doc.schemas if s.get('@type') == 'FAQPage')
        answer = faq['mainEntity'][0]['acceptedAnswer']['text']
        assert '该日期已过' in answer and '需向商家核实' in answer, 'Guangsu coupon FAQ is stale'


def validate(read):
    expected_revision = revision(Document(local('/')))
    for route in CORE_ROUTES:
        doc = Document(read(route))
        validate_indexable(route, doc, expected_revision)
        validate_content_freshness(route, doc)
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
    validate_discovery(read('/robots.txt'), read('/sitemap.xml'))
    print('PASS exact build revision, indexability, robots, sitemap and 404 noindex', flush=True)


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
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--live', action='store_true', help='Verify the release through fresh CDN query keys')
    mode.add_argument('--canonical-status', action='store_true', help='Check unparameterized public URL propagation (pending=2)')
    mode.add_argument('--http-audit', action='store_true')
    args = parser.parse_args()
    if args.http_audit:
        audit_http()
    elif not args.live and not args.canonical_status:
        validate(local)
    else:
        expected_revision = revision(Document(local('/')))
        assert re.fullmatch(r'[a-f0-9]{40}', expected_revision), 'Live verification requires a Git commit build revision'
        assets = set().union(*(critical_assets(Document(local(route))) for route in CORE_ROUTES))
        assert assets, 'No critical assets found in the local build'
        if args.canonical_status:
            raise SystemExit(canonical_status(expected_revision, assets))
        nonce = None
        def live(route):
            status, headers, text = fetch(probe_url(HOST + route, expected_revision, nonce))
            expected = (200, 404) if route == '/404.html' else (200,)
            assert status in expected, f'{route}: HTTP {status}'
            if route in CORE_ROUTES:
                validate_http_indexability(route, headers)
            return text
        deadline = time.monotonic() + 180
        while True:
            try:
                nonce = time.time_ns()
                validate(live)
                for asset in sorted(assets):
                    status, headers, body = fetch(probe_url(HOST + asset, expected_revision, nonce))
                    validate_asset(asset, status, headers.get('content-type', ''), body)
                print(f'PASS release {expected_revision} and {len(assets)} critical assets through fresh CDN query keys.', flush=True)
                print('This does not establish unparameterized public URL propagation; run --canonical-status separately.', flush=True)
                break
            except (AssertionError, urllib.error.URLError, TimeoutError, IndexError, StopIteration) as error:
                if time.monotonic() >= deadline:
                    raise
                print('Waiting for production:', str(error), flush=True)
                time.sleep(20)
