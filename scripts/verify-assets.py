import os
import re

html_path = os.path.join(os.path.dirname(__file__), "..", "index.html")
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all ./assets/images/...
matches = re.findall(r'(\./assets/images/[^\s\"\'>]+)', content)
unique_paths = sorted(set(matches))

print(f"Found {len(unique_paths)} unique image paths in index.html:")
missing = []
total_bytes = 0
for p in unique_paths:
    clean_p = p.split("?")[0]
    local_path = os.path.join(os.path.dirname(__file__), "..", clean_p.replace("./", ""))
    if os.path.exists(local_path):
        size = os.path.getsize(local_path)
        total_bytes += size
        print(f"  [OK] {clean_p} ({size:,} bytes)")
    else:
        print(f"  [MISSING] {clean_p}")
        missing.append(clean_p)

print(f"\nTotal asset size referenced: {total_bytes / (1024 * 1024):.2f} MB")

if missing:
    print(f"ERROR: {len(missing)} missing files!")
    exit(1)
else:
    print("ALL ASSETS VERIFIED SUCCESSFULLY!")
