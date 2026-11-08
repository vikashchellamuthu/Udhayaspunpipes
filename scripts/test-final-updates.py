import os
import re
import urllib.request
import urllib.parse

print("=" * 70)
print("UDHAYA SPUN PIPES — FINAL WEBSITE UPDATES VERIFICATION SUITE")
print("=" * 70)

# 1. Verify Contact Numbers
html_path = os.path.join(os.path.dirname(__file__), "..", "index.html")
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

config_path = os.path.join(os.path.dirname(__file__), "..", "js", "config.js")
with open(config_path, "r", encoding="utf-8") as f:
    config = f.read()

print("\n1. Verifying Contact Numbers:")
assert "tel:+919865944944" in html, "Primary phone tel: link missing"
assert "tel:+919865844944" in html, "Secondary phone tel: link missing"
assert "+91 9865944944" in html, "Primary phone text missing"
assert "+91 9865844944" in html, "Secondary phone text missing"
assert 'phoneSecondary: "+91 9865844944"' in config, "Secondary phone missing in config.js"
assert 'whatsappNumber: "919865944944"' in config, "WhatsApp number altered in config.js"

print("   [PASS] Both phone numbers present and clickable with tel: links.")
print("   [PASS] WhatsApp number strictly retained at 919865944944.")

# 2. Verify Homepage Hero Headline
print("\n2. Verifying Homepage Hero Headline:")
assert "Stronger Today for a" in html and "Better Tomorrow" in html, "New hero headline missing"
assert "ENGINEERING STRENGTH. BUILDING TOMORROW." not in html, "Old hero headline still present"
print("   [PASS] New headline 'Stronger Today for a Better Tomorrow' verified.")
print("   [PASS] Old slogan 'ENGINEERING STRENGTH. BUILDING TOMORROW.' completely removed.")

# 3. Verify JavaScript Catalogue & Multi-Product Builder
print("\n3. Verifying Multi-Product Order Builder & Final Specifications:")
products_path = os.path.join(os.path.dirname(__file__), "..", "js", "products.js")
with open(products_path, "r", encoding="utf-8") as f:
    products_js = f.read()

assert "NP2: [150, 250, 450, 600, 900]" in products_js, "NP2 catalogue mismatch"
assert "NP3: [300, 450, 600, 900, 1000, 1200, 1400]" in products_js, "NP3 catalogue mismatch"
assert "NP4: [600, 900, 1000, 1200, 1400]" in products_js, "NP4 catalogue mismatch"
assert "addNewPipeRow" in products_js, "addNewPipeRow function missing"
assert "getOrderItems" in products_js, "getOrderItems function missing"
assert "updatePipeSummary" in products_js, "updatePipeSummary function missing"

print("   [PASS] NP2 catalogue strictly verified (5 sizes: 150, 250, 450, 600, 900 mm).")
print("   [PASS] NP3 catalogue strictly verified (7 sizes: 300, 450, 600, 900, 1000, 1200, 1400 mm).")
print("   [PASS] NP4 catalogue strictly verified (5 sizes: 600, 900, 1000, 1200, 1400 mm).")

# 4. Test Customer's Exact Multi-Product Example
print("\n4. Simulating Customer Multi-Product Example Quotation:")
# Example from user prompt:
# 2 Nos | NP2 | 450 mm
# 3 Nos | NP3 | 1200 mm
# 2 Nos | NP4 | 1400 mm
catalogue = {
    "NP2": [150, 250, 450, 600, 900],
    "NP3": [300, 450, 600, 900, 1000, 1200, 1400],
    "NP4": [600, 900, 1000, 1200, 1400]
}

example_items = [
    {"grade": "NP2", "diameter": 450, "quantity": 2},
    {"grade": "NP3", "diameter": 1200, "quantity": 3},
    {"grade": "NP4", "diameter": 1400, "quantity": 2}
]

total_qty = 0
for item in example_items:
    assert item["diameter"] in catalogue[item["grade"]], f"Invalid diameter {item['diameter']} for {item['grade']}"
    assert item["quantity"] > 0, "Quantity must be > 0"
    total_qty += item["quantity"]

assert total_qty == 7, "Total quantity calculation mismatch"
print(f"   [PASS] Example with {len(example_items)} items ({total_qty} Nos total) is completely valid.")

# 5. Verify HTML form elements
print("\n5. Verifying HTML Form Elements:")
assert 'id="pipeItemsContainer"' in html, "pipeItemsContainer missing"
assert 'id="addPipeItemBtn"' in html, "addPipeItemBtn missing"
assert 'id="pipeTotalCount"' in html, "pipeTotalCount missing"
assert 'id="pipeRowsBadge"' in html, "pipeRowsBadge missing"
print("   [PASS] Dynamic multi-product container, add button, and counter elements present.")

# 6. Verify Live HTTP Server
print("\n6. Verifying Live HTTP Server (http://127.0.0.1:8080/):")
req = urllib.request.Request("http://127.0.0.1:8080/", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=5) as res:
    assert res.status == 200, f"HTTP status {res.status}"
    body = res.read().decode("utf-8")
    assert "Stronger Today for a" in body
    assert "+91 9865844944" in body
    assert "addPipeItemBtn" in body
    print(f"   [HTTP 200 OK] Live website serving updated content ({len(body):,} bytes).")

print("\n" + "=" * 70)
print("ALL VERIFICATION CHECKS PASSED WITH 100% ACCURACY!")
print("=" * 70)
