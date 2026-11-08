/**
 * UDHAYA SPUN PIPES - Contact & Multi-Product Quotation Form Handler
 * 
 * Implements:
 * - Real-time and submit validation for customer fields
 * - Strict multi-product order validation (NP2, NP3, NP4 with confirmed diameters)
 * - Indian mobile number validation (10 digits starting with 6-9)
 * - Dynamic multi-pipe requirements collection & summary
 * - Anti-spam honeypot
 * - WhatsApp multi-product enquiry builder (properly URL-encoded)
 * - EmailJS integration with itemized specifications payload & fallback
 */

document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quotationForm");
  const submitBtn = document.getElementById("quoteSubmitBtn");
  const whatsappSubmitBtn = document.getElementById("quoteWhatsAppBtn");
  const alertContainer = document.getElementById("formAlert");

  if (!quoteForm) return;

  // Real-time phone input validation listener
  const phoneInput = document.getElementById("quotePhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^\d+ ]/g, "");
      validatePhone(this);
    });
  }

  // Handle WhatsApp Direct Send Button
  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const formData = getFormData();
      if (!validateForm(formData)) return;
      sendViaWhatsApp(formData);
    });
  }

  // Handle Form Submission (EmailJS + WhatsApp confirmation)
  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check anti-spam honeypot
    const honeypot = document.getElementById("quoteWebsite");
    if (honeypot && honeypot.value.trim() !== "") {
      console.warn("Spam submission detected and discarded.");
      return;
    }

    const formData = getFormData();
    if (!validateForm(formData)) return;

    // Show loading state
    setButtonLoading(submitBtn, true, "Processing Quotation Request...");
    clearAlert(alertContainer);

    // Format itemized summaries
    const itemsFormattedText = formData.items.map((item, idx) => 
      `${idx + 1}. Grade ${item.grade} - ${item.diameter} mm (Internal Diameter / ID) — ${item.quantity} Nos`
    ).join("\n");

    const itemsShortSummary = formData.items.map(item => 
      `${item.grade} ${item.diameter}mm (${item.quantity} Nos)`
    ).join(", ");

    // Check if EmailJS is configured
    if (typeof emailjs !== "undefined" && typeof CONFIG !== "undefined" && CONFIG.emailjs && CONFIG.emailjs.isConfigured()) {
      try {
        emailjs.init(CONFIG.emailjs.publicKey);

        const templateParams = {
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || "Not Provided",
          company_name: formData.company || "Not Provided",
          delivery_location: formData.location,
          pipe_requirements: itemsFormattedText,
          items_summary: itemsShortSummary,
          total_pipes_count: `${formData.totalQuantity} Nos`,
          pipe_grade: itemsShortSummary,
          pipe_diameter: formData.items.map(i => `${i.diameter}mm`).join(", "),
          quantity: `${formData.totalQuantity} Nos`,
          message: formData.message || "None",
          submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        };

        const response = await emailjs.send(
          CONFIG.emailjs.serviceId,
          CONFIG.emailjs.templateId,
          templateParams
        );

        if (response.status === 200) {
          showAlert(
            alertContainer,
            "success",
            `<strong>Quotation Request Sent Successfully!</strong><br>
            We have received your multi-product enquiry for <strong>${formData.items.length} pipe specification(s) (${formData.totalQuantity} Nos total)</strong>.<br>
            Our sales team at Udhaya Spun Pipes will contact you promptly at <strong>${formData.phone}</strong>. You may also click below to forward your exact requirements directly to our business WhatsApp.`
          );
          
          appendWhatsAppSyncButton(alertContainer, formData, false);
          resetQuotationForm();
        } else {
          throw new Error("EmailJS returned status " + response.status);
        }
      } catch (error) {
        console.error("EmailJS submission error:", error);
        showAlert(
          alertContainer,
          "error",
          "<strong>Email transmission encountered an issue.</strong> Please click below to send your quotation directly via WhatsApp for an immediate response."
        );
        appendWhatsAppSyncButton(alertContainer, formData, true);
      } finally {
        setButtonLoading(submitBtn, false, "Submit Quotation Request");
      }
    } else {
      // EmailJS not configured yet - explain clearly and trigger WhatsApp delivery
      setButtonLoading(submitBtn, false, "Submit Quotation Request");
      
      showAlert(
        alertContainer,
        "info",
        `<strong>Quotation Request Validated Successfully!</strong><br>
        Your enquiry with <strong>${formData.items.length} pipe requirement(s) (${formData.totalQuantity} Nos total)</strong> is ready.<br>
        Opening your verified enquiry directly in <strong>WhatsApp (+91 9865944944)</strong> now...`
      );

      // Automatically launch prefilled WhatsApp message
      setTimeout(() => {
        sendViaWhatsApp(formData);
      }, 700);

      appendWhatsAppSyncButton(alertContainer, formData, false);
    }
  });
});

