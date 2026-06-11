# Dev-only static server with caching disabled (browser always sees fresh files).
# Usage: python devserver.py [port]   — serves the game folder. Not used in production.
import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8747
print(f"serving (no-cache) on http://127.0.0.1:{port}/")
ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
