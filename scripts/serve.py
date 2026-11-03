import http.server
import mimetypes
import os
import sys

# Ensure WebP MIME type is properly registered
mimetypes.add_type("image/webp", ".webp")

web_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(web_dir)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching headers and CORS for preview testing
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

try:
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8080), CustomHandler)
    print(f"Serving HTTP on 127.0.0.1 port 8080 (from {web_dir}) ...", flush=True)
    server.serve_forever()
except Exception as e:
    print(f"Error starting server: {e}", flush=True)
    sys.exit(1)