/**
 * Extracts and trims all form values including all multi-product requirement rows
 * @returns {object}
 */
function getFormData() {
  const items = typeof getOrderItems === "function" ? getOrderItems() : [];
  let totalQuantity = 0;
  items.forEach(item => {
    if (item.isValid && item.quantity) {
      totalQuantity += item.quantity;
    }
  });

  return {
    name: document.getElementById("quoteName")?.value.trim() || "",
    phone: document.getElementById("quotePhone")?.value.trim() || "",
    email: document.getElementById("quoteEmail")?.value.trim() || "",
    company: document.getElementById("quoteCompany")?.value.trim() || "",
    location: document.getElementById("quoteLocation")?.value.trim() || "",
    message: document.getElementById("quoteMessage")?.value.trim() || "",
    items: items,
    totalQuantity: totalQuantity
  };
}

/**
 * Validates customer details and each individual product requirement row
 * @param {object} data 
 * @returns {boolean}
 */
function validateForm(data) {
  let isValid = true;
  const nameField = document.getElementById("quoteName");
  const phoneField = document.getElementById("quotePhone");
  const emailField = document.getElementById("quoteEmail");
  const locationField = document.getElementById("quoteLocation");

  // 1. Customer Name check
  if (!data.name || data.name.length < 2) {
    showFieldError(nameField, "Please enter your full name (minimum 2 characters).");
    isValid = false;
  } else {
    clearFieldError(nameField);
  }

  // 2. Phone check (Indian 10-digit mobile number)
  const phoneClean = data.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(phoneClean)) {
    showFieldError(phoneField, "Please enter a valid 10-digit Indian mobile number (e.g. 9865944944).");
    isValid = false;
  } else {
    clearFieldError(phoneField);
  }

  // 3. Email check (optional, but validate format if entered)
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showFieldError(emailField, "Please enter a valid email address or leave it blank.");
      isValid = false;
    } else {
      clearFieldError(emailField);
    }
  } else {
    clearFieldError(emailField);
  }

  // 4. Delivery Location check
  if (!data.location || data.location.length < 3) {
    showFieldError(locationField, "Please enter your project site / delivery location in Tamil Nadu.");
    isValid = false;
  } else {
    clearFieldError(locationField);
  }

  // 5. Multi-product rows check
  if (!data.items || data.items.length === 0) {
    const alertContainer = document.getElementById("formAlert");
    showAlert(alertContainer, "error", "Please add at least one RCC pipe requirement to your quotation.");
    isValid = false;
  } else {
    let hasInvalidRow = false;
    data.items.forEach(item => {
      if (!item.isValid) {
        hasInvalidRow = true;
        if (typeof showRowError === "function") {
          showRowError(item.rowElement, item.error || "Please complete this pipe requirement.");
        }
      } else {
        if (typeof clearRowError === "function") {
          clearRowError(item.rowElement);
        }
      }
    });

    if (hasInvalidRow) {
      isValid = false;
      const alertContainer = document.getElementById("formAlert");
      showAlert(
        alertContainer,
        "error",
        "<strong>Incomplete Pipe Requirements:</strong> Please select a grade, an available internal diameter (ID), and a valid positive quantity for each added pipe row."
      );
    }
  }

  return isValid;
}

function validatePhone(input) {
  const clean = input.value.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  if (clean.length > 0 && !/^[6-9]\d{0,9}$/.test(clean)) {
    showFieldError(input, "Indian mobile numbers start with 6, 7, 8, or 9.");
  } else {
    clearFieldError(input);
  }
}

