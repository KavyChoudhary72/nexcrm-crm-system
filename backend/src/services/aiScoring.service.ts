import { GoogleGenAI } from "@google/genai";
import { logger } from "../config/logger";

export class AIScoringService {
  private static getAIInstance() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn("GEMINI_API_KEY is missing in .env. Using local rule-based fallback scoring.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Computes a score from 1 to 100 for a lead using Gemini API or a local fallback.
   * @param leadData containing budget, source, requirement description, and activity engagement count
   */
  static async calculateScore(leadData: {
    budget: number;
    source: string;
    requirement?: string;
    activitiesCount: number;
  }): Promise<number> {
    try {
      const ai = this.getAIInstance();
      if (!ai) {
        return this.calculateLocalScore(leadData);
      }

      const prompt = `
You are a sales intelligence expert. Assess the following lead and assign a probability conversion score between 1 and 100 (where 1 is cold/unlikely to buy, and 100 is hot/extremely ready to buy).

Lead Profile:
- Budget: ₹${leadData.budget} INR
- Lead Source: ${leadData.source}
- Lead Requirements/Notes: ${leadData.requirement || "None specified"}
- Lead Engagement Activities: ${leadData.activitiesCount}

Assess the lead using these parameters:
- Budget size (standard digital marketing/software service ranges: ₹10,000 to ₹5,00,000+ INR). Higher is better.
- Lead Source quality (Referral > Website Form > WhatsApp > Facebook Ads / Instagram Ads > Other).
- Requirement detail (clear and specific requirements indicate high intent).
- Activities level (higher activity count means more interaction and interest).

Respond ONLY with a single integer between 1 and 100. Do not include any explanations, letters, markdown, or other characters.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : "";
      const cleanedText = text.replace(/[^\d]/g, "");
      const score = parseInt(cleanedText, 10);
      
      if (!isNaN(score) && score >= 1 && score <= 100) {
        logger.info(`🔮 Gemini AI assigned Lead Score: ${score}`);
        return score;
      }
      
      logger.warn(`⚠️ Unexpected Gemini API response: "${text}". Using fallback scoring.`);
      return this.calculateLocalScore(leadData);
    } catch (error: any) {
      logger.error(`❌ Gemini AI scoring error: ${error.message}. Using fallback scoring.`);
      return this.calculateLocalScore(leadData);
    }
  }

  /**
   * Deterministic rule-based score calculation used as a local fallback.
   */
  public static calculateLocalScore(leadData: {
    budget: number;
    source: string;
    requirement?: string;
    activitiesCount: number;
  }): number {
    let score = 20; // base score

    // 1. Budget Contribution (max 30 pts) in INR
    if (leadData.budget >= 500000) score += 30;
    else if (leadData.budget >= 100000) score += 25;
    else if (leadData.budget >= 50000) score += 20;
    else if (leadData.budget >= 25000) score += 15;
    else if (leadData.budget >= 10000) score += 10;
    else if (leadData.budget > 0) score += 5;

    // 2. Lead Source Contribution (max 25 pts)
    const source = (leadData.source || "").toLowerCase();
    if (source.includes("referral")) score += 25;
    else if (source.includes("website")) score += 20;
    else if (source.includes("whatsapp")) score += 15;
    else if (source.includes("facebook") || source.includes("instagram") || source.includes("ad")) score += 10;
    else score += 5;

    // 3. Activity Engagement Contribution (max 20 pts)
    score += Math.min(leadData.activitiesCount * 4, 20);

    // 4. Requirement Detail Contribution (max 25 pts)
    const reqLen = (leadData.requirement || "").trim().length;
    if (reqLen > 50) score += 25;
    else if (reqLen > 20) score += 15;
    else if (reqLen > 5) score += 5;

    return Math.max(1, Math.min(100, score));
  }
}
