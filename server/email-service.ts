import nodemailer from 'nodemailer';

// Email configuration using university email credentials
const emailConfig = {
  host: 'smtp.univ-lille.fr',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: 'shayan.hashemi.etu@univ-lille.fr',
    pass: 'Shayan.84088408'
  },
  timeout: 30000, // 30 seconds connection timeout
  connectionTimeout: 30000, // 30 seconds for initial connection
  greetingTimeout: 15000, // 15 seconds for greeting
  socketTimeout: 20000, // 20 seconds for socket operations
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: process.env.NODE_ENV === 'development' // Enable logging in development
};

// Create email transporter with retry logic
const transporter = nodemailer.createTransport(emailConfig);

// Backup Gmail transporter (in case university SMTP fails)
const gmailConfig = {
  service: 'gmail',
  auth: {
    user: 'melring.coaching@gmail.com',
    pass: 'Shayan.84088408' // App password for Gmail
  }
};

const gmailTransporter = nodemailer.createTransport(gmailConfig);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Primary email service connection error:', error);
    console.log('Will use Gmail as backup email service');
  } else {
    console.log('Primary email service (University SMTP) is ready to send messages');
  }
});

gmailTransporter.verify((error, success) => {
  if (error) {
    console.error('Backup email service connection error:', error);
  } else {
    console.log('Backup email service (Gmail) is ready to send messages');
  }
});

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  slotDescription?: string;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
}

// Helper function to send email with retry logic
async function sendEmailWithRetry(transporter: any, mailOptions: any, serviceName: string, maxRetries = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully via ${serviceName} on attempt ${attempt}`);
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${serviceName}:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Send email to customer with fallback
export async function sendCustomerConfirmationEmail(bookingData: BookingEmailData) {
  const mailOptions = {
    from: '"Melring Coaching" <shayan.hashemi.etu@univ-lille.fr>',
    to: bookingData.customerEmail,
    subject: 'Confirmation de votre réservation - Melring Coaching',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1D1D1B; margin-bottom: 10px;">Melring Coaching</h1>
          <p style="color: #666; font-size: 16px;">Boxe - HIIT - Coaching Sportif</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1D1D1B; margin-bottom: 15px;">Confirmation de réservation</h2>
          <p style="font-size: 16px; margin-bottom: 10px;">Bonjour <strong>${bookingData.customerName}</strong>,</p>
          <p style="font-size: 16px; margin-bottom: 15px;">Votre réservation a été confirmée avec succès !</p>
        </div>

        <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1D1D1B; margin-bottom: 15px;">Détails de votre séance</h3>
          <div style="font-size: 16px; line-height: 1.6;">
            <p><strong>Date :</strong> ${new Date(bookingData.slotDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Heure :</strong> ${bookingData.slotStartTime} - ${bookingData.slotEndTime}</p>
            ${bookingData.slotDescription ? `<p><strong>Type de séance :</strong> ${bookingData.slotDescription}</p>` : ''}
            ${bookingData.customerPhone ? `<p><strong>Téléphone :</strong> ${bookingData.customerPhone}</p>` : ''}
          </div>
        </div>

        ${bookingData.notes ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #856404; margin-bottom: 10px;">Vos notes :</h4>
          <p style="font-size: 16px; color: #856404;">${bookingData.notes}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #666;">Nous vous attendons avec impatience !</p>
          <p style="font-size: 16px; color: #666;">Pour toute question, n'hésitez pas à nous contacter.</p>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #999;">
            Melring Coaching - Coaching sportif professionnel<br>
            Contact : shayan.hashemi.etu@univ-lille.fr
          </p>
        </div>
      </div>
    `
  };

  try {
    // Try primary university SMTP first
    await sendEmailWithRetry(transporter, mailOptions, 'University SMTP');
  } catch (primaryError) {
    console.error('Primary email service failed, trying backup Gmail:', primaryError);
    try {
      // Fallback to Gmail
      const gmailMailOptions = {
        ...mailOptions,
        from: '"Melring Coaching" <melring.coaching@gmail.com>'
      };
      await sendEmailWithRetry(gmailTransporter, gmailMailOptions, 'Gmail');
    } catch (backupError) {
      console.error('Both email services failed:', backupError);
      const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const backupMessage = backupError instanceof Error ? backupError.message : String(backupError);
      throw new Error(`Failed to send customer email via both services. Primary: ${primaryMessage}, Backup: ${backupMessage}`);
    }
  }
}

// Send email to business owner
export async function sendOwnerNotificationEmail(bookingData: BookingEmailData) {
  const mailOptions = {
      from: '"Melring Coaching System" <shayan.hashemi.etu@univ-lille.fr>',
      to: 'shayan.hashemi.etu@univ-lille.fr',
      subject: 'Nouvelle réservation - Melring Coaching',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1D1D1B; margin-bottom: 10px;">Nouvelle Réservation</h1>
            <p style="color: #666; font-size: 16px;">Melring Coaching</p>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-bottom: 15px;">Informations du client</h3>
            <div style="font-size: 16px; line-height: 1.6;">
              <p><strong>Nom :</strong> ${bookingData.customerName}</p>
              <p><strong>Email :</strong> ${bookingData.customerEmail}</p>
              ${bookingData.customerPhone ? `<p><strong>Téléphone :</strong> ${bookingData.customerPhone}</p>` : ''}
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1D1D1B; margin-bottom: 15px;">Détails de la réservation</h3>
            <div style="font-size: 16px; line-height: 1.6;">
              <p><strong>Date :</strong> ${new Date(bookingData.slotDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Heure :</strong> ${bookingData.slotStartTime} - ${bookingData.slotEndTime}</p>
              ${bookingData.slotDescription ? `<p><strong>Type de séance :</strong> ${bookingData.slotDescription}</p>` : ''}
            </div>
          </div>

          ${bookingData.notes ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-bottom: 10px;">Notes du client :</h4>
            <p style="font-size: 16px; color: #856404;">${bookingData.notes}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #666;">Réservation enregistrée le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      `
    };

  try {
    // Try primary university SMTP first
    await sendEmailWithRetry(transporter, mailOptions, 'University SMTP');
  } catch (primaryError) {
    console.error('Primary email service failed for owner notification, trying backup Gmail:', primaryError);
    try {
      // Fallback to Gmail
      const gmailMailOptions = {
        ...mailOptions,
        from: '"Melring Coaching System" <melring.coaching@gmail.com>'
      };
      await sendEmailWithRetry(gmailTransporter, gmailMailOptions, 'Gmail');
    } catch (backupError) {
      console.error('Both email services failed for owner notification:', backupError);
      const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const backupMessage = backupError instanceof Error ? backupError.message : String(backupError);
      throw new Error(`Failed to send owner email via both services. Primary: ${primaryMessage}, Backup: ${backupMessage}`);
    }
  }
}

// Send both emails for a booking
export async function sendBookingConfirmationEmails(bookingData: BookingEmailData) {
  try {
    await Promise.all([
      sendCustomerConfirmationEmail(bookingData),
      sendOwnerNotificationEmail(bookingData)
    ]);
    console.log('All booking confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending booking emails:', error);
    throw error;
  }
}