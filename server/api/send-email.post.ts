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

  // Common Header Styles with Google Fonts (Montserrat Alternates, Montserrat & Inter)
  const fontHeadTags = `
    <!--[if !mso]><!-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Montserrat+Alternates:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Montserrat+Alternates:wght@600;700;800;900&display=swap');
      body, table, td, p, a, div, span {
        font-family: 'Montserrat Alternates', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
      h1, h2, h3, h4, .brand-title, .font-heading {
        font-family: 'Montserrat Alternates', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
      }
    </style>
    <!--<![endif]-->
  `

  // Common Header Component for All Emails
  const renderHeader = (subtitle: string) => `
    ${fontHeadTags}
    <div style="background-color: ${BRAND.dark}; padding: 32px 20px; text-align: center; border-bottom: 3px solid ${BRAND.redLight};">
      <div style="display: inline-block; text-align: center;">
        <a href="https://moveitmaastricht.nl" target="_blank" style="text-decoration: none; display: inline-block;">
          <img 
            src="https://www.moveitmaastricht.nl/images/logo-email.png" 
            alt="MoveIt Maastricht" 
            width="220"
            style="width: 220px; max-width: 260px; height: auto; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;" 
          />
        </a>
        <p style="font-family: 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; margin: 12px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em;">
          ${subtitle}
        </p>
      </div>
    </div>
  `

  // Common Footer Component for All Emails
  const renderFooter = () => `
    <div style="background-color: ${BRAND.bgLight}; padding: 25px 20px; text-align: center; border-top: 1px solid ${BRAND.border}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="margin-bottom: 12px;">
        <a href="https://moveitmaastricht.nl" style="font-family: 'Montserrat', 'Inter', sans-serif; color: ${BRAND.redLight}; text-decoration: none; font-weight: 700; font-size: 13px; margin: 0 10px;">Website</a>
        <span style="color: #cbd5e1;">•</span>
        <a href="https://wa.me/31684094271" style="font-family: 'Montserrat', 'Inter', sans-serif; color: ${BRAND.whatsapp}; text-decoration: none; font-weight: 700; font-size: 13px; margin: 0 10px;">WhatsApp</a>
        <span style="color: #cbd5e1;">•</span>
        <a href="tel:+31684094271" style="font-family: 'Montserrat', 'Inter', sans-serif; color: ${BRAND.slateMuted}; text-decoration: none; font-weight: 700; font-size: 13px; margin: 0 10px;">+31 6 84094271</a>
      </div>
      <p style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; font-size: 12px; color: ${BRAND.slateMuted}; line-height: 1.6;">
        &copy; ${new Date().getFullYear()} <strong>MoveIt Maastricht</strong>. All rights reserved.<br/>
        Premium Relocation &amp; Logistics Services • Maastricht &amp; Limburg, Netherlands
      </p>
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
          ${renderHeader('Official Communication • MoveIt Maastricht')}
          
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
        ${renderHeader('Admin Dispatch Console • New Order Alert')}

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

    for (const [key, value] of Object.entries(fieldsMap)) {
      if (!key.startsWith('_') && key !== 'to' && key !== 'toEmail' && key !== 'text' && key !== 'message') {
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

    // 2. CUSTOMER BRANDED CONFIRMATION EMAIL TEMPLATE
    if (custEmail && custEmail.includes('@')) {
      const movePackage = fieldsMap['Moving Package'] || fieldsMap['package'] || ''
      const moveSize = fieldsMap['Move Size'] || fieldsMap['size'] || ''
      const moveTime = fieldsMap['Preferred Time'] || fieldsMap['time'] || ''
      const floorInfo = (fieldsMap['Pickup Floor'] || fieldsMap['Delivery Floor'])
        ? `From Floor ${fieldsMap['Pickup Floor'] || 'Ground'} ➔ To Floor ${fieldsMap['Delivery Floor'] || 'Ground'}`
        : ''

      const customerHtml = `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);">
          ${renderHeader('Premium Relocation & Logistics • Maastricht')}

          <div style="padding: 35px 30px; color: ${BRAND.slateText}; font-family: 'Inter', sans-serif;">
            
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="font-family: 'Montserrat', 'Inter', sans-serif; display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-weight: 800; font-size: 12px; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em;">
                ✓ Request Registered &amp; Confirmed ${displayOrderId ? `(${displayOrderId})` : ''}
              </span>
            </div>

            <!-- Title -->
            <h2 style="font-family: 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0 0 12px 0; font-size: 25px; font-weight: 900; letter-spacing: -0.5px; text-align: center;">
              Thank you, ${custName}!
            </h2>
            
            <p style="font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; color: #475569; text-align: center; margin: 0 0 25px 0;">
              Your moving request has been successfully received by our Maastricht dispatch team. We are calculating optimal scheduling and will reach out with your exact quote confirmation.
            </p>

            <!-- Order Summary Card -->
            <div style="background-color: #f8fafc; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 22px 20px; margin-bottom: 25px;">
              <h3 style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 0 0 14px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.red};">
                📋 Summary of Your Request
              </h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; font-family: 'Inter', sans-serif;">
                <tbody>
                  ${displayOrderId ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b; width: 35%;">Order ID:</td>
                      <td style="font-family: 'Montserrat', 'Inter', sans-serif; padding: 9px 0; font-weight: 800; color: ${BRAND.red};">${displayOrderId}</td>
                    </tr>
                  ` : ''}
                  ${quoteCode ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Quote Code:</td>
                      <td style="font-family: 'Montserrat', 'Inter', sans-serif; padding: 9px 0; font-weight: 700; color: #0f172a;">${quoteCode}</td>
                    </tr>
                  ` : ''}
                  ${confirmationId ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Confirmation ID:</td>
                      <td style="font-family: 'Montserrat', 'Inter', sans-serif; padding: 9px 0; font-weight: 700; color: #0284c7;">${confirmationId}</td>
                    </tr>
                  ` : ''}
                  ${(fromLocation && toLocation) ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b; width: 35%;">Route:</td>
                      <td style="padding: 9px 0; font-weight: 700; color: #0f172a;">${fromLocation} <span style="color: ${BRAND.red};">➔</span> ${toLocation}</td>
                    </tr>
                  ` : ''}

                  ${moveDateStr ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Move Date:</td>
                      <td style="padding: 9px 0; font-weight: 700; color: #0f172a;">${moveDateStr} ${moveTime ? `(${moveTime})` : ''}</td>
                    </tr>
                  ` : ''}

                  ${movePackage ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Package:</td>
                      <td style="font-family: 'Montserrat', 'Inter', sans-serif; padding: 9px 0; font-weight: 800; color: ${BRAND.red};">${movePackage}</td>
                    </tr>
                  ` : ''}

                  ${moveSize ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Move Size:</td>
                      <td style="padding: 9px 0; color: #0f172a;">${moveSize}</td>
                    </tr>
                  ` : ''}

                  ${floorInfo ? `
                    <tr>
                      <td style="padding: 9px 0; font-weight: 700; color: #64748b;">Floors:</td>
                      <td style="padding: 9px 0; color: #0f172a;">${floorInfo}</td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>

            <!-- 3-Step Process Guide -->
            <div style="background-color: #ffffff; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 20px; margin-bottom: 30px;">
              <h4 style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 0 0 15px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a;">
                🚀 What Happens Next?
              </h4>
              
              <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                <div style="font-family: 'Montserrat', sans-serif; background: ${BRAND.dark}; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 800; display: inline-block; margin-right: 12px; vertical-align: middle;">1</div>
                <div style="display: inline-block; font-size: 14px; color: #475569; width: calc(100% - 40px); vertical-align: middle;">
                  <strong style="color: #0f172a;">Coordination &amp; Quote:</strong> Our coordinator reviews your access details and route.
                </div>
              </div>

              <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                <div style="font-family: 'Montserrat', sans-serif; background: ${BRAND.dark}; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 800; display: inline-block; margin-right: 12px; vertical-align: middle;">2</div>
                <div style="display: inline-block; font-size: 14px; color: #475569; width: calc(100% - 40px); vertical-align: middle;">
                  <strong style="color: #0f172a;">Schedule Confirmation:</strong> We confirm team, truck, and arrival window with you.
                </div>
              </div>

              <div style="display: flex; align-items: flex-start;">
                <div style="font-family: 'Montserrat', sans-serif; background: ${BRAND.red}; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: 800; display: inline-block; margin-right: 12px; vertical-align: middle;">3</div>
                <div style="display: inline-block; font-size: 14px; color: #475569; width: calc(100% - 40px); vertical-align: middle;">
                  <strong style="color: #0f172a;">Moving Day Execution:</strong> Our certified moving crew arrives on time for a stress-free move.
                </div>
              </div>
            </div>

            <!-- Direct Contact CTA -->
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <p style="font-size: 14px; color: ${BRAND.slateMuted}; margin-bottom: 14px;">
                Have questions or need to make urgent changes to your date?
              </p>
              <a href="https://wa.me/31684094271" style="font-family: 'Montserrat', 'Inter', sans-serif; display: inline-block; background-color: ${BRAND.whatsapp}; color: #ffffff; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                💬 Chat with us on WhatsApp (+31 6 84094271)
              </a>
            </div>

            <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid ${BRAND.border};">
              <p style="margin: 0; font-size: 14px; color: ${BRAND.slateMuted};">Warm regards,</p>
              <p style="font-family: 'Montserrat', 'Inter', sans-serif; margin: 4px 0 0 0; font-size: 16px; font-weight: 800; color: ${BRAND.red};">The MoveIt Maastricht Team</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: ${BRAND.slateMuted};">Maastricht, Limburg • Netherlands</p>
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
