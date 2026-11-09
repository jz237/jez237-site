import json
from pathlib import Path
import re
import subprocess
import tempfile
import unittest
from prepare_pages_mirror import check_size, prepare_routes, redirect_page, fallback_script, retirement_worker


def run_script(source, location):
    harness = '''
const vm = require('node:vm');
const [source, values] = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
let result = null;
vm.runInNewContext(source, {location: {...values, replace: url => {result = url;}}});
process.stdout.write(JSON.stringify(result));
'''
    return json.loads(subprocess.check_output(['node', '-e', harness],
                      input=json.dumps([source, location]), text=True))


class MirrorTests(unittest.TestCase):
    def test_routes_preserve_entrypoints_without_assets(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / '404.html').write_text('<html><head></head><body>Missing</body></html>')
            (root / 'keep.txt').write_text('untouched')
            result = prepare_routes(root, ['games/index.html', 'games/a/play.html',
                'games/a/sw.js', 'games/a/music.mp3', 'demos/b/index.html',
                'experiments/keep/index.html'])
            self.assertEqual(result, {'redirect_pages': 3, 'retired_workers': 1})
            self.assertFalse((root / 'games/a/music.mp3').exists())
            self.assertEqual((root / 'keep.txt').read_text(), 'untouched')
            self.assertIn('https://jez237.com/demos/b/', (root / 'demos/b/index.html').read_text())
            self.assertIn('Missing', (root / '404.html').read_text())
            self.assertIn('pages-mirror-routing', (root / '404.html').read_text())

    def test_query_hash_and_special_paths_survive_redirect(self):
        page = redirect_page('games/a space/play.html')
        source = re.search(r'<script>(.*?)</script>', page).group(1)
        result = run_script(source, {'search': '?room=a%26b&mode=coop', 'hash': '#level-2'})
        self.assertEqual(result, 'https://jez237.com/games/a%20space/play.html?room=a%26b&mode=coop#level-2')
        self.assertIn('<noscript>', page)
        self.assertIn('href="https://jez237.com/games/a%20space/play.html"', page)

    def test_404_only_routes_mirror_interactive_paths(self):
        source = re.search(r'<script[^>]*>(.*?)</script>', fallback_script(), re.S).group(1)
        for path in ['/jez237-site/games/a/room', '/jez237-site/demos/b/custom']:
            self.assertEqual(run_script(source, {'pathname': path, 'search': '?x=1', 'hash': '#y'}),
                'https://jez237.com/' + path.removeprefix('/jez237-site/') + '?x=1#y')
        for path in ['/jez237-site/not-found', '/other/games/a', '/jez237-site/games-evil/a']:
            self.assertIsNone(run_script(source, {'pathname': path, 'search': '', 'hash': ''}))

    def test_retired_worker_only_moves_its_own_clients(self):
        harness = '''
const vm = require('node:vm');
const source = require('node:fs').readFileSync(0, 'utf8');
const events = {}, moved = [];
let unregistered = false;
const clients = ['https://jz237.github.io/jez237-site/games/a/?room=2#go',
  'https://jz237.github.io/jez237-site/games/b/', 'https://jz237.github.io/other/'];
vm.runInNewContext(source, {URL, self: {
  addEventListener: (event, handler) => events[event] = handler,
  skipWaiting: async () => {},
  registration: {scope: 'https://jz237.github.io/jez237-site/games/a/',
    unregister: async () => { unregistered = true; }},
  clients: {matchAll: async () => clients.map(url => ({url, navigate: async to => moved.push(to)}))}
}});
events.activate({waitUntil: promise => promise.then(() => {
  process.stdout.write(JSON.stringify({unregistered, moved}));
}).catch(error => {console.error(error); process.exitCode = 1;})});
'''
        result = json.loads(subprocess.check_output(['node', '-e', harness],
            input=retirement_worker(), text=True))
        self.assertEqual(result, {'unregistered': True,
            'moved': ['https://jez237.com/games/a/?room=2#go']})

    def test_payload_guard_rejects_total_not_just_individual_file_size(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'one').write_bytes(b'x' * 100)
            (root / 'two').write_bytes(b'y' * 100)
            expected = 200 + 2 * 2048 + 10240
            self.assertEqual(check_size(root, expected)['file_bytes'], 200)
            with self.assertRaisesRegex(ValueError, 'exceeds'):
                check_size(root, expected - 1)

    def test_guard_rejects_empty_payload_and_symlinks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            with self.assertRaisesRegex(ValueError, 'Empty'):
                check_size(root)
            (root / 'link').symlink_to('/does-not-exist')
            with self.assertRaisesRegex(ValueError, 'Symlinks'):
                check_size(root)

    def test_no_repository_or_existing_game_content_can_be_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / '.git').write_text('gitdir: example')
            with self.assertRaisesRegex(ValueError, 'not a repository'):
                prepare_routes(root, [])
            (root / '.git').unlink()
            (root / 'games').mkdir()
            with self.assertRaisesRegex(ValueError, 'refusing to overwrite'):
                prepare_routes(root, [])

if __name__ == '__main__':
    unittest.main()
