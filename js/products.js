/**
 * UDHAYA SPUN PIPES - Product Catalogue & Dynamic Multi-Product Order Builder
 * 
 * Strict specifications:
 * - All measurements refer exclusively to INTERNAL DIAMETER (ID) in millimeters.
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
 * Initializes the Dynamic Multi-Product Order Builder
 */
function initProductSelector() {
  const container = document.getElementById("pipeItemsContainer");
  const addBtn = document.getElementById("addPipeItemBtn");

  if (!container) return;

  // Bind initial row(s)
  const initialRows = container.querySelectorAll(".pipe-item-row");
  initialRows.forEach((row, index) => {
    bindRowEvents(row);
  });
  updatePipeSummary();

  // "Add Another Pipe" button handler
  if (addBtn) {
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();
      addNewPipeRow();
    });
  }

  // Attach event listeners to all "Enquire Now" buttons on product cards
  const enquireButtons = document.querySelectorAll("[data-enquire-grade]");
  enquireButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const targetGrade = this.getAttribute("data-enquire-grade");
      const targetDiameter = this.getAttribute("data-enquire-diameter");

      // Scroll to quotation section smoothly
      const quoteSection = document.getElementById("quotation");
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // If the first row is unselected, configure it; otherwise add a new row
      const rows = container.querySelectorAll(".pipe-item-row");
      const firstRow = rows[0];
      const firstGradeSelect = firstRow ? firstRow.querySelector(".item-grade") : null;

      if (firstGradeSelect && (!firstGradeSelect.value || rows.length === 1 && !firstRow.querySelector(".item-diameter")?.value)) {
        firstGradeSelect.value = targetGrade;
        populateRowDiameters(firstRow, targetGrade, targetDiameter);
        highlightRow(firstRow);
      } else {
        const newRow = addNewPipeRow(targetGrade, targetDiameter);
        highlightRow(newRow);
      }
    });
  });
}

/**
 * Creates and appends a new pipe requirement row
 * @param {string} [initialGrade] 
 * @param {string|number} [initialDiameter] 
 * @param {string|number} [initialQuantity] 
 * @returns {HTMLElement}
 */
function addNewPipeRow(initialGrade = "", initialDiameter = "", initialQuantity = "") {
  const container = document.getElementById("pipeItemsContainer");
  if (!container) return null;

  const rows = container.querySelectorAll(".pipe-item-row");
  const newIndex = rows.length;
  const rowNumber = newIndex + 1;

  const row = document.createElement("div");
  row.className = "pipe-item-row";
  row.setAttribute("data-row-index", newIndex);

  row.innerHTML = `
    <div class="pipe-item-row-header">
      <span class="pipe-item-row-label">Pipe Requirement #${rowNumber}</span>
      <button type="button" class="btn-remove-row" aria-label="Remove this pipe requirement" title="Remove this pipe requirement">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span>Remove</span>
      </button>
    </div>

    <div class="pipe-item-row-grid">
      <!-- Pipe Grade -->
      <div class="form-group mb-0">
        <label class="form-label">Pipe Grade <span class="required">*</span></label>
        <select class="form-control item-grade" required>
          <option value="">-- Select Grade (NP2/NP3/NP4) --</option>
          <option value="NP2">NP2 (Light to Medium Duty - 5 sizes)</option>
          <option value="NP3">NP3 (Medium Duty Road Load - 7 sizes)</option>
          <option value="NP4">NP4 (Heavy Duty High Load - 5 sizes)</option>
        </select>
      </div>

      <!-- Pipe Diameter -->
      <div class="form-group mb-0">
        <label class="form-label">Diameter (Internal Diameter / ID) <span class="required">*</span></label>
        <select class="form-control item-diameter" disabled required>
          <option value="">-- Select Grade First --</option>
        </select>
      </div>

      <!-- Quantity -->
      <div class="form-group mb-0">
        <label class="form-label">Quantity (Nos) <span class="required">*</span></label>
        <input type="number" class="form-control item-quantity" placeholder="e.g. 50" min="1" step="1" value="${initialQuantity}" required>
      </div>
    </div>
  `;

  container.appendChild(row);
  bindRowEvents(row);

  if (initialGrade) {
    const gradeSelect = row.querySelector(".item-grade");
    if (gradeSelect) {
      gradeSelect.value = initialGrade;
      populateRowDiameters(row, initialGrade, initialDiameter);
    }
  }

  updatePipeSummary();
  return row;
}

