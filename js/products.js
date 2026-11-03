/**
 * UDHAYA SPUN PIPES - Product Catalogue & Dynamic Product Selector
 * 
 * Strict specifications:
 * - All measurements refer exclusively to INTERNAL DIAMETER (ID).
 * - NP2: 5 sizes [150, 250, 450, 600, 900] mm
 * - NP3: 7 sizes [300, 450, 600, 900, 1000, 1200, 1400] mm
 * - NP4: 5 sizes [600, 900, 1000, 1200, 1400] mm
 * - Total: 17 confirmed grade-size combinations across 9 unique diameters (150 mm to 1400 mm).
 */

// Exact confirmed product catalogue data structure
const productCatalogue = {
  NP2: [150, 250, 450, 600, 900],
  NP3: [300, 450, 600, 900, 1000, 1200, 1400],
  NP4: [600, 900, 1000, 1200, 1400]
};

// Descriptions and confirmed positioning for each grade
const gradeDetails = {
  NP2: {
    name: "NP2 RCC Pipes",
    class: "Light to Medium Duty",
    description: "Designed for gravity drainage, irrigation, non-heavy traffic culverts, and general storm water passage.",
    sizesCount: 5,
    diameters: [150, 250, 450, 600, 900]
  },
  NP3: {
    name: "NP3 RCC Pipes",
    class: "Medium Duty (Standard Road Loading)",
    description: "Engineered for road crossings, highways, urban drainage, and areas subject to medium vehicular loads.",
    sizesCount: 7,
    diameters: [300, 450, 600, 900, 1000, 1200, 1400]
  },
  NP4: {
    name: "NP4 RCC Pipes",
    class: "Heavy Duty (High Load Applications)",
    description: "Heavy-duty structural pipes engineered for railway tracks, major highways, and high-overburden infrastructure installations.",
    sizesCount: 5,
    diameters: [600, 900, 1000, 1200, 1400]
  }
};

/**
 * Initializes the Dynamic Product Selector in the Quotation Form
 */
function initProductSelector() {
  const gradeSelect = document.getElementById("quoteGrade");
  const diameterSelect = document.getElementById("quoteDiameter");
  const diameterHint = document.getElementById("diameterHint");

  if (!gradeSelect || !diameterSelect) return;

  // Grade selection change event handler
  gradeSelect.addEventListener("change", function () {
    const selectedGrade = this.value;
    populateDiameters(selectedGrade);
  });

  // Attach event listeners to all "Enquire Now" buttons on product cards
  const enquireButtons = document.querySelectorAll("[data-enquire-grade]");
  enquireButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const targetGrade = this.getAttribute("data-enquire-grade");
      const targetDiameter = this.getAttribute("data-enquire-diameter");

      // Scroll to quotation section
      const quoteSection = document.getElementById("quotation");
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Preselect grade and populate diameters
      if (gradeSelect) {
        gradeSelect.value = targetGrade;
        populateDiameters(targetGrade, targetDiameter);
        
        // Highlight form field temporarily
        gradeSelect.classList.add("highlight-field");
        setTimeout(() => gradeSelect.classList.remove("highlight-field"), 1500);
      }
    });
  });
}

/**
 * Populates diameter options based on chosen grade
 * @param {string} grade - NP2 | NP3 | NP4
 * @param {string|number} [selectedDiameter] - Optional diameter to auto-select
 */
function populateDiameters(grade, selectedDiameter = null) {
  const diameterSelect = document.getElementById("quoteDiameter");
  const diameterHint = document.getElementById("diameterHint");
  if (!diameterSelect) return;

  // Reset dropdown
  diameterSelect.innerHTML = '<option value="">-- Select Available Diameter --</option>';

  if (!grade || !productCatalogue[grade]) {
    diameterSelect.disabled = true;
    if (diameterHint) {
      diameterHint.textContent = "Please select a pipe grade first to view confirmed diameters.";
      diameterHint.className = "form-hint";
    }
    return;
  }

  // Enable diameter select
  diameterSelect.disabled = false;
  const availableSizes = productCatalogue[grade];

  availableSizes.forEach(size => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = `${size} mm (Internal Diameter / ID)`;
    if (selectedDiameter && Number(selectedDiameter) === size) {
      option.selected = true;
    }
    diameterSelect.appendChild(option);
  });

  if (diameterHint) {
    diameterHint.innerHTML = `Showing <strong>${availableSizes.length} confirmed sizes</strong> for grade <strong>${grade}</strong> (Internal Diameter / ID).`;
    diameterHint.className = "form-hint form-hint-active";
  }

  // Trigger change event for validation check
  diameterSelect.dispatchEvent(new Event("change"));
}

/**
 * Validates whether a specific grade-diameter combination is strictly valid
 * @param {string} grade 
 * @param {number|string} diameter 
 * @returns {boolean}
 */
function isValidCombination(grade, diameter) {
  if (!productCatalogue[grade]) return false;
  const numDia = Number(diameter);
  return productCatalogue[grade].includes(numDia);
}

// Expose to window for global access and testing
if (typeof window !== "undefined") {
  window.productCatalogue = productCatalogue;
  window.gradeDetails = gradeDetails;
  window.isValidCombination = isValidCombination;
  window.populateDiameters = populateDiameters;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initProductSelector);
