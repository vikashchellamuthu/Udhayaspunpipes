import urllib.request
import urllib.error

urls = [
    "http://127.0.0.1:8080/",
    "http://127.0.0.1:8080/css/style.css",
    "http://127.0.0.1:8080/js/main.js",
    "http://127.0.0.1:8080/assets/images/logo.webp",
    "http://127.0.0.1:8080/assets/images/logo.png",
    "http://127.0.0.1:8080/assets/images/hero.webp",
    "http://127.0.0.1:8080/assets/images/hero-mobile.webp",
    "http://127.0.0.1:8080/assets/images/about.webp",
    "http://127.0.0.1:8080/assets/images/products/np2-pipes.webp",
    "http://127.0.0.1:8080/assets/images/products/np3-pipes.webp",
    "http://127.0.0.1:8080/assets/images/products/np4-pipes.webp",
    "http://127.0.0.1:8080/assets/images/manufacturing/stage1-materials.webp",
    "http://127.0.0.1:8080/assets/images/manufacturing/stage2-mixing.webp",
    "http://127.0.0.1:8080/assets/images/manufacturing/stage3-moulding.webp",
    "http://127.0.0.1:8080/assets/images/gallery/gallery-1-thumb.webp",
    "http://127.0.0.1:8080/assets/images/gallery/gallery-1.webp",
]

print("Testing HTTP Server endpoints:")
all_ok = True
for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            content_length = resp.headers.get("Content-Length", "unknown")
            content_type = resp.headers.get("Content-Type", "unknown")
            print(f"  [HTTP {resp.status}] {url.split('8080')[-1]} ({content_type}, {content_length} bytes)")
    except urllib.error.HTTPError as e:
        print(f"  [FAIL {e.code}] {url}")
        all_ok = False
    except Exception as e:
        print(f"  [ERROR] {url}: {e}")
        all_ok = False

if all_ok:
    print("\nALL HTTP ENDPOINTS TESTED AND RETURNING 200 OK!")
else:
    print("\nSOME ENDPOINTS FAILED!")
