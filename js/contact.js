/**
 * UDHAYA SPUN PIPES - Contact & Quotation Form Handler
 * 
 * Implements:
 * - Real-time and submit validation
 * - Indian mobile number validation (10 digits starting with 6-9)
 * - Positive quantity validation
 * - Dynamic grade and diameter compatibility check
 * - Anti-spam honeypot
 * - WhatsApp enquiry builder (properly URL-encoded)
 * - EmailJS integration with fallback & non-mocked delivery state
 */

document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quotationForm");
  const submitBtn = document.getElementById("quoteSubmitBtn");
  const whatsappSubmitBtn = document.getElementById("quoteWhatsAppBtn");
  const alertContainer = document.getElementById("formAlert");

  if (!quoteForm) return;

  // Real-time validation listeners
  const phoneInput = document.getElementById("quotePhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      // Clean non-digits
      this.value = this.value.replace(/[^\d+ ]/g, "");
      validatePhone(this);
    });
  }

  const quantityInput = document.getElementById("quoteQuantity");
  if (quantityInput) {
    quantityInput.addEventListener("input", function () {
      if (Number(this.value) <= 0) {
        showFieldError(this, "Quantity must be at least 1.");
      } else {
        clearFieldError(this);
      }
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
    setButtonLoading(submitBtn, true, "Processing Enquiry...");
    clearAlert(alertContainer);

    // Check if EmailJS is configured
    if (typeof emailjs !== "undefined" && CONFIG.emailjs.isConfigured()) {
      try {
        emailjs.init(CONFIG.emailjs.publicKey);

        const templateParams = {
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || "Not Provided",
          company_name: formData.company || "Not Provided",
          pipe_grade: formData.grade,
          pipe_diameter: `${formData.diameter} mm (Internal Diameter / ID)`,
          quantity: formData.quantity,
          delivery_location: formData.location,
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
            "<strong>Quotation Request Sent Successfully!</strong> Our team at Udhaya Spun Pipes will review your specifications and contact you promptly. You may also click below to forward your enquiry directly to our business WhatsApp."
          );
          
          // Also offer direct WhatsApp sync
          appendWhatsAppSyncButton(alertContainer, formData);
          quoteForm.reset();
          document.getElementById("quoteDiameter").disabled = true;
          document.getElementById("quoteDiameter").innerHTML = '<option value="">-- Select Available Diameter --</option>';
        } else {
          throw new Error("EmailJS returned status " + response.status);
        }
      } catch (error) {
        console.error("EmailJS submission error:", error);
        showAlert(
          alertContainer,
          "error",
          "<strong>Email transmission encountered an issue.</strong> Please forward your enquiry directly via WhatsApp for immediate response."
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
        `<strong>Form Validated Successfully!</strong><br>
        EmailJS integration requires your Service ID &amp; Template ID in <code>js/config.js</code>.<br>
        Opening your verified enquiry directly in <strong>WhatsApp (+91 9865944944)</strong> now...`
      );

      // Automatically launch prefilled WhatsApp message
      setTimeout(() => {
        sendViaWhatsApp(formData);
      }, 800);

      appendWhatsAppSyncButton(alertContainer, formData, false);
    }
  });
});

/**
 * Extracts and trims all form values
 */
function getFormData() {
  return {
    name: document.getElementById("quoteName")?.value.trim() || "",
    phone: document.getElementById("quotePhone")?.value.trim() || "",
    email: document.getElementById("quoteEmail")?.value.trim() || "",
    company: document.getElementById("quoteCompany")?.value.trim() || "",
    grade: document.getElementById("quoteGrade")?.value.trim() || "",
    diameter: document.getElementById("quoteDiameter")?.value.trim() || "",
    quantity: document.getElementById("quoteQuantity")?.value.trim() || "",
    location: document.getElementById("quoteLocation")?.value.trim() || "",
    message: document.getElementById("quoteMessage")?.value.trim() || ""
  };
}

/**
 * Form Validation
 */
function validateForm(data) {
  let isValid = true;
  const nameField = document.getElementById("quoteName");
  const phoneField = document.getElementById("quotePhone");
  const emailField = document.getElementById("quoteEmail");
  const gradeField = document.getElementById("quoteGrade");
  const diameterField = document.getElementById("quoteDiameter");
  const quantityField = document.getElementById("quoteQuantity");
  const locationField = document.getElementById("quoteLocation");

  // Name check
  if (!data.name || data.name.length < 2) {
    showFieldError(nameField, "Please enter your full name (minimum 2 characters).");
    isValid = false;
  } else {
    clearFieldError(nameField);
  }

  // Phone check (Indian 10-digit mobile number)
  const phoneClean = data.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(phoneClean)) {
    showFieldError(phoneField, "Please enter a valid 10-digit Indian mobile number (e.g., 9865944944).");
    isValid = false;
  } else {
    clearFieldError(phoneField);
  }

  // Email check (optional, but validate format if present)
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

  // Grade check
  if (!data.grade || !["NP2", "NP3", "NP4"].includes(data.grade)) {
    showFieldError(gradeField, "Please select a valid pipe grade (NP2, NP3, or NP4).");
    isValid = false;
  } else {
    clearFieldError(gradeField);
  }

  // Diameter check & grade compatibility
  if (!data.diameter) {
    showFieldError(diameterField, "Please select an available diameter for the chosen grade.");
    isValid = false;
  } else if (!isValidCombination(data.grade, data.diameter)) {
    showFieldError(diameterField, `Diameter ${data.diameter} mm is not confirmed for grade ${data.grade}.`);
    isValid = false;
  } else {
    clearFieldError(diameterField);
  }

  // Quantity check (positive integer)
  const qtyNum = Number(data.quantity);
  if (!data.quantity || isNaN(qtyNum) || qtyNum <= 0 || !Number.isInteger(qtyNum)) {
    showFieldError(quantityField, "Please enter a positive whole number for quantity (e.g. 50).");
    isValid = false;
  } else {
    clearFieldError(quantityField);
  }

  // Location check
  if (!data.location || data.location.length < 3) {
    showFieldError(locationField, "Please enter delivery location / project site in Tamil Nadu.");
    isValid = false;
  } else {
    clearFieldError(locationField);
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
 * Builds the exact required WhatsApp text and opens in a new tab
 */
function sendViaWhatsApp(data) {
  const messageLines = [
    "NEW QUOTATION ENQUIRY — UDHAYA SPUN PIPES",
    `Customer Name: ${data.name}`,
    `Phone Number: ${data.phone}`,
    `Email: ${data.email || "Not Provided"}`,
    `Company Name: ${data.company || "Not Provided"}`,
    `Pipe Grade: ${data.grade}`,
    `Pipe Diameter: ${data.diameter} mm (Internal Diameter)`,
    `Quantity Required: ${data.quantity}`,
    `Delivery Location: ${data.location}`,
    `Additional Message: ${data.message || "None"}`
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
      "<strong>WhatsApp Opened in New Window!</strong><br>Please click <strong>Send</strong> in WhatsApp to deliver your prefilled quotation enquiry to Udhaya Spun Pipes."
    );
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
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-whatsapp-sync";
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg> ${isError ? 'Send Enquiry via WhatsApp Instead' : 'Also Send via WhatsApp'}`;
  
  btn.addEventListener("click", () => sendViaWhatsApp(data));
  container.appendChild(btn);
}
