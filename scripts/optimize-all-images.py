import os
import shutil
from PIL import Image

BASE_DIR = r"c:\Users\user\OneDrive\Documents\antigravity\udhaya-spun-pipes\assets\images"
BACKUP_DIR = r"c:\Users\user\OneDrive\Documents\antigravity\udhaya-spun-pipes\assets\images-backup"

def ensure_dir(d):
    if not os.path.exists(d):
        os.makedirs(d, exist_ok=True)

def backup_originals():
    ensure_dir(BACKUP_DIR)
    for root, dirs, files in os.walk(BASE_DIR):
        if "images-backup" in root:
            continue
        rel = os.path.relpath(root, BASE_DIR)
        dest_root = os.path.join(BACKUP_DIR, rel)
        ensure_dir(dest_root)
        for f in files:
            src = os.path.join(root, f)
            dest = os.path.join(dest_root, f)
            if not os.path.exists(dest):
                shutil.copy2(src, dest)
    print("All original images safely backed up to assets/images-backup/")

def resize_proportional(img, max_w, max_h):
    w, h = img.size
    ratio = min(max_w / w, max_h / h)
    if ratio >= 1.0:
        return img
    new_w = int(round(w * ratio))
    new_h = int(round(h * ratio))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)

def optimize_photo(src_path, dest_webp, dest_jpg, max_w, max_h, q_webp=82, q_jpg=80):
    with Image.open(src_path) as img:
        img_rgb = img.convert("RGB")
        resized = resize_proportional(img_rgb, max_w, max_h)
        
        # Save WebP
        resized.save(dest_webp, "WEBP", quality=q_webp, method=6)
        
        # Save Optimized Progressive JPEG fallback
        resized.save(dest_jpg, "JPEG", quality=q_jpg, optimize=True, progressive=True)

def optimize_logo():
    src_logo = os.path.join(BACKUP_DIR, "logo.png")
    dest_webp = os.path.join(BASE_DIR, "logo.webp")
    dest_png = os.path.join(BASE_DIR, "logo.png")
    
    with Image.open(src_logo) as img:
        img = img.convert("RGBA")
        # 384x384 is 8x the display size of 48x48, ultra-sharp on 4K / Retina
        resized = resize_proportional(img, 384, 384)
        
        # Save lossless/high-quality WebP with full alpha channel
        resized.save(dest_webp, "WEBP", quality=92, method=6)
        
        # Save optimized PNG with alpha
        resized.save(dest_png, "PNG", optimize=True)

