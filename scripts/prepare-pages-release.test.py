import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('release', Path(__file__).with_name('prepare-pages-release.py'))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)


class ReleaseTests(unittest.TestCase):
    def test_closure_preserves_current_cached_manual_and_non_js_assets(self):
        with tempfile.TemporaryDirectory() as tmp:
            build, old = Path(tmp)/'build', Path(tmp)/'old'
            def write(root, name, text):
                p = root/name; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(text)
            write(build, 'index.html', '<script src="/assets/app-new00001.js"></script>')
            write(build, '404.html', '404')
            write(build, 'assets/app-new00001.js', 'import("./lazy-new00002.js?v=1")')
            write(build, 'assets/lazy-new00002.js', '')
            for name, text in {
                'assets/app-old00001.js': 'import("./lazy-old00002.js")',
                'assets/lazy-old00002.js': '"assets/style-old00003.css"',
                'assets/style-old00003.css': '',
                'assets/unused-dead0001.js': '"./unused-dead0002.js"',
                'assets/unused-dead0002.js': '',
                'assets/manual.js': '"./custom-keep0001.js"',
                'assets/custom-keep0001.js': '',
                'assets/photo-dead0001.png': 'image',
                'assets/manual-12345678.js': 'uploaded',
                'historic/index.html': 'keep route',
                'CNAME': 'www.ermao.net',
                'user-data.txt': 'keep data',
            }.items(): write(old, name, text)
            current, removed, report = r.plan(build, old, ['<script src="/assets/app-old00001.js"></script>'], ['assets/manual-12345678.js'])
            self.assertEqual(removed, ['assets/unused-dead0001.js', 'assets/unused-dead0002.js'])
            self.assertEqual(report['after'], 14)

    def test_missing_dependency_and_limit_fail_closed_without_deleting(self):
        with tempfile.TemporaryDirectory() as tmp:
            build, old = Path(tmp)/'build', Path(tmp)/'old'
            build.mkdir(); old.mkdir()
            (build/'index.html').write_text('"/assets/missing-12345678.js"')
            (build/'404.html').write_text('404')
            with self.assertRaisesRegex(AssertionError, 'Missing dependency'): r.plan(build, old)
            (build/'index.html').write_text('ok')
            limit = r.LIMIT
            try:
                r.LIMIT = 2
                with self.assertRaisesRegex(AssertionError, 'Pages limit'): r.plan(build, old)
            finally: r.LIMIT = limit

    def test_symlink_is_not_followed(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp); (p/'link').symlink_to('/tmp')
            with self.assertRaisesRegex(ValueError, 'Symlink'): r.inventory(p)


if __name__ == '__main__': unittest.main()
