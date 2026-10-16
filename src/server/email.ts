import nodemailer, { type Transporter } from 'nodemailer';
import { Enquiry } from '../types';

export interface EmailServiceStatus {
  configured: boolean;
  host: string;
  port: number;
  userConfigured: boolean;
  destination: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private recipientEmail: string;

  constructor() {
    this.recipientEmail = process.env.NOTIFICATION_EMAIL || 'info@topsparkdigital.com';
    this.init();
  }

  private init() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        });
        this.isConfigured = true;
        console.log(`[SMTP] Configured for host ${host} and delivery to ${this.recipientEmail}`);
      } catch (err) {
        console.error('[SMTP] Failed to initialize transporter:', err);
        this.isConfigured = false;
      }
    } else {
      console.log('[SMTP] Not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable live email delivery.');
      this.isConfigured = false;
    }
  }

  public getStatus(): EmailServiceStatus {
    return {
      configured: this.isConfigured,
      host: process.env.SMTP_HOST || 'Not set',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      userConfigured: Boolean(process.env.SMTP_USER),
      destination: this.recipientEmail,
    };
  }

  public async sendEnquiryNotification(enquiry: Enquiry): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured || !this.transporter) {
      return {
        success: false,
        error: 'SMTP service is not configured. Enquiry was safely saved to the database.',
      };
    }

    const mailOptions = {
      from: `"Top Spark Digital Inquiries" <${process.env.SMTP_USER}>`,
      to: this.recipientEmail,
      replyTo: enquiry.email,
      subject: `[New Inquiry] ${enquiry.name} - ${enquiry.service}`,
      text: `
New Client Inquiry Received on Top Spark Digital:

Name: ${enquiry.name}
Company: ${enquiry.company || 'Not specified'}
Phone / WhatsApp: ${enquiry.phone}
Email: ${enquiry.email}
Requested Service: ${enquiry.service}
Budget Range: ${enquiry.budget || 'Not specified'}
Submitted At: ${enquiry.submittedAt}

Message:
${enquiry.message}
      `.trim(),
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
  <div style="background-color: #6A22F2; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
    <h2 style="margin: 0; font-size: 20px;">New Project Inquiry — Top Spark Digital</h2>
  </div>
  <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
    <p><strong>Client Name:</strong> ${enquiry.name}</p>
    <p><strong>Company:</strong> ${enquiry.company || 'Not specified'}</p>
    <p><strong>Phone / WhatsApp:</strong> <a href="tel:${enquiry.phone}">${enquiry.phone}</a></p>
    <p><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
    <p><strong>Requested Service:</strong> ${enquiry.service}</p>
    <p><strong>Budget Range:</strong> ${enquiry.budget || 'Not specified'}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
    <p><strong>Client Message:</strong></p>
    <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap;">${enquiry.message}</div>
    <div style="margin-top: 24px; font-size: 12px; color: #64748b;">
      Received at: ${new Date(enquiry.submittedAt).toLocaleString()}
    </div>
  </div>
</div>
      `.trim(),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('[SMTP] Delivery error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
}

export const emailService = new EmailService();
