import os

backup_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "images-backup")
current_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "images")

files_to_compare = [
    ("logo.png", "logo.webp"),
    ("hero.jpg", "hero.webp"),
    ("about.jpg", "about.webp"),
    ("products/np2-pipes.jpg", "products/np2-pipes.webp"),
    ("products/np3-pipes.jpg", "products/np3-pipes.webp"),
    ("products/np4-pipes.jpg", "products/np4-pipes.webp"),
    ("manufacturing/stage1-materials.jpg", "manufacturing/stage1-materials.webp"),
    ("manufacturing/stage2-mixing.jpg", "manufacturing/stage2-mixing.webp"),
    ("manufacturing/stage3-moulding.jpg", "manufacturing/stage3-moulding.webp"),
    ("manufacturing/stage4-curing.jpg", "manufacturing/stage4-curing.webp"),
    ("manufacturing/stage5-inspection.jpg", "manufacturing/stage5-inspection.webp"),
    ("manufacturing/stage6-dispatch.jpg", "manufacturing/stage6-dispatch.webp"),
    ("gallery/gallery-1.jpg", "gallery/gallery-1-thumb.webp"),
    ("gallery/gallery-2.jpg", "gallery/gallery-2-thumb.webp"),
    ("gallery/gallery-3.jpg", "gallery/gallery-3-thumb.webp"),
    ("gallery/gallery-4.jpg", "gallery/gallery-4-thumb.webp"),
    ("gallery/gallery-5.jpg", "gallery/gallery-5-thumb.webp"),
    ("gallery/gallery-6.jpg", "gallery/gallery-6-thumb.webp"),
]

print(f"{'Asset':<36} | {'Original':<10} | {'Optimized':<10} | {'Fallback JPG/PNG':<16} | {'Savings':<8}")
print("-" * 92)

total_orig = 0
total_opt = 0

for orig_rel, opt_rel in files_to_compare:
    orig_path = os.path.join(backup_dir, orig_rel)
    opt_path = os.path.join(current_dir, opt_rel)
    fallback_path = os.path.join(current_dir, orig_rel)
    
    orig_size = os.path.getsize(orig_path) if os.path.exists(orig_path) else 0
    opt_size = os.path.getsize(opt_path) if os.path.exists(opt_path) else 0
    fallback_size = os.path.getsize(fallback_path) if os.path.exists(fallback_path) else 0
    
    total_orig += orig_size
    total_opt += opt_size
    
    saving = ((orig_size - opt_size) / orig_size * 100) if orig_size else 0
    print(f"{orig_rel:<36} | {orig_size/1024:>7.1f} KB | {opt_size/1024:>7.1f} KB | {fallback_size/1024:>12.1f} KB | {saving:>6.1f}%")

print("-" * 92)
print(f"{'TOTAL (Page Load Asset Flow)':<36} | {total_orig/1024:>7.1f} KB | {total_opt/1024:>7.1f} KB | {'-':<16} | {((total_orig - total_opt)/total_orig*100):>6.1f}%")
print(f"Total size reduction: {(total_orig - total_opt)/(1024*1024):.2f} MB saved!")
