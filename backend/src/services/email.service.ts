import nodemailer from "nodemailer";
import { logger } from "../config/logger";

export class EmailService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      logger.warn(
        "SMTP settings missing in .env. EmailService running in sandbox (log-only) mode."
      );
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Sends an email using Nodemailer. Falls back to console logger if credentials are missing.
   * @param options recipient details, subject, body, and HTML template
   */
  static async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<{ success: boolean; messageId?: string }> {
    try {
      const transporter = this.getTransporter();
      const from = process.env.SMTP_FROM || `"CRM Sales" <no-reply@crm.com>`;

      if (!transporter) {
        logger.info(
          `📬 [SIMULATED EMAIL]\nFrom: ${from}\nTo: ${options.to}\nSubject: ${options.subject}\nBody: ${options.text}\n`
        );
        return { success: true, messageId: "simulated-message-id" };
      }

      const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text.replace(/\n/g, "<br>"),
      });

      logger.info(`✅ Email dispatched successfully to ${options.to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      logger.error(`❌ Email dispatch error to ${options.to}: ${error.message}`);
      throw new Error(`Email dispatch failed: ${error.message}`);
    }
  }
}
