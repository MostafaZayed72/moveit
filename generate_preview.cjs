const fs = require('fs');
const path = require('path');

const logoBase64 = fs.readFileSync('public/images/logo-email.png').toString('base64');
const heroBase64 = fs.readFileSync('public/images/email-hero-boxes.png').toString('base64');

const BRAND = {
  red: '#dc2626',
  redLight: '#ef4444',
  dark: '#090d16',
  darkCard: '#0f172a',
  slateText: '#334155',
  slateMuted: '#64748b',
  border: '#e2e8f0',
  bgLight: '#f8fafc',
  green: '#10b981',
  whatsapp: '#25D366'
};

const fontHeadTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Montserrat+Alternates:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #f1f5f9;
      margin: 0;
      padding: 40px 10px;
      font-family: 'Montserrat Alternates', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    body, table, td, p, a, div, span {
      font-family: 'Montserrat Alternates', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    @media only screen and (max-width: 640px) {
      .responsive-col {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      .hero-img-col {
        display: none !important;
      }
      .hero-text-cell {
        width: 100% !important;
        padding: 24px 18px !important;
      }
      .timeline-col {
        display: block !important;
        width: 100% !important;
        padding: 0 0 16px 0 !important;
      }
      .badge-col {
        display: inline-block !important;
        width: 48% !important;
        margin-bottom: 12px !important;
        vertical-align: top !important;
      }
    }
  </style>
`;

const renderHeader = (subtitle = 'Moving made simple') => `
  <div style="background-color: #ffffff; padding: 34px 20px 24px 20px; text-align: center; border-bottom: 1px solid ${BRAND.border};">
    <div style="display: inline-block; text-align: center;">
      <a href="https://moveitmaastricht.nl" target="_blank" style="text-decoration: none; display: inline-block;">
        <img 
          src="data:image/png;base64,${logoBase64}" 
          alt="MoveIt Maastricht" 
          width="210"
          style="width: 210px; max-width: 250px; height: auto; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;" 
        />
      </a>
      <p style="font-family: 'Montserrat Alternates', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; margin: 10px 0 0 0; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;">
        ${subtitle}
      </p>
    </div>
  </div>
`;

const renderFooter = () => `
  <div style="background-color: #0b0f19; padding: 28px 24px 22px 24px; color: #94a3b8; border-top: 1px solid #1e293b; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
      <tr>
        <td class="responsive-col" style="vertical-align: middle; text-align: left;">
          <a href="https://moveitmaastricht.nl" target="_blank" style="text-decoration: none; display: inline-block;">
            <img src="data:image/png;base64,${logoBase64}" alt="MoveIt" width="105" style="width: 105px; height: auto; display: block;" />
          </a>
          <p style="font-size: 11px; color: #64748b; margin: 6px 0 0 0; line-height: 1.5;">
            Premium Relocation &amp; Logistics Services<br/>
            Maastricht &amp; Limburg, Netherlands
          </p>
        </td>
        <td class="responsive-col" style="vertical-align: middle; text-align: right; padding-top: 10px;">
          <div style="margin-bottom: 6px;">
            <a href="https://wa.me/31684094271" target="_blank" style="display: inline-block; margin-left: 8px; text-decoration: none; font-size: 16px;">💬</a>
            <a href="mailto:info@moveitmaastricht.nl" style="display: inline-block; margin-left: 8px; text-decoration: none; font-size: 16px;">✉️</a>
            <a href="https://moveitmaastricht.nl" target="_blank" style="display: inline-block; margin-left: 8px; text-decoration: none; font-size: 16px;">🌐</a>
          </div>
          <div style="font-family: 'Caveat', 'Brush Script MT', cursive; font-size: 18px; color: #cbd5e1; font-weight: 700; letter-spacing: 0.02em;">
            People. Places. New Beginnings.
          </div>
        </td>
      </tr>
    </table>
    <div style="border-top: 1px solid #1e293b; padding-top: 14px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-size: 11px; color: #475569; text-align: left;">
            &copy; 2026 Moveit Maastricht. All rights reserved.
          </td>
          <td style="font-size: 11px; color: #64748b; text-align: right;">
            <a href="https://moveitmaastricht.nl" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 600;">moveitmaastricht.nl</a>
          </td>
        </tr>
      </table>
    </div>
  </div>
`;

const glanceItems = [
  { icon: '📍', label: 'From', value: 'Trompstraat 75, 2518 BM, The Hague, Netherlands' },
  { icon: '📍', label: 'To', value: 'Brandenburgerweg 3C, 6214 AJ, Maastricht, Netherlands' },
  { icon: '📅', label: 'Preferred date', value: 'Sunday, 11 October 2026' },
  { icon: '🕒', label: 'Preferred time', value: 'Afternoon (12:00 – 17:00)' },
  { icon: '📦', label: 'Move size', value: 'Studio / Single Room' },
  { icon: '🚚', label: 'Service requested', value: 'Full Service' },
  { icon: '🏢', label: 'Pickup floor', value: '3rd floor' },
  { icon: '🏢', label: 'Delivery floor', value: '2nd floor' },
  { icon: '🛗', label: 'Elevator available', value: 'No elevator' },
  { icon: '🪜', label: 'Moving lift needed', value: 'Not sure' },
  { icon: '🔧', label: 'Furniture assembly', value: 'Yes, please' },
  { icon: '🍷', label: 'Special items', value: 'Table, bed, closet' },
  { icon: '📝', label: 'Additional notes', value: 'Washing machine (in new place will be placed in basement), table, closet, bed/mattress' }
];

const glanceRowsHtml = glanceItems.map(item => `
  <tr style="border-bottom: 1px solid #f1f5f9;">
    <td style="padding: 9px 4px 9px 0; width: 22px; vertical-align: top; font-size: 14px;">${item.icon}</td>
    <td style="padding: 9px 8px 9px 0; width: 38%; vertical-align: top; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 700; color: #475569;">${item.label}</td>
    <td style="padding: 9px 0; vertical-align: top; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.4;">${item.value}</td>
  </tr>
`).join('');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Confirmation Email Preview - MoveIt Maastricht</title>
  ${fontHeadTags}
</head>
<body>

  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #f8fafc; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
    ${renderHeader('Moving made simple')}

    <div style="padding: 24px 20px 30px 20px;">
      
      <!-- Hero Welcome Card -->
      <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td class="hero-text-cell" style="vertical-align: middle; padding: 26px 24px; text-align: left;">
              <!-- Status Badge -->
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-family: 'Montserrat Alternates', 'Montserrat', sans-serif; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px;">
                ✓ REQUEST SUCCESSFULLY RECEIVED
              </div>

              <!-- Main Heading -->
              <h1 style="font-family: 'Montserrat Alternates', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0 0 10px 0; font-size: 26px; font-weight: 900; color: #0f172a; line-height: 1.25; letter-spacing: -0.02em;">
                Thanks, Angela!<br/>
                <span style="font-size: 20px; font-weight: 800; color: #1e293b;">We've received your move request.</span>
              </h1>

              <!-- Body Paragraph -->
              <p style="font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 18px 0;">
                Your request is now with our Maastricht planning team. We'll review your move details and contact you with the next steps and quotation.
              </p>

              <!-- Request Reference Box -->
              <div style="background-color: #f8fafc; border: 1px solid ${BRAND.border}; border-radius: 12px; padding: 12px 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 32px; vertical-align: middle; font-size: 24px;">📄</td>
                    <td style="vertical-align: middle; padding-left: 10px;">
                      <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em;">YOUR REQUEST REFERENCE</div>
                      <div style="font-family: 'Montserrat Alternates', 'Montserrat', monospace; font-size: 19px; font-weight: 900; color: ${BRAND.red}; letter-spacing: 0.03em; margin-top: 2px;">ORD-230060C6</div>
                      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Please mention this reference if you contact us about your move.</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
            <td class="hero-img-col" style="width: 42%; vertical-align: middle; padding: 0; text-align: right; background-color: #f8fafc;">
              <img 
                src="data:image/png;base64,${heroBase64}" 
                alt="MoveIt - More than a move, A new chapter" 
                width="280" 
                style="width: 100%; max-width: 285px; height: auto; display: block; object-fit: cover;" 
              />
            </td>
          </tr>
        </table>
      </div>

      <!-- 4-Step Horizontal Timeline -->
      <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 18px 16px; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td class="timeline-col" style="width: 25%; vertical-align: top; padding-right: 8px;">
              <div style="display: inline-block; background-color: ${BRAND.red}; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-weight: 900; font-size: 12px; font-family: 'Montserrat', sans-serif; margin-bottom: 8px;">1</div>
              <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 3px;">Request received</div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.4;">Your details are safely with us.</div>
            </td>
            <td class="timeline-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-weight: 800; font-size: 12px; font-family: 'Montserrat', sans-serif; margin-bottom: 8px;">2</div>
              <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 3px;">Move assessment</div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.4;">We review your move details and may contact you for more information.</div>
            </td>
            <td class="timeline-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-weight: 800; font-size: 12px; font-family: 'Montserrat', sans-serif; margin-bottom: 8px;">3</div>
              <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 3px;">Quotation</div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.4;">You'll receive your personalised moving plan and price.</div>
            </td>
            <td class="timeline-col" style="width: 25%; vertical-align: top; padding-left: 8px;">
              <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 26px; height: 26px; border-radius: 50%; text-align: center; line-height: 26px; font-weight: 800; font-size: 12px; font-family: 'Montserrat', sans-serif; margin-bottom: 8px;">4</div>
              <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 3px;">Booking confirmation</div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.4;">Once accepted, we'll confirm your moving date and team.</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Two-Column Details & Next Steps Grid -->
      <table class="responsive-table" style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
        <tr>
          <!-- Left Column: Move at a Glance -->
          <td class="responsive-col" style="width: 53%; vertical-align: top; padding-right: 10px;">
            <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 20px 18px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);">
              <div style="font-family: 'Montserrat Alternates', 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; margin-bottom: 6px;">
                📋 YOUR MOVE AT A GLANCE
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; font-family: 'Inter', sans-serif;">
                <tbody>
                  ${glanceRowsHtml}
                </tbody>
              </table>
            </div>
          </td>

          <!-- Right Column: What Happens Next & Contact -->
          <td class="responsive-col" style="width: 47%; vertical-align: top; padding-left: 10px;">
            <!-- What happens next -->
            <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 18px 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);">
              <div style="font-family: 'Montserrat Alternates', 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px;">
                ℹ️ WHAT HAPPENS NEXT?
              </div>

              <!-- 1 -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr>
                  <td style="width: 24px; vertical-align: top;">
                    <div style="background-color: ${BRAND.red}; color: #ffffff; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: 900; font-size: 10px; font-family: 'Montserrat', sans-serif;">1</div>
                  </td>
                  <td style="padding-left: 8px; vertical-align: top;">
                    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a;">We review your request</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">Our planning team checks your move details, access requirements and requested services.</div>
                  </td>
                </tr>
              </table>

              <!-- 2 -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr>
                  <td style="width: 24px; vertical-align: top;">
                    <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: 800; font-size: 10px; font-family: 'Montserrat', sans-serif;">2</div>
                  </td>
                  <td style="padding-left: 8px; vertical-align: top;">
                    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a;">We may contact you</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">For larger or more complex moves, we may request photos, a short video or arrange a viewing.</div>
                  </td>
                </tr>
              </table>

              <!-- 3 -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <tr>
                  <td style="width: 24px; vertical-align: top;">
                    <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: 800; font-size: 10px; font-family: 'Montserrat', sans-serif;">3</div>
                  </td>
                  <td style="padding-left: 8px; vertical-align: top;">
                    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a;">You receive your quotation</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">We'll send you the recommended moving plan and price.</div>
                  </td>
                </tr>
              </table>

              <!-- 4 -->
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 24px; vertical-align: top;">
                    <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: 800; font-size: 10px; font-family: 'Montserrat', sans-serif;">4</div>
                  </td>
                  <td style="padding-left: 8px; vertical-align: top;">
                    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; color: #0f172a;">You confirm your move</div>
                    <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-top: 2px;">Your moving date is reserved once the booking has been confirmed.</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Need to update something? -->
            <div style="background-color: #fff5f5; border: 1px solid #fee2e2; border-radius: 14px; padding: 18px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
              <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 800; color: ${BRAND.red}; margin-bottom: 6px;">
                ❤️ Need to update something?
              </div>
              <p style="font-size: 11.5px; color: #64748b; line-height: 1.4; margin: 0 0 10px 0;">
                If anything in your request changes, simply contact our team and mention your reference:
              </p>

              <div style="display: inline-block; background-color: #ffffff; border: 1px solid #fecaca; border-radius: 9999px; padding: 4px 14px; font-family: 'Montserrat', monospace; font-size: 13px; font-weight: 800; color: ${BRAND.red}; margin-bottom: 12px;">
                ORD-230060C6
              </div>

              <a href="https://wa.me/31684094271" target="_blank" style="display: block; background-color: #16a34a; color: #ffffff; font-family: 'Montserrat', 'Inter', sans-serif; font-size: 12.5px; font-weight: 700; text-decoration: none; padding: 11px 14px; border-radius: 10px; margin-bottom: 8px; text-align: center; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.2);">
                💬 Chat with us on WhatsApp &nbsp;&rsaquo;
              </a>

              <a href="mailto:info@moveitmaastricht.nl" style="display: block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-family: 'Montserrat', 'Inter', sans-serif; font-size: 12.5px; font-weight: 700; text-decoration: none; padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; text-align: center;">
                ✉️ Reply to this email &nbsp;&rsaquo;
              </a>

              <div style="font-size: 11px; color: #94a3b8;">
                No action is required from you right now.
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- 4 Trust Badges Row -->
      <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 16px 12px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);">
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr>
            <td class="badge-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="font-size: 20px; margin-bottom: 4px;">🛡️</div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; color: #0f172a;">Trusted &amp; Insured</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px; line-height: 1.3;">Your belongings are in safe hands</div>
            </td>
            <td class="badge-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="font-size: 20px; margin-bottom: 4px;">👥</div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; color: #0f172a;">Professional Team</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px; line-height: 1.3;">Experienced &amp; reliable</div>
            </td>
            <td class="badge-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="font-size: 20px; margin-bottom: 4px;">⭐</div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; color: #0f172a;">5-Star Service</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px; line-height: 1.3;">Customers move with confidence</div>
            </td>
            <td class="badge-col" style="width: 25%; vertical-align: top; padding: 0 6px;">
              <div style="font-size: 20px; margin-bottom: 4px;">🍃</div>
              <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; color: #0f172a;">Sustainable Moving</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px; line-height: 1.3;">A cleaner tomorrow</div>
            </td>
          </tr>
        </table>
      </div>

    </div>

    ${renderFooter()}
  </div>

</body>
</html>`;

fs.writeFileSync('public/email-preview.html', fullHtml);
console.log('Successfully written public/email-preview.html');
