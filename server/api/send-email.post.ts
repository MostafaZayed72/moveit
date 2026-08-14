import { readMultipartFormData, readBody, getHeader } from 'h3'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const gmailUser = config.gmailUser
  const gmailPass = config.gmailPass
  const adminEmail = config.adminEmail

  let subject = 'New Quote/Contact Request'
  let replyTo = ''
  let html = ''
  const attachments: any[] = []

  const contentType = getHeader(event, 'content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    const fields: Record<string, string> = {}
    
    if (parts) {
      for (const part of parts) {
        if (part.filename) {
          attachments.push({
            filename: part.filename,
            content: part.data,
            contentType: part.type
          })
        } else if (part.name) {
          fields[part.name] = part.data.toString('utf-8')
        }
      }
    }

    subject = fields['_subject'] || subject
    replyTo = fields['_replyto'] || fields['Email'] || fields['Email Address'] || ''
    
    // Construct HTML body from fields
    html = `
      <h3>${subject}</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse; font-family: sans-serif; width: 100%; max-width: 600px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th align="left">Field</th>
            <th align="left">Value</th>
          </tr>
        </thead>
        <tbody>
    `
    for (const [key, value] of Object.entries(fields)) {
      if (!key.startsWith('_')) {
        html += `
          <tr>
            <td style="font-weight: bold; width: 30%;">${key}</td>
            <td>${value.replace(/\n/g, '<br>')}</td>
          </tr>
        `
      }
    }
    html += `
        </tbody>
      </table>
    `
  } else {
    // JSON body (from referral program or other pages)
    const body = await readBody(event)
    subject = body._subject || subject
    replyTo = body._replyto || body['Referrer Email'] || body['Email'] || ''

    html = `
      <h3>${subject}</h3>
      <table border="1" cellpadding="8" style="border-collapse: collapse; font-family: sans-serif; width: 100%; max-width: 600px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th align="left">Field</th>
            <th align="left">Value</th>
          </tr>
        </thead>
        <tbody>
    `
    for (const [key, value] of Object.entries(body)) {
      if (!key.startsWith('_')) {
        const displayValue = typeof value === 'string' ? value.replace(/\n/g, '<br>') : JSON.stringify(value)
        html += `
          <tr>
            <td style="font-weight: bold; width: 30%;">${key}</td>
            <td>${displayValue}</td>
          </tr>
        `
      }
    }
    html += `
        </tbody>
      </table>
    `
  }

  // Create Nodemailer Transporter using Gmail App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  })

  // Send mail to the admin email or gmail user
  const mailOptions = {
    from: `MoveIt Maastricht <${gmailUser}>`,
    to: adminEmail || gmailUser,
    replyTo: replyTo || undefined,
    subject: subject,
    html: html,
    attachments: attachments
  }

  try {
    await transporter.sendMail(mailOptions)

    // Auto-reply to customer
    if (replyTo) {
      const autoReplyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #0f172a; padding: 30px; text-align: center; border-bottom: 4px solid #dc2626;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">
              <span style="color: #dc2626;">move</span>it
            </h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff; color: #334155;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 24px;">Thank You for Your Request!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Dear Customer,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Your order has been successfully registered. Our team is currently reviewing your details and we will contact you very soon to confirm everything.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">If you have any urgent questions, feel free to reply to this email or contact us directly.</p>
            <br/>
            <p style="font-size: 16px; margin-bottom: 0; color: #475569;">Best regards,</p>
            <p style="font-size: 16px; font-weight: 700; color: #dc2626; margin-top: 5px;">The MoveIt Maastricht Team</p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} MoveIt Maastricht. All rights reserved.
          </div>
        </div>
      `
      
      await transporter.sendMail({
        from: `MoveIt Maastricht <${gmailUser}>`,
        to: replyTo,
        subject: 'Your Request is Confirmed - MoveIt Maastricht',
        html: autoReplyHtml
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Email sending error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send email'
    })
  }
})
