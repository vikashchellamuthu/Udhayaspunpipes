import os
from PIL import Image

base = r'udhaya-spun-pipes\assets\images'
total_bytes = 0
items = []
for root, dirs, files in os.walk(base):
    for f in files:
        p = os.path.join(root, f)
        size = os.path.getsize(p)
        total_bytes += size
        try:
            with Image.open(p) as img:
                w, h = img.size
                fmt = img.format
        except Exception:
            w, h, fmt = '-', '-', 'SVG/OTHER'
        rel = os.path.relpath(p, base).replace('\\', '/')
        items.append((rel, fmt, f"{w}x{h}", f"{size/1024:.1f} KB", size))

print(f"Total images: {len(items)}, Total size: {total_bytes/1024/1024:.2f} MB\n")
print(f"{'File':<45} {'Format':<10} {'Dimensions':<14} {'Size':<10}")
print("-" * 80)
for it in sorted(items, key=lambda x: x[0]):
    print(f"{it[0]:<45} {it[1]:<10} {it[2]:<14} {it[3]:<10}")
