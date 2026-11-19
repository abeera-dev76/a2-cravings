/**
 * Formats a phone number for WhatsApp and generates the direct click-to-chat URL.
 * @param {string} phone - Target phone number with or without international prefix.
 * @param {string} message - Optional prefilled message string.
 * @returns {string} Fully formed WhatsApp URL.
 */
export const getWhatsAppUrl = (phone = "923145027631", message = "") => {
  // Clean phone number: remove spaces, dashes, parentheses and leading '+'
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  if (!message) {
    return `https://wa.me/${cleanPhone}`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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