def run():
    backup_originals()
    
    results = []
    
    # 1. Logo
    optimize_logo()
    orig_logo_size = os.path.getsize(os.path.join(BACKUP_DIR, "logo.png"))
    webp_logo_size = os.path.getsize(os.path.join(BASE_DIR, "logo.webp"))
    png_logo_size = os.path.getsize(os.path.join(BASE_DIR, "logo.png"))
    results.append(("logo.png / logo.webp", orig_logo_size, webp_logo_size, png_logo_size))
    
    # 2. Hero (Desktop & Mobile)
    src_hero = os.path.join(BACKUP_DIR, "hero.jpg")
    dest_hero_webp = os.path.join(BASE_DIR, "hero.webp")
    dest_hero_jpg = os.path.join(BASE_DIR, "hero.jpg")
    optimize_photo(src_hero, dest_hero_webp, dest_hero_jpg, 1440, 1080, q_webp=82, q_jpg=80)
    
    # Hero Mobile
    dest_hero_mob_webp = os.path.join(BASE_DIR, "hero-mobile.webp")
    dest_hero_mob_jpg = os.path.join(BASE_DIR, "hero-mobile.jpg")
    optimize_photo(src_hero, dest_hero_mob_webp, dest_hero_mob_jpg, 768, 576, q_webp=80, q_jpg=78)
    
    orig_hero_size = os.path.getsize(src_hero)
    results.append(("hero.jpg (desktop)", orig_hero_size, os.path.getsize(dest_hero_webp), os.path.getsize(dest_hero_jpg)))
    results.append(("hero-mobile.jpg (mobile <=768px)", orig_hero_size, os.path.getsize(dest_hero_mob_webp), os.path.getsize(dest_hero_mob_jpg)))
    
    # 3. About
    src_about = os.path.join(BACKUP_DIR, "about.jpg")
    dest_about_webp = os.path.join(BASE_DIR, "about.webp")
    dest_about_jpg = os.path.join(BASE_DIR, "about.jpg")
    optimize_photo(src_about, dest_about_webp, dest_about_jpg, 1000, 750, q_webp=82, q_jpg=80)
    results.append(("about.jpg", os.path.getsize(src_about), os.path.getsize(dest_about_webp), os.path.getsize(dest_about_jpg)))
    
    # 4. Products
    for p_name in ["np2-pipes", "np3-pipes", "np4-pipes"]:
        src_p = os.path.join(BACKUP_DIR, "products", f"{p_name}.jpg")
        dest_p_webp = os.path.join(BASE_DIR, "products", f"{p_name}.webp")
        dest_p_jpg = os.path.join(BASE_DIR, "products", f"{p_name}.jpg")
        optimize_photo(src_p, dest_p_webp, dest_p_jpg, 800, 533, q_webp=82, q_jpg=80)
        results.append((f"products/{p_name}.jpg", os.path.getsize(src_p), os.path.getsize(dest_p_webp), os.path.getsize(dest_p_jpg)))
        
    # 5. Manufacturing
    for m_name in [
        "stage1-materials", "stage2-mixing", "stage3-moulding",
        "stage4-curing", "stage5-inspection", "stage6-dispatch"
    ]:
        src_m = os.path.join(BACKUP_DIR, "manufacturing", f"{m_name}.jpg")
        dest_m_webp = os.path.join(BASE_DIR, "manufacturing", f"{m_name}.webp")
        dest_m_jpg = os.path.join(BASE_DIR, "manufacturing", f"{m_name}.jpg")
        optimize_photo(src_m, dest_m_webp, dest_m_jpg, 600, 450, q_webp=82, q_jpg=80)
        results.append((f"manufacturing/{m_name}.jpg", os.path.getsize(src_m), os.path.getsize(dest_m_webp), os.path.getsize(dest_m_jpg)))

    # 6. Gallery (Full & Thumbnail)
    for g_num in range(1, 7):
        g_name = f"gallery-{g_num}"
        src_g = os.path.join(BACKUP_DIR, "gallery", f"{g_name}.jpg")
        
        # Full lightbox version (1200px)
        dest_g_webp = os.path.join(BASE_DIR, "gallery", f"{g_name}.webp")
        dest_g_jpg = os.path.join(BASE_DIR, "gallery", f"{g_name}.jpg")
        optimize_photo(src_g, dest_g_webp, dest_g_jpg, 1200, 900, q_webp=82, q_jpg=80)
        
        # Grid thumbnail version (600px)
        dest_g_thumb_webp = os.path.join(BASE_DIR, "gallery", f"{g_name}-thumb.webp")
        dest_g_thumb_jpg = os.path.join(BASE_DIR, "gallery", f"{g_name}-thumb.jpg")
        optimize_photo(src_g, dest_g_thumb_webp, dest_g_thumb_jpg, 600, 450, q_webp=80, q_jpg=78)
        
        results.append((f"gallery/{g_name}.jpg (full)", os.path.getsize(src_g), os.path.getsize(dest_g_webp), os.path.getsize(dest_g_jpg)))
        results.append((f"gallery/{g_name}-thumb.jpg (thumb)", os.path.getsize(src_g), os.path.getsize(dest_g_thumb_webp), os.path.getsize(dest_g_thumb_jpg)))

    print("\n" + "="*85)
    print(f"{'Asset':<35} {'Original':<12} {'WebP':<12} {'Opt JPG/PNG':<14} {'WebP Savings'}")
    print("="*85)
    
    total_orig = 0
    total_webp = 0
    total_opt = 0
    for name, orig, webp, opt in results:
        total_orig += orig
        total_webp += webp
        total_opt += opt
        savings = (1 - webp / orig) * 100 if orig > 0 else 0
        print(f"{name:<35} {orig/1024:>7.1f} KB   {webp/1024:>7.1f} KB   {opt/1024:>9.1f} KB   {savings:>6.1f}%")
        
    print("="*85)
    print(f"{'TOTALS':<35} {total_orig/1024:>7.1f} KB   {total_webp/1024:>7.1f} KB   {total_opt/1024:>9.1f} KB   {(1 - total_webp/total_orig)*100:>6.1f}%\n")

if __name__ == "__main__":
    run()
