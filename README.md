# UDHAYA SPUN PIPES — Corporate Website Portal

Enterprise-grade, mobile-responsive corporate website for **Udhaya Spun Pipes**, an RCC (Reinforced Cement Concrete) pipe manufacturing and wholesale supply company located in Manamadurai, Sivaganga, Tamil Nadu, India.

---

## 1. Verified Company Information

- **Company Name:** Udhaya Spun Pipes
- **Business Focus:** RCC Pipe Manufacturing and Wholesale Supply
- **Registered Works Address:** Moongiloorani, Kannar Street, Manamadurai, Sivaganga, Tamil Nadu, India.
- **Phone:** [+91 9865944944](tel:+919865944944)
- **WhatsApp:** [+91 9865944944](https://wa.me/919865944944)
- **Email:** [udhayaspunpipes@gmail.com](mailto:udhayaspunpipes@gmail.com)
- **Supply Coverage:** All over Tamil Nadu
- **Production Capacity:** Flexible production capacity that can be maximised according to customer requirements.

---

## 2. Confirmed Product Catalogue (17 Grade-Size Combinations)

> [!IMPORTANT]
> All measurements refer strictly to **INTERNAL DIAMETER (ID)** in millimeters (mm).

| Grade | Classification | Confirmed Internal Diameters (ID) | Total Sizes |
| :--- | :--- | :--- | :---: |
| **NP2** | Light to Medium Duty | 150 mm, 250 mm, 450 mm, 600 mm, 900 mm | **5** |
| **NP3** | Medium Duty (Road Loading) | 300 mm, 450 mm, 600 mm, 900 mm, 1000 mm, 1200 mm, 1400 mm | **7** |
| **NP4** | Heavy Duty (High Load/Railways) | 600 mm, 900 mm, 1000 mm, 1200 mm, 1400 mm | **5** |

- **Total Confirmed Combinations:** 17
- **Unique Diameter Options:** 9 (150 mm, 250 mm, 300 mm, 450 mm, 600 mm, 900 mm, 1000 mm, 1200 mm, 1400 mm)

---

## 3. Technology Stack

- **HTML5:** Semantic architecture, accessible landmarks, OpenGraph & Schema.org JSON-LD structured data.
- **CSS3:** Custom properties design system, modern flexbox & CSS grid, fluid typography (`clamp`), mobile-first responsive breakpoints (360px to 1920px).
- **Vanilla JavaScript:** Clean, modular, separated scripts (`main.js`, `products.js`, `contact.js`, `config.js`) without external framework dependencies.
- **Typography:** Manrope / Montserrat for headings, Inter for body copy.
- **Integrations:**
  - Dynamic grade-diameter product filtering
  - WhatsApp instant quotation delivery (`https://wa.me/919865944944`)
  - EmailJS email dispatch integration (`udhayaspunpipes@gmail.com`)
  - Interactive lightbox gallery
  - Embedded Google Maps directions

---

## 4. Project Directory Structure

```
udhaya-spun-pipes/
├── index.html                   # Complete semantic website portal
├── css/
│   └── style.css                # Premium corporate design system & responsive styling
├── js/
│   ├── config.js                # EmailJS, WhatsApp, and company configuration
│   ├── products.js              # Confirmed product catalogue & dynamic dropdown logic
│   ├── contact.js               # Form validation, honeypot & quotation dispatch
│   └── main.js                  # Sticky nav, scrollspy, mobile menu, lightbox & animations
├── assets/
│   ├── images/
│   │   ├── logo.png             # Original / high-res company logo (540x100)
│   │   ├── logo.svg             # Scalable corporate vector emblem
│   │   ├── favicon.svg          # Browser tab icon
│   │   ├── hero.jpg             # High-res RCC pipe infrastructure hero banner
│   │   ├── about.jpg            # Precast facility & manufacturing overview
│   │   ├── products/
│   │   │   ├── np2-pipes.jpg    # NP2 grade concrete pipes
│   │   │   ├── np3-pipes.jpg    # NP3 grade concrete pipes
│   │   │   └── np4-pipes.jpg    # NP4 grade heavy concrete pipes
│   │   ├── manufacturing/
│   │   │   ├── stage1-materials.jpg   # Raw material preparation
│   │   │   ├── stage2-mixing.jpg      # Concrete batching & mixing
│   │   │   ├── stage3-moulding.jpg    # Spun moulding compaction
│   │   │   ├── stage4-curing.jpg      # Hydration & water curing
│   │   │   ├── stage5-inspection.jpg  # Dimensional inspection
│   │   │   └── stage6-dispatch.jpg    # Yard loading & transport
│   │   └── gallery/
│   │       ├── gallery-1.jpg    # Finished pipe stacking yard
│   │       ├── gallery-2.jpg    # Manufacturing facility operations
│   │       ├── gallery-3.jpg    # Inventory & batch storage
│   │       ├── gallery-4.jpg    # Large diameter (1000/1200mm) pipes
│   │       ├── gallery-5.jpg    # Precast culvert infrastructure
│   │       └── gallery-6.jpg    # Site dispatch & delivery
│   └── icons/                   # Reusable vector icons
├── README.md                    # Project documentation & deployment manual
├── sitemap.xml                  # Search engine XML sitemap
├── robots.txt                   # Search crawler directives
└── .gitignore                   # Version control ignore list
```

---

## 5. Local Preview & Running Instructions

### Option 1: Direct File Open
Double click `index.html` in your file explorer. The website is completely self-contained with relative paths and runs in any browser.

### Option 2: Using Python HTTP Server (Recommended)
Open a terminal in the `udhaya-spun-pipes` folder and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000/` in your browser.

### Option 3: Using Node.js `npx serve`
```bash
npx serve .
```

---

## 6. How to Replace Images and Logo

1. **Company Logo:**
   - To update with an original logo file, simply place your transparent PNG file at `assets/images/logo.png`.
   - Recommended dimensions: 540px wide by 100px high.

2. **Facility & Yard Photos:**
   - Replace any image in `assets/images/gallery/` or `assets/images/products/` keeping the same file name.
   - Images are automatically styled with responsive aspect ratios.

---

## 7. EmailJS Integration Configuration

Customer quotation enquiries are routed to `udhayaspunpipes@gmail.com`.

To activate live EmailJS delivery:
1. Register for free at [EmailJS](https://www.emailjs.com/).
2. Connect your Gmail service (`udhayaspunpipes@gmail.com`) and copy the **Service ID**.
3. Create an Email Template with these template variables:
   - `{{customer_name}}`
   - `{{customer_phone}}`
   - `{{customer_email}}`
   - `{{company_name}}`
   - `{{pipe_grade}}`
   - `{{pipe_diameter}}`
   - `{{quantity}}`
   - `{{delivery_location}}`
   - `{{message}}`
4. Copy the **Template ID** and your **Public Key** (Account > API Keys).
5. Open `js/config.js` and update the three placeholders:
   ```javascript
   emailjs: {
     publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
     serviceId: "YOUR_EMAILJS_SERVICE_ID",
     templateId: "YOUR_EMAILJS_TEMPLATE_ID"
   }
   ```
*Note: If EmailJS is not configured, the website automatically falls back to pre-filled WhatsApp enquiry delivery, ensuring no leads are ever lost!*

---

## 8. Deployment Manual

### Deploy to Netlify (Drag & Drop)
1. Go to [app.netlify.com](https://app.netlify.com/).
2. Drag and drop the `udhaya-spun-pipes` folder into the Netlify deploy zone.
3. Your website is instantly live with free HTTPS.

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`.
2. Inside `udhaya-spun-pipes/`, run `vercel`.

### Deploy to GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings** > **Pages** > Select branch `main` and folder `/ (root)` or `/udhaya-spun-pipes`.
3. Save to publish.
