export class WhatsAppService {
  /**
   * Generates a WhatsApp click-to-chat link.
   * @param mobile Lead's mobile number
   * @param message Optional message to pre-fill
   */
  static generateLink(mobile: string, message?: string): string {
    // Strip non-numeric characters for the WhatsApp API
    let formattedNumber = mobile.replace(/[^\d]/g, "");

    // Quick sanitization: if it doesn't start with a country code, we output the cleaned digits.
    // Standard WhatsApp links format: https://api.whatsapp.com/send?phone=NUMBER&text=TEXT
    const baseUrl = "https://api.whatsapp.com/send";
    const query = new URLSearchParams();
    query.append("phone", formattedNumber);
    
    if (message) {
      query.append("text", message);
    }
    
    return `${baseUrl}?${query.toString()}`;
  }
}
