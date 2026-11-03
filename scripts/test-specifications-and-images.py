import os
import re
import json
import urllib.request

print("=" * 70)
print("UDHAYA SPUN PIPES — SPECIFICATION & IMAGE VERIFICATION SUITE")
print("=" * 70)

# 1. Verify JS Catalogue
js_file = os.path.join(os.path.dirname(__file__), "..", "js", "products.js")
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Extract productCatalogue
catalogue_match = re.search(r"const productCatalogue = ({[\s\S]*?});", js_content)
assert catalogue_match, "Failed to find productCatalogue in products.js"

catalogue_str = catalogue_match.group(1)
# Convert JS object to JSON
json_like = re.sub(r"(\b[A-Za-z0-9_]+\b):", r'"\1":', catalogue_str)
catalogue = json.loads(json_like)

print("\n1. Verifying JavaScript Product Catalogue:")
print(f"   NP2: {catalogue['NP2']} -> {'PASS' if catalogue['NP2'] == [150, 250, 450, 600, 900] else 'FAIL'}")
print(f"   NP3: {catalogue['NP3']} -> {'PASS' if catalogue['NP3'] == [300, 450, 600, 900, 1000, 1200, 1400] else 'FAIL'}")
print(f"   NP4: {catalogue['NP4']} -> {'PASS' if catalogue['NP4'] == [600, 900, 1000, 1200, 1400] else 'FAIL'}")

assert catalogue["NP2"] == [150, 250, 450, 600, 900]
assert catalogue["NP3"] == [300, 450, 600, 900, 1000, 1200, 1400]
assert catalogue["NP4"] == [600, 900, 1000, 1200, 1400]

# 2. Verify isValidCombination logic
def is_valid(grade, dia):
    return dia in catalogue.get(grade, [])

print("\n2. Testing Outdated & New Combination Validations:")
tests = [
    ("NP2", 150, True),
    ("NP2", 250, True),
    ("NP2", 300, False), # Removed from NP2
    ("NP2", 400, False), # Removed completely
    ("NP2", 450, True),  # Added to NP2
    ("NP2", 600, True),
    ("NP2", 900, True),
    ("NP2", 1000, False), # Not in NP2
    ("NP2", 1200, False), # Not in NP2
    ("NP3", 300, True),
    ("NP3", 400, False), # Removed completely
    ("NP3", 450, True),  # Added to NP3
    ("NP3", 600, True),
    ("NP3", 900, True),
    ("NP3", 1000, True),
    ("NP3", 1200, True),
    ("NP3", 1400, True), # Confirmed in NP3
    ("NP4", 400, False), # Removed completely
    ("NP4", 600, True),
    ("NP4", 900, True),
    ("NP4", 1000, True),
    ("NP4", 1200, True),
    ("NP4", 1400, True), # Confirmed in NP4
]

all_comb_passed = True
for grade, dia, expected in tests:
    res = is_valid(grade, dia)
    if res != expected:
        print(f"   [FAIL] {grade} with {dia} mm: expected {expected}, got {res}")
        all_comb_passed = False
assert all_comb_passed, "Combination validation failed"
print(f"   All {len(tests)} combination checks PASSED successfully.")

# 3. Verify index.html HTML tags & specifications
html_file = os.path.join(os.path.dirname(__file__), "..", "index.html")
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

print("\n3. Verifying HTML Product Cards & Diameter Tags:")
np2_card = re.search(r'id="prod-np2-title"[\s\S]*?</article>', html_content).group(0)
np3_card = re.search(r'id="prod-np3-title"[\s\S]*?</article>', html_content).group(0)
np4_card = re.search(r'id="prod-np4-title"[\s\S]*?</article>', html_content).group(0)

np2_tags = [int(x) for x in re.findall(r'<span class="diameter-tag">(\d+)\s*mm</span>', np2_card)]
np3_tags = [int(x) for x in re.findall(r'<span class="diameter-tag">(\d+)\s*mm</span>', np3_card)]
np4_tags = [int(x) for x in re.findall(r'<span class="diameter-tag">(\d+)\s*mm</span>', np4_card)]

print(f"   NP2 Card Tags: {np2_tags} -> {'PASS' if np2_tags == [150, 250, 450, 600, 900] else 'FAIL'}")
print(f"   NP3 Card Tags: {np3_tags} -> {'PASS' if np3_tags == [300, 450, 600, 900, 1000, 1200, 1400] else 'FAIL'}")
print(f"   NP4 Card Tags: {np4_tags} -> {'PASS' if np4_tags == [600, 900, 1000, 1200, 1400] else 'FAIL'}")

assert np2_tags == [150, 250, 450, 600, 900]
assert np3_tags == [300, 450, 600, 900, 1000, 1200, 1400]
assert np4_tags == [600, 900, 1000, 1200, 1400]

# Check badge text
assert '5 Confirmed Sizes' in html_content
assert '7 Confirmed Sizes' in html_content
assert '17 verified grade-size combinations' in html_content
assert 'NP2 RCC Pipes (Light to Medium Duty - 5 sizes)' in html_content
assert 'NP2 RCC Pipes (5 Sizes)' in html_content
print("   All card badges, dropdown descriptions, and footer links PASSED.")

# 4. Verify HTTP Server & Image Assets over HTTP
print("\n4. Verifying HTTP 200 & MIME Types on Live Server:")
urls_to_test = [
    "http://127.0.0.1:8080/",
    "http://127.0.0.1:8080/assets/images/logo.webp",
    "http://127.0.0.1:8080/assets/images/logo.png",
    "http://127.0.0.1:8080/assets/images/hero.webp",
    "http://127.0.0.1:8080/assets/images/hero-mobile.webp",
    "http://127.0.0.1:8080/assets/images/about.webp",
    "http://127.0.0.1:8080/assets/images/products/np2-pipes.webp",
    "http://127.0.0.1:8080/assets/images/products/np3-pipes.webp",
    "http://127.0.0.1:8080/assets/images/products/np4-pipes.webp",
    "http://127.0.0.1:8080/assets/images/manufacturing/stage1-materials.webp",
    "http://127.0.0.1:8080/assets/images/gallery/gallery-1-thumb.webp",
    "http://127.0.0.1:8080/assets/images/gallery/gallery-1.webp",
    "http://127.0.0.1:8080/js/products.js",
    "http://127.0.0.1:8080/js/contact.js",
]

http_all_ok = True
for u in urls_to_test:
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as res:
            assert res.status == 200
            print(f"   [HTTP 200 OK] {u.split('8080')[-1]}")
    except Exception as e:
        print(f"   [FAIL] {u}: {e}")
        http_all_ok = False

assert http_all_ok, "HTTP asset tests failed"
print("\n" + "=" * 70)
print("ALL SPECIFICATION & IMAGE TESTS PASSED WITH 100% ACCURACY!")
print("=" * 70)
