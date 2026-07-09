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
    return { success: true }
  } catch (error: any) {
    console.error('Email sending error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send email'
    })
  }
})
