import { readMultipartFormData, readBody, getHeader } from 'h3'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY
  const adminEmail = config.adminEmail || process.env.ADMIN_EMAIL || 'info@moveitmaastricht.nl'
  const gmailUser = config.gmailUser || process.env.GMAIL_USER || 'moveitmaastricht@gmail.com'
  const gmailPass = config.gmailPass || process.env.GMAIL_PASS || 'xfphkyhxkoxpjbhw'

  const resend = resendApiKey ? new Resend(resendApiKey) : null
  const fromEmail = 'onboarding@moveitmaastricht.nl'

  // Transporter with Gmail SMTP as rock-solid provider/fallback
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  })

  // Read logo if exists for optional inline CID
  let logoBuffer: Buffer | null = null
  try {
    const logoPath = path.resolve(process.cwd(), 'public/images/logo-email.png')
    if (fs.existsSync(logoPath)) {
      logoBuffer = fs.readFileSync(logoPath)
    }
  } catch (e) {
    // Ignore if not accessible
  }

  // Unified sender function with fallback
  const sendEmailWithFallback = async ({
    fromName = 'MoveIt Maastricht',
    to,
    replyTo,
    subject,
    html,
    text,
    attachments = []
  }: {
    fromName?: string
    to: string | string[]
    replyTo?: string
    subject: string
    html: string
    text?: string
    attachments?: Array<{ filename: string; content: any; contentType?: string; cid?: string }>
  }) => {
    let sentSuccess = false
    let lastError: any = null

    // 1. Try Resend
    if (resend) {
      try {
        const toRecipients = Array.isArray(to) ? to : [to]
        for (const recipient of toRecipients) {
          const res = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: recipient,
            replyTo: replyTo || undefined,
            subject,
            html,
            text,
            attachments: attachments.map(att => ({
              filename: att.filename,
              content: att.content
            }))
          })
          if (res.error) {
            console.warn(`Resend failed for ${recipient}:`, res.error)
            throw new Error(res.error.message || 'Resend error')
          }
        }
        sentSuccess = true
      } catch (err: any) {
        console.warn('Resend error, falling back to Gmail SMTP:', err.message || err)
        lastError = err
      }
    }

    // 2. Fallback to Gmail SMTP via Nodemailer
    if (!sentSuccess) {
      try {
        const toAddress = Array.isArray(to) ? to.join(', ') : to
        await transporter.sendMail({
          from: `"${fromName}" <${gmailUser}>`,
          to: toAddress,
          replyTo: replyTo || gmailUser,
          subject,
          html,
          text,
          attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content,
            contentType: att.contentType,
            cid: att.cid
          }))
        })
        sentSuccess = true
      } catch (smtpErr: any) {
        console.error('Nodemailer SMTP sending error:', smtpErr)
        lastError = smtpErr
      }
    }

    if (!sentSuccess && lastError) {
      throw lastError
    }
    return { success: true }
  }

  // BRAND DESIGN TOKENS
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
  }

  // Common Header Styles with Google Fonts (Montserrat Alternates, Montserrat, Caveat & Inter)
  const fontHeadTags = `
    <!--[if !mso]><!-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Montserrat+Alternates:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Montserrat+Alternates:wght@600;700;800;900&display=swap');
      body, table, td, p, a, div, span {
        font-family: 'Montserrat Alternates', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
      h1, h2, h3, h4, .brand-title, .font-heading {
        font-family: 'Montserrat Alternates', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
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
    <!--<![endif]-->
  `

  // Common Header Component for All Emails
  const renderHeader = (subtitle: string = 'Moving made simple') => `
    ${fontHeadTags}
    <div style="background-color: #ffffff; padding: 34px 20px 24px 20px; text-align: center; border-bottom: 1px solid ${BRAND.border};">
      <div style="display: inline-block; text-align: center;">
        <a href="https://moveitmaastricht.nl" target="_blank" style="text-decoration: none; display: inline-block;">
          <img 
            src="https://www.moveitmaastricht.nl/images/logo-email.png" 
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
  `

  // Common Footer Component for All Emails (matching the brand signature)
  const renderFooter = () => `
    <div style="background-color: #0b0f19; padding: 28px 24px 22px 24px; color: #94a3b8; border-top: 1px solid #1e293b; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
        <tr>
          <td class="responsive-col" style="vertical-align: middle; text-align: left;">
            <a href="https://moveitmaastricht.nl" target="_blank" style="text-decoration: none; display: inline-block;">
              <img src="https://www.moveitmaastricht.nl/images/logo-email.png" alt="MoveIt" width="105" style="width: 105px; height: auto; display: block;" />
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
              &copy; ${new Date().getFullYear()} Moveit Maastricht. All rights reserved.
            </td>
            <td style="font-size: 11px; color: #64748b; text-align: right;">
              <a href="https://moveitmaastricht.nl" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 600;">moveitmaastricht.nl</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `

  let subject = 'New Quote/Contact Request'
  let replyTo = ''
  let directTo = ''
  let html = ''
  let rawText = ''
  const attachments: Array<{ filename: string; content: any; contentType?: string }> = []
  const fieldsMap: Record<string, string> = {}

  const contentType = getHeader(event, 'content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    if (parts) {
      for (const part of parts) {
        if (part.filename) {
          attachments.push({
            filename: part.filename,
            content: part.data,
            contentType: part.type
          })
        } else if (part.name) {
          fieldsMap[part.name] = part.data.toString('utf-8')
        }
      }
    }

    subject = fieldsMap['_subject'] || subject
    replyTo = fieldsMap['_replyto'] || fieldsMap['Email'] || fieldsMap['Email Address'] || fieldsMap['email'] || ''
    directTo = fieldsMap['to'] || fieldsMap['toEmail'] || ''
  } else {
    // JSON body
    const body = await readBody(event) || {}
    subject = body.subject || body._subject || subject
    replyTo = body.replyTo || body._replyto || body['Referrer Email'] || body['Email'] || body.email || ''
    directTo = body.to || body.toEmail || ''
    rawText = body.text || body.message || ''

    for (const [k, v] of Object.entries(body)) {
      if (typeof v === 'string') fieldsMap[k] = v
      else if (v !== null && typeof v !== 'undefined') fieldsMap[k] = JSON.stringify(v)
    }
  }

  try {
    // -------------------------------------------------------------
    // SCENARIO 1: Direct Admin Compose Email (sent from Dashboard)
    // -------------------------------------------------------------
    if (directTo) {
      const composeHtml = `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);">
          ${renderHeader('Moving made simple')}
          
          <div style="padding: 35px 30px; color: ${BRAND.slateText}; line-height: 1.7; font-size: 15px; font-family: 'Inter', sans-serif;">
            ${rawText ? rawText.replace(/\n/g, '<br>') : html}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND.border};">
              <p style="margin: 0; font-size: 14px; color: ${BRAND.slateMuted};">Best regards,</p>
              <p style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 4px 0 0 0; font-size: 16px; font-weight: 800; color: ${BRAND.red};">The MoveIt Maastricht Team</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: ${BRAND.slateMuted};">
                📞 <a href="tel:+31684094271" style="color: inherit; text-decoration: none;">+31 6 84094271</a> &nbsp;|&nbsp; 
                ✉️ <a href="mailto:info@moveitmaastricht.nl" style="color: inherit; text-decoration: none;">info@moveitmaastricht.nl</a>
              </p>
            </div>
          </div>

          ${renderFooter()}
        </div>
      `

      await sendEmailWithFallback({
        to: directTo,
        replyTo: adminEmail,
        subject,
        html: composeHtml,
        text: rawText || undefined
      })
      return { success: true, message: `Email sent to ${directTo}` }
    }

    // -------------------------------------------------------------
    // SCENARIO 2: Order / Quote Request Submission
    // -------------------------------------------------------------

    // 1. ADMIN NOTIFICATION EMAIL TEMPLATE
    const adminRecipients = Array.from(new Set([adminEmail, gmailUser, 'info@moveitmaastricht.nl'])).filter(Boolean)
    const custName = fieldsMap['Name'] || fieldsMap['name'] || fieldsMap['Full Name'] || 'Customer'
    const custEmail = replyTo || fieldsMap['Email'] || fieldsMap['email'] || 'Not provided'
    const custPhone = fieldsMap['Phone'] || fieldsMap['phone'] || 'Not provided'
    const fromLocation = fieldsMap['Moving From'] || fieldsMap['from'] || ''
    const toLocation = fieldsMap['Moving To'] || fieldsMap['to'] || ''
    const moveDateStr = fieldsMap['Preferred Date'] || fieldsMap['date'] || ''

    const orderNumber = fieldsMap['Order Number (Order ID)'] || fieldsMap['Order Number'] || fieldsMap['order_number'] || ''
    const quoteCode = fieldsMap['Quote Code (Code ID)'] || fieldsMap['Quote Code'] || fieldsMap['quote_code'] || fieldsMap['Code ID'] || ''
    const confirmationId = fieldsMap['Confirmation ID'] || fieldsMap['confirmation_code'] || fieldsMap['Confirmation Code'] || ''
    const invoiceNumber = fieldsMap['Invoice Number'] || fieldsMap['invoice_number'] || ''
    const dbOrderId = fieldsMap['Database Order ID'] || fieldsMap['Database UUID'] || fieldsMap['Order ID'] || fieldsMap['order_id'] || ''

    const displayOrderId = orderNumber || (dbOrderId ? `ORD-${dbOrderId.split('-')[0].toUpperCase()}` : '')

    let adminHtml = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
        ${renderHeader('Moving made simple')}

        <div style="padding: 30px 25px; font-family: 'Inter', sans-serif;">
          <!-- Alert Banner -->
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid ${BRAND.red}; border-radius: 10px; padding: 14px 18px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: middle;">
                  <div style="font-family: 'Montserrat', 'Inter', sans-serif; font-size: 13px; font-weight: 800; color: ${BRAND.red}; text-transform: uppercase; letter-spacing: 0.05em;">
                    🚨 New Order / Quote Request
                  </div>
                  <div style="font-family: 'Montserrat', 'Inter', sans-serif; font-size: 17px; font-weight: 800; color: #1e293b; margin-top: 4px;">
                    ${custName} — ${moveDateStr || 'Upcoming Date'}
                  </div>
                </td>
                ${displayOrderId ? `
                  <td style="text-align: right; vertical-align: middle; white-space: nowrap;">
                    <span style="display: inline-block; background-color: ${BRAND.red}; color: #ffffff; font-family: 'Montserrat', 'Inter', sans-serif; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 8px; letter-spacing: 0.05em;">
                      ${displayOrderId}
                    </span>
                  </td>
                ` : ''}
              </tr>
            </table>
          </div>

          <!-- Reference & Tracking IDs Grid -->
          <div style="background-color: #f8fafc; border: 1px solid ${BRAND.border}; border-radius: 12px; padding: 16px 20px; margin-bottom: 25px;">
            <div style="font-family: 'Montserrat', 'Inter', sans-serif; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.slateMuted}; margin-bottom: 12px;">
              🏷️ Order &amp; Lifecycle Identifiers
            </div>
            <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 13px;">
              ${displayOrderId ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 7px 0; color: #64748b; font-weight: 600; width: 40%;">📦 Order ID:</td>
                  <td style="padding: 7px 0; font-family: 'Montserrat', monospace; font-weight: 800; color: ${BRAND.red};">${displayOrderId}</td>
                </tr>
              ` : ''}
              ${quoteCode ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 7px 0; color: #64748b; font-weight: 600;">🔖 Quote Code (Code ID):</td>
                  <td style="padding: 7px 0; font-family: 'Montserrat', monospace; font-weight: 700; color: #0f172a;">${quoteCode}</td>
                </tr>
              ` : ''}
              ${confirmationId ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 7px 0; color: #64748b; font-weight: 600;">✅ Confirmation ID:</td>
                  <td style="padding: 7px 0; font-family: 'Montserrat', monospace; font-weight: 700; color: #0284c7;">${confirmationId}</td>
                </tr>
              ` : ''}
              ${invoiceNumber ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 7px 0; color: #64748b; font-weight: 600;">🧾 Invoice Number:</td>
                  <td style="padding: 7px 0; font-family: 'Montserrat', monospace; font-weight: 700; color: #059669;">${invoiceNumber}</td>
                </tr>
              ` : ''}
              ${dbOrderId ? `
                <tr>
                  <td style="padding: 7px 0; color: #94a3b8; font-size: 11px;">Database UUID:</td>
                  <td style="padding: 7px 0; font-size: 11px; color: #94a3b8; font-family: monospace;">${dbOrderId}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <!-- Quick Customer Contact Box -->
          <div style="background-color: ${BRAND.bgLight}; border: 1px solid ${BRAND.border}; border-radius: 12px; padding: 18px 20px; margin-bottom: 25px;">
            <h4 style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 0 0 10px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.slateMuted};">
              👤 Customer Contact
            </h4>
            <div style="font-family: 'Montserrat', 'Inter', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">${custName}</div>
            <div style="font-size: 14px; color: ${BRAND.slateText}; margin-bottom: 4px;">
              ✉️ <a href="mailto:${custEmail}" style="color: ${BRAND.red}; font-weight: 600; text-decoration: none;">${custEmail}</a>
            </div>
            <div style="font-size: 14px; color: ${BRAND.slateText};">
              📞 <a href="tel:${custPhone}" style="color: #0f172a; font-weight: 600; text-decoration: none;">${custPhone}</a>
              &nbsp;&nbsp;
              <a href="https://wa.me/${custPhone.replace(/[^0-9]/g, '')}" target="_blank" style="font-family: 'Montserrat', 'Inter', sans-serif; display: inline-block; background-color: ${BRAND.whatsapp}; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-decoration: none;">
                WhatsApp Chat
              </a>
            </div>
          </div>

          <!-- Detailed Fields Table -->
          <h4 style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.slateMuted}; border-bottom: 2px solid ${BRAND.border}; padding-bottom: 8px;">
            📋 Order &amp; Move Specifications
          </h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; font-family: 'Inter', sans-serif;">
            <tbody>
    `

    let uploadedImages: string[] = []
    const rawImagesVal = fieldsMap['images'] || fieldsMap['imageUrls'] || ''
    if (rawImagesVal) {
      try {
        const parsed = JSON.parse(rawImagesVal)
        if (Array.isArray(parsed)) uploadedImages = parsed.filter(Boolean)
        else if (typeof parsed === 'string' && parsed.startsWith('http')) uploadedImages = [parsed]
      } catch {
        if (rawImagesVal.startsWith('http')) {
          uploadedImages = rawImagesVal.split(',').map((s: string) => s.trim()).filter(Boolean)
        }
      }
    }

    const ignoredKeys = new Set([
      'to', 'toEmail', 'text', 'message', 'images', 'imageUrls', 'attachments',
      '_subject', '_replyto', '_template'
    ])

    for (const [key, value] of Object.entries(fieldsMap)) {
      if (!key.startsWith('_') && !ignoredKeys.has(key)) {
        adminHtml += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 8px; font-weight: 700; color: #475569; width: 35%;">${key}</td>
            <td style="padding: 10px 8px; color: #0f172a; font-weight: 500;">${String(value).replace(/\n/g, '<br>')}</td>
          </tr>
        `
      }
    }

    if (attachments.length > 0) {
      adminHtml += `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 700; color: #475569;">Attachments</td>
          <td style="padding: 10px 8px; color: #0f172a; font-weight: 600;">${attachments.length} file(s) attached</td>
        </tr>
      `
    }

    adminHtml += `
            </tbody>
          </table>
    `

    if (uploadedImages.length > 0) {
      adminHtml += `
        <div style="margin-top: 25px; padding: 18px 20px; background-color: #f8fafc; border: 1px solid ${BRAND.border}; border-radius: 12px;">
          <h4 style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.slateMuted};">
            📸 Customer Inventory Photos (${uploadedImages.length} Image${uploadedImages.length > 1 ? 's' : ''})
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px;">
      `
      for (let i = 0; i < uploadedImages.length; i++) {
        const imgUrl = uploadedImages[i]
        adminHtml += `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px; width: 120px; text-align: center; box-sizing: border-box;">
            <a href="${imgUrl}" target="_blank" style="text-decoration: none; display: block;">
              <img src="${imgUrl}" alt="Photo ${i + 1}" style="width: 100%; height: 85px; object-fit: cover; border-radius: 6px; display: block;" />
              <span style="font-family: 'Montserrat', 'Inter', sans-serif; font-size: 10px; font-weight: 800; color: ${BRAND.red}; display: inline-block; margin-top: 6px;">Photo #${i + 1} ↗</span>
            </a>
          </div>
        `
      }
      adminHtml += `
          </div>
        </div>
      `
    }

    adminHtml += `
        </div>

        ${renderFooter()}
      </div>
    `

    const adminSubject = displayOrderId
      ? `[${displayOrderId}] ${subject.replace(/^\[New Request\]\s*/, '')}`
      : `[New Request] ${subject}`

    // Send to Admins
    await sendEmailWithFallback({
      to: adminRecipients,
      replyTo: replyTo || undefined,
      subject: adminSubject,
      html: adminHtml,
      attachments
    })

    // 2. CUSTOMER BRANDED CONFIRMATION EMAIL TEMPLATE (MATCHING LUXURY CONFIRMATION DESIGN)
    if (custEmail && custEmail.includes('@')) {
      const custFirstName = (custName || 'Customer').trim().split(' ')[0]
      const fromLoc = fieldsMap['Moving From'] || fieldsMap['from'] || fieldsMap['Pickup Address'] || ''
      const toLoc = fieldsMap['Moving To'] || fieldsMap['to'] || fieldsMap['Delivery Address'] || ''
      const prefDate = fieldsMap['Preferred Date'] || fieldsMap['date'] || ''
      const prefTime = fieldsMap['Preferred Time'] || fieldsMap['time'] || ''
      const moveSizeVal = fieldsMap['Move Size'] || fieldsMap['size'] || ''
      const serviceVal = fieldsMap['Moving Package'] || fieldsMap['package'] || fieldsMap['Service Requested'] || ''
      const pickupFloorVal = fieldsMap['Pickup Floor'] || ''
      const deliveryFloorVal = fieldsMap['Delivery Floor'] || ''
      const elevatorVal = fieldsMap['Elevator Available'] || fieldsMap['elevator'] || ''
      const liftVal = fieldsMap['Moving Lift Needed'] || fieldsMap['lift'] || ''
      const assemblyVal = fieldsMap['Furniture Assembly'] || fieldsMap['assembly'] || ''
      const specialVal = fieldsMap['Fragile/Specialty Items'] || fieldsMap['Special Items'] || fieldsMap['special_items'] || ''
      const notesVal = fieldsMap['Additional Notes'] || fieldsMap['notes'] || fieldsMap['message'] || ''

      // Build glance rows with icons and clean styling
      const glanceItems: Array<{ icon: string; label: string; value: string }> = []
      if (fromLoc) glanceItems.push({ icon: '📍', label: 'From', value: fromLoc })
      if (toLoc) glanceItems.push({ icon: '📍', label: 'To', value: toLoc })
      if (prefDate) glanceItems.push({ icon: '📅', label: 'Preferred date', value: prefDate })
      if (prefTime) glanceItems.push({ icon: '🕒', label: 'Preferred time', value: prefTime })
      if (moveSizeVal) glanceItems.push({ icon: '📦', label: 'Move size', value: moveSizeVal })
      if (serviceVal) glanceItems.push({ icon: '🚚', label: 'Service requested', value: serviceVal })
      if (pickupFloorVal) glanceItems.push({ icon: '🏢', label: 'Pickup floor', value: pickupFloorVal })
      if (deliveryFloorVal) glanceItems.push({ icon: '🏢', label: 'Delivery floor', value: deliveryFloorVal })
      if (elevatorVal) glanceItems.push({ icon: '🛗', label: 'Elevator available', value: elevatorVal })
      if (liftVal) glanceItems.push({ icon: '🪜', label: 'Moving lift needed', value: liftVal })
      if (assemblyVal) glanceItems.push({ icon: '🔧', label: 'Furniture assembly', value: assemblyVal })
      if (specialVal && specialVal !== 'No' && specialVal !== 'None') glanceItems.push({ icon: '🍷', label: 'Special items', value: specialVal })
      if (notesVal && notesVal !== 'None') glanceItems.push({ icon: '📝', label: 'Additional notes', value: notesVal })

      const glanceRowsHtml = glanceItems.map((item) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 4px 9px 0; width: 22px; vertical-align: top; font-size: 14px;">${item.icon}</td>
          <td style="padding: 9px 8px 9px 0; width: 38%; vertical-align: top; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 700; color: #475569;">${item.label}</td>
          <td style="padding: 9px 0; vertical-align: top; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.4;">${item.value.replace(/\n/g, '<br>')}</td>
        </tr>
      `).join('')

      const customerHtml = `
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
                      Thanks, ${custFirstName}!<br/>
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
                            <div style="font-family: 'Montserrat Alternates', 'Montserrat', monospace; font-size: 19px; font-weight: 900; color: ${BRAND.red}; letter-spacing: 0.03em; margin-top: 2px;">${displayOrderId || 'ORD-REQUEST'}</div>
                            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Please mention this reference if you contact us about your move.</div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                  <td class="hero-img-col" style="width: 42%; vertical-align: middle; padding: 0; text-align: right; background-color: #f8fafc;">
                    <img 
                      src="https://www.moveitmaastricht.nl/images/email-hero-boxes.png" 
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
                        ${glanceRowsHtml || `
                          <tr>
                            <td style="padding: 10px 0; color: #64748b;">No specific items submitted.</td>
                          </tr>
                        `}
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
                      ${displayOrderId || 'ORD-REQUEST'}
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

            <!-- Uploaded Customer Photos (if any) -->
            ${uploadedImages.length > 0 ? `
              <div style="margin-bottom: 22px; padding: 16px 18px; background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px;">
                <div style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">
                  📸 Your Attached Photos (${uploadedImages.length})
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                  ${uploadedImages.map((imgUrl, i) => `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px; width: 110px; text-align: center; box-sizing: border-box;">
                      <a href="${imgUrl}" target="_blank" style="text-decoration: none; display: block;">
                        <img src="${imgUrl}" alt="Item photo ${i + 1}" style="width: 100%; height: 75px; object-fit: cover; border-radius: 6px; display: block;" />
                        <span style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; color: ${BRAND.red}; display: inline-block; margin-top: 4px;">Photo #${i + 1} ↗</span>
                      </a>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

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
      `

      try {
        await sendEmailWithFallback({
          to: custEmail,
          replyTo: adminEmail,
          subject: 'Your MoveIt Maastricht Quote Request is Confirmed! 🚚',
          html: customerHtml
        })
      } catch (custErr) {
        console.warn('Customer auto-reply email error (non-fatal):', custErr)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Email API critical error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send email'
    })
  }
})
