/**
 * UDHAYA SPUN PIPES - Configuration File
 * 
 * Centralized settings for EmailJS, WhatsApp, and Business Information.
 * IMPORTANT: Only public configuration belongs in this client-side file.
 * Replace the EmailJS placeholders with your actual keys from https://www.emailjs.com/
 */

const CONFIG = {
  company: {
    name: "Udhaya Spun Pipes",
    tagline: "RCC Pipe Manufacturing and Wholesale Supply",
    address: "Moongiloorani, Kannar Street, Manamadurai, Sivaganga, Tamil Nadu, India",
    phone: "+91 9865944944",
    phoneSecondary: "+91 9865844944",
    phoneRaw: "919865944944",
    phoneSecondaryRaw: "919865844944",
    whatsappNumber: "919865944944",
    email: "udhayaspunpipes@gmail.com",
    coverage: "All over Tamil Nadu",
    locationCoordinates: {
      lat: 9.7042,
      lng: 78.4489
    }
  },

  /**
   * EmailJS Configuration Settings
   * 
   * How to set up EmailJS:
   * 1. Sign up at https://www.emailjs.com/
   * 2. Add an Email Service (e.g. Gmail: udhayaspunpipes@gmail.com) -> copy Service ID
   * 3. Create an Email Template with fields:
   *    {{customer_name}}, {{customer_phone}}, {{customer_email}}, {{company_name}},
   *    {{pipe_grade}}, {{pipe_diameter}}, {{quantity}}, {{delivery_location}}, {{message}}
   *    -> copy Template ID
   * 4. Go to Account > Security > copy Public Key
   * 5. Paste the 3 values below.
   */
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",       // Replace with your EmailJS Public Key
    serviceId: "YOUR_EMAILJS_SERVICE_ID",       // Replace with your EmailJS Service ID
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",     // Replace with your EmailJS Template ID
    
    // Helper to check if credentials have been filled in
    isConfigured: function() {
      return (
        this.publicKey && 
        this.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY" &&
        this.serviceId && 
        this.serviceId !== "YOUR_EMAILJS_SERVICE_ID" &&
        this.templateId && 
        this.templateId !== "YOUR_EMAILJS_TEMPLATE_ID"
      );
    }
  }
};

// Freeze configuration object in production to prevent unintended runtime modification
if (typeof Object.freeze === "function") {
  Object.freeze(CONFIG.company);
}