function showFieldError(input, message) {
  if (!input) return;
  input.classList.add("input-error");
  let errorEl = input.parentNode.querySelector(".field-error-message");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.className = "field-error-message";
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove("input-error");
  const errorEl = input.parentNode.querySelector(".field-error-message");
  if (errorEl) {
    errorEl.remove();
  }
}

/**
 * Builds the exact required WhatsApp text with all multi-product requirements
 * @param {object} data 
 */
function sendViaWhatsApp(data) {
  const itemsText = data.items.map((item, idx) => 
    `${idx + 1}. Grade ${item.grade} | ${item.diameter} mm (Internal Diameter / ID) — ${item.quantity} Nos`
  ).join("\n");

  const messageLines = [
    "📦 *NEW RCC PIPE QUOTATION ENQUIRY*",
    "🏢 *UDHAYA SPUN PIPES — MANAMADURAI*",
    "-----------------------------------------",
    `👤 *Customer Name:* ${data.name}`,
    `📞 *Phone Number:* ${data.phone}`,
    `🏢 *Company:* ${data.company || "Not Provided"}`,
    `✉️ *Email:* ${data.email || "Not Provided"}`,
    `📍 *Delivery Location:* ${data.location}`,
    "",
    `📋 *ORDER SPECIFICATIONS (${data.items.length} Pipe Item${data.items.length > 1 ? "s" : ""}):*`,
    itemsText,
    "",
    `📊 *Total Quantity:* ${data.totalQuantity} Nos`,
    `📝 *Additional Message:* ${data.message || "None"}`,
    "-----------------------------------------",
    "_Submitted via Udhaya Spun Pipes Website_"
  ];

  const fullMessage = messageLines.join("\n");
  const encodedMessage = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${CONFIG.company.whatsappNumber}?text=${encodedMessage}`;

  // Open WhatsApp in new tab
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  // Inform customer they must tap Send in WhatsApp
  const alertContainer = document.getElementById("formAlert");
  if (alertContainer) {
    showAlert(
      alertContainer,
      "success",
      `<strong>WhatsApp Chat Opened in New Tab!</strong><br>
      Your order for <strong>${data.items.length} item(s) (${data.totalQuantity} Nos total)</strong> is prefilled.<br>
      Please tap <strong>Send</strong> in WhatsApp to deliver your enquiry directly to Udhaya Spun Pipes.`
    );
  }
}

function resetQuotationForm() {
  const quoteForm = document.getElementById("quotationForm");
  if (!quoteForm) return;
  quoteForm.reset();

  const container = document.getElementById("pipeItemsContainer");
  if (container) {
    const rows = container.querySelectorAll(".pipe-item-row");
    // Leave only 1 clean row
    rows.forEach((r, idx) => {
      if (idx === 0) {
        const grade = r.querySelector(".item-grade");
        const dia = r.querySelector(".item-diameter");
        const qty = r.querySelector(".item-quantity");
        if (grade) grade.value = "";
        if (dia) {
          dia.innerHTML = '<option value="">-- Select Grade First --</option>';
          dia.disabled = true;
        }
        if (qty) qty.value = "";
        if (typeof clearRowError === "function") clearRowError(r);
      } else {
        r.remove();
      }
    });
  }

  if (typeof updatePipeSummary === "function") {
    updatePipeSummary();
  }
}

function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${text}`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || text;
  }
}

function showAlert(container, type, htmlContent) {
  if (!container) return;
  container.className = `form-alert alert-${type}`;
  container.innerHTML = htmlContent;
  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearAlert(container) {
  if (!container) return;
  container.innerHTML = "";
  container.className = "form-alert";
  container.style.display = "none";
}

function appendWhatsAppSyncButton(container, data, isError = false) {
  if (!container) return;
  const existingSyncBtn = container.querySelector(".btn-whatsapp-sync");
  if (existingSyncBtn) existingSyncBtn.remove();

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-whatsapp-sync";
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg> ${isError ? 'Send Enquiry via WhatsApp Instead' : 'Also Send via WhatsApp'}`;
  
  btn.addEventListener("click", () => sendViaWhatsApp(data));
  container.appendChild(btn);
}