/**
 * Binds event listeners to inputs within a single pipe requirement row
 * @param {HTMLElement} row 
 */
function bindRowEvents(row) {
  if (!row) return;

  const gradeSelect = row.querySelector(".item-grade");
  const diameterSelect = row.querySelector(".item-diameter");
  const quantityInput = row.querySelector(".item-quantity");
  const removeBtn = row.querySelector(".btn-remove-row");

  // Grade selection changed
  gradeSelect?.addEventListener("change", function () {
    const grade = this.value;
    const currentDiameter = diameterSelect ? diameterSelect.value : "";
    populateRowDiameters(row, grade, currentDiameter);
    clearRowError(row);
    updatePipeSummary();
  });

  // Diameter selection changed
  diameterSelect?.addEventListener("change", function () {
    clearRowError(row);
    updatePipeSummary();
  });

  // Quantity input changed
  quantityInput?.addEventListener("input", function () {
    clearRowError(row);
    updatePipeSummary();
  });

  // Remove button clicked
  removeBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    const container = document.getElementById("pipeItemsContainer");
    const allRows = container ? container.querySelectorAll(".pipe-item-row") : [];

    if (allRows.length > 1) {
      // Animate removal
      row.style.opacity = "0";
      row.style.transform = "scale(0.98)";
      setTimeout(() => {
        row.remove();
        refreshRowLabels();
        updatePipeSummary();
      }, 150);
    } else {
      // If only 1 row remains, reset it to empty state
      if (gradeSelect) gradeSelect.value = "";
      if (diameterSelect) {
        diameterSelect.innerHTML = '<option value="">-- Select Grade First --</option>';
        diameterSelect.disabled = true;
      }
      if (quantityInput) quantityInput.value = "";
      clearRowError(row);
      updatePipeSummary();
    }
  });
}

/**
 * Populates diameter options for a specific row based on selected grade
 * Preserves diameter if valid in the new grade, otherwise resets.
 * @param {HTMLElement} row 
 * @param {string} grade 
 * @param {string|number} [preferredDiameter] 
 */
function populateRowDiameters(row, grade, preferredDiameter = null) {
  if (!row) return;
  const diameterSelect = row.querySelector(".item-diameter");
  if (!diameterSelect) return;

  diameterSelect.innerHTML = '<option value="">-- Select Available Diameter --</option>';

  if (!grade || !productCatalogue[grade]) {
    diameterSelect.disabled = true;
    diameterSelect.innerHTML = '<option value="">-- Select Grade First --</option>';
    return;
  }

  diameterSelect.disabled = false;
  const availableSizes = productCatalogue[grade];
  const targetDiaNum = preferredDiameter ? Number(preferredDiameter) : null;
  let isSelected = false;

  availableSizes.forEach(size => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = `${size} mm (Internal Diameter / ID)`;
    if (targetDiaNum && targetDiaNum === size) {
      option.selected = true;
      isSelected = true;
    }
    diameterSelect.appendChild(option);
  });

  // If previous diameter is not available in the new grade, reset selection
  if (!isSelected && preferredDiameter) {
    diameterSelect.value = "";
  }
}

/**
 * Refreshes row labels (#1, #2...) after additions or removals
 */
function refreshRowLabels() {
  const container = document.getElementById("pipeItemsContainer");
  if (!container) return;
  const rows = container.querySelectorAll(".pipe-item-row");
  rows.forEach((r, idx) => {
    r.setAttribute("data-row-index", idx);
    const label = r.querySelector(".pipe-item-row-label");
    if (label) {
      label.textContent = `Pipe Requirement #${idx + 1}`;
    }
  });
}

/**
 * Updates summary badges, total pipes count, and remove button disable states
 */
