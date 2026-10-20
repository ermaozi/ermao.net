#!/usr/bin/env python3
"""Prune only unreachable Vite JS/CSS; preserve Git history and cached-page dependencies."""
import argparse
from datetime import datetime, timezone, timedelta
import io
import json
from pathlib import Path
import re
import shutil
import subprocess
import tarfile
from urllib.parse import unquote

HASHED = re.compile(r'[^/]+-[A-Za-z0-9_-]{8}\.(?:js|css)$')
TOKEN = re.compile(r'''[^\s"'`<>()[\]{},;:=/\\?#]+''')
TEXT = {'.html', '.js', '.css', '.json', '.xml', '.txt', '.webmanifest'}
LIMIT = 20000


def inventory(root):
    result = {}
    for path in root.rglob('*'):
        if '.git' in path.relative_to(root).parts:
            continue
        if path.is_symlink():
            raise ValueError(f'Symlink requires manual review: {path}')
        if path.is_file():
            result[path.relative_to(root).as_posix()] = path
    return result


def references(data):
    return {token for token in TOKEN.findall(unquote(data)) if len(token) < 256 and HASHED.fullmatch(token)}


def plan(build, previous, historical_html=()):
    current, old = inventory(build), inventory(previous)
    assert 'index.html' in current and '404.html' in current, 'Incomplete build'
    combined = {**old, **current}
    candidates = {p for p in old if p.startswith('assets/') and HASHED.fullmatch(p[7:]) and p not in current}
    names = {Path(p).name: p for p in combined if p.startswith('assets/')}
    assert len(names) == sum(p.startswith('assets/') for p in combined), 'Ambiguous asset names'
    edges = {}
    for p, file in combined.items():
        if file.suffix in TEXT:
            edges[p] = references(file.read_text(errors='strict'))
    # All current files and every non-candidate file are roots, including hand-maintained files.
    keep = set(combined) - candidates
    pending = list(keep)
    for text in historical_html:
        for name in references(text):
            assert name in names, f'Missing cached-page dependency: {name}'
            pending.append(names[name])
    checked = set()
    while pending:
        p = pending.pop()
        if p in checked:
            continue
        checked.add(p)
        keep.add(p)
        for name in edges.get(p, ()):
            assert name in names, f'Missing dependency in {p}: {name}'
            pending.append(names[name])
    removed = sorted(candidates - keep)
    count = len(combined) - len(removed)
    assert count < LIMIT, f'{count} files would reach the {LIMIT} Pages limit; manual review required'
    return current, removed, {'before': len(old), 'clean_build': len(current), 'after': count,
                              'retained_historical_assets': len(candidates & keep), 'removed': removed}


def history(repo, hours=48):
    # Keep the latest tree even after an idle period, all recent trees, and the
    # predecessor at the window boundary. Do not age out assets on a quiet site.
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    rows = subprocess.check_output(['git', '-C', str(repo), 'log', '--first-parent', '--format=%H %cI'], text=True).splitlines()
    revisions = []
    for row in rows:
        sha, date = row.split(' ', 1)
        revisions.append(sha)
        if datetime.fromisoformat(date) < cutoff:
            break
    documents = []
    for sha in revisions:
        archive = subprocess.check_output(['git', '-C', str(repo), 'archive', sha, '*.html'])
        with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
            documents.extend(' '.join(references(tar.extractfile(m).read().decode())) for m in tar if m.isfile())
    return revisions, documents


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--build', type=Path, required=True)
    parser.add_argument('--previous', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    assert args.build.resolve() != args.previous.resolve()
    revisions, documents = history(args.previous)
    current, removed, report = plan(args.build, args.previous, documents)
    report['rollback_commit'] = revisions[0]
    report['protected_revisions'] = revisions
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'removed'}))
    if args.apply:
        # Mutate only after the entire dependency closure and budget passed.
        for name, source in current.items():
            target = args.previous / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
        for name in removed:
            (args.previous / name).unlink()
        assert len(inventory(args.previous)) == report['after']


if __name__ == '__main__':
    main()
