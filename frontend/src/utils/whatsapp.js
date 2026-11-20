/**
 * WhatsApp Utility for A2 CRAVINGS
 * Official Business Number: 0314-5027631 (Local) / 923145027631 (International)
 * Required URL format: https://wa.me/923145027631
 */

export const BUSINESS_WHATSAPP_NUMBER = "923145027631";

/**
 * Formats a phone number for WhatsApp and generates the direct click-to-chat URL.
 * Strictly adheres to:
 * - URL format: https://wa.me/923145027631
 * - Never includes '@'
 * - Never starts with local '0'
 * - Uses encodeURIComponent for query text
 *
 * @param {string} phone - Target phone number (defaults to 923145027631)
 * @param {string} message - Optional prefilled message string
 * @returns {string} Fully formed WhatsApp URL
 */
export const getWhatsAppUrl = (phone = BUSINESS_WHATSAPP_NUMBER, message = "") => {
  // Strip any non-numeric characters (including @, +, -, spaces)
  let cleanPhone = String(phone || BUSINESS_WHATSAPP_NUMBER).replace(/[^0-9]/g, "");

  // If local Pakistani format with leading 0 (e.g. 03145027631), convert to international format (923145027631)
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "92" + cleanPhone.slice(1);
  }

  // Safety fallback to official international number if empty or malformed
  if (!cleanPhone || cleanPhone.length < 10) {
    cleanPhone = BUSINESS_WHATSAPP_NUMBER;
  }

  if (!message || !message.trim()) {
    return `https://wa.me/${cleanPhone}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
};

/**
 * Standard pre-filled WhatsApp messages for A2 CRAVINGS
 */
export const WHATSAPP_MESSAGES = {
  generalOrder: "Assalam o Alaikum A2 Cravings! I would like to place an order.",
  menuInquiry: "Assalam o Alaikum A2 Cravings! Can you please share today's available menu deals?",
  itemOrder: (itemName, price) => 
    price 
      ? `Assalam o Alaikum A2 Cravings! I would like to order "${itemName}" (Rs ${price}). Please confirm my order.`
      : `Assalam o Alaikum A2 Cravings! I want to order "${itemName}". Please confirm availability and delivery time.`,
  comboOrder: (comboName, price) =>
    `Assalam o Alaikum A2 Cravings! I would like to order the "${comboName}" (Rs ${price}). Please confirm my order.`
};