function updatePipeSummary() {
  const container = document.getElementById("pipeItemsContainer");
  const badge = document.getElementById("pipeRowsBadge");
  const totalCountEl = document.getElementById("pipeTotalCount");

  if (!container) return;
  const rows = container.querySelectorAll(".pipe-item-row");

  // Update rows badge
  if (badge) {
    badge.textContent = `${rows.length} ${rows.length === 1 ? "Requirement" : "Requirements"}`;
  }

  // Update remove buttons state
  rows.forEach(r => {
    const removeBtn = r.querySelector(".btn-remove-row");
    if (removeBtn) {
      if (rows.length === 1) {
        removeBtn.setAttribute("title", "Clear this pipe requirement");
      } else {
        removeBtn.setAttribute("title", "Remove this pipe requirement");
      }
    }
  });

  // Calculate total pipes quantity
  let totalQty = 0;
  rows.forEach(r => {
    const qtyInput = r.querySelector(".item-quantity");
    const val = qtyInput ? parseInt(qtyInput.value, 10) : 0;
    if (!isNaN(val) && val > 0) {
      totalQty += val;
    }
  });

  if (totalCountEl) {
    totalCountEl.textContent = `${totalQty} Nos`;
  }
}

/**
 * Highlights a row temporarily to draw customer focus
 * @param {HTMLElement} row 
 */
function highlightRow(row) {
  if (!row) return;
  row.classList.add("highlight-field");
  setTimeout(() => row.classList.remove("highlight-field"), 1600);
}

/**
 * Clears error highlight on a specific row
 * @param {HTMLElement} row 
 */
function clearRowError(row) {
  if (!row) return;
  row.classList.remove("row-invalid");
  const existingHint = row.querySelector(".row-error-hint");
  if (existingHint) existingHint.remove();
}

/**
 * Shows error message on a specific row
 * @param {HTMLElement} row 
 * @param {string} msg 
 */
function showRowError(row, msg) {
  if (!row) return;
  row.classList.add("row-invalid");
  let hint = row.querySelector(".row-error-hint");
  if (!hint) {
    hint = document.createElement("div");
    hint.className = "row-error-hint";
    row.appendChild(hint);
  }
  hint.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>${msg}</span>
  `;
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

/**
 * Collects all current product requirement items from the form
 * @returns {Array<{grade: string, diameter: number, quantity: number, isValid: boolean, error?: string}>}
 */
function getOrderItems() {
  const container = document.getElementById("pipeItemsContainer");
  if (!container) return [];
  const rows = container.querySelectorAll(".pipe-item-row");
  const items = [];

  rows.forEach((row, idx) => {
    const grade = row.querySelector(".item-grade")?.value.trim() || "";
    const diameterStr = row.querySelector(".item-diameter")?.value.trim() || "";
    const quantityStr = row.querySelector(".item-quantity")?.value.trim() || "";
    const diameter = diameterStr ? Number(diameterStr) : null;
    const quantity = quantityStr ? Number(quantityStr) : null;

    let isValid = true;
    let error = "";

    if (!grade) {
      isValid = false;
      error = "Please select a pipe grade.";
    } else if (!diameter) {
      isValid = false;
      error = "Please select an available internal diameter.";
    } else if (!isValidCombination(grade, diameter)) {
      isValid = false;
      error = `${diameter} mm is not an available size for ${grade}.`;
    } else if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      isValid = false;
      error = "Please enter a positive whole number for quantity.";
    }

    items.push({
      rowElement: row,
      rowIndex: idx + 1,
      grade,
      diameter,
      quantity,
      isValid,
      error
    });
  });

  return items;
}

// Expose to window for global access, testing, and form submission
if (typeof window !== "undefined") {
  window.productCatalogue = productCatalogue;
  window.gradeDetails = gradeDetails;
  window.isValidCombination = isValidCombination;
  window.addNewPipeRow = addNewPipeRow;
  window.getOrderItems = getOrderItems;
  window.updatePipeSummary = updatePipeSummary;
  window.showRowError = showRowError;
  window.clearRowError = clearRowError;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initProductSelector);
