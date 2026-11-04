import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const action = body.action || 'trigger_automation'

    // Server-side Supabase client (fallback gracefully if not connected)
    let supabase: any = null
    try {
      supabase = await serverSupabaseClient(event)
    } catch {
      // Non-fatal if Supabase auth context is optional
    }

    // Gmail / Resend config for real delivery
    const config = useRuntimeConfig()
    const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY
    const adminEmail = config.adminEmail || process.env.ADMIN_EMAIL || 'info@moveitmaastricht.nl'
    const gmailUser = config.gmailUser || process.env.GMAIL_USER || 'moveitmaastricht@gmail.com'
    const gmailPass = config.gmailPass || process.env.GMAIL_PASS || 'xfphkyhxkoxpjbhw'
    const fromEmail = 'onboarding@moveitmaastricht.nl'

    const resend = resendApiKey ? new Resend(resendApiKey) : null
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    })

    const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
      let sent = false
      if (resend) {
        try {
          await resend.emails.send({
            from: `MoveIt Maastricht <${fromEmail}>`,
            to,
            replyTo: adminEmail,
            subject,
            html
          })
          sent = true
        } catch (e) {
          console.warn('Resend failed in automation, falling back to Gmail:', e)
        }
      }
      if (!sent) {
        await transporter.sendMail({
          from: `"MoveIt Maastricht" <${gmailUser}>`,
          to,
          replyTo: adminEmail,
          subject,
          html
        })
      }
    }

    // 1. TRIGGER AUTOMATION ACTION
    if (action === 'trigger_automation') {
      const {
        automationType,
        orderId,
        customerName = 'Customer',
        recipientEmail,
        recipientPhone,
        route = 'Maastricht',
        ref = 'J-26-0000',
        quoteAmount = 850,
        customSubject,
        customMessage
      } = body

      let subject = customSubject || ''
      let emailContent = ''
      let whatsappText = ''
      let automationName = 'General Automation'

      const cleanPhone = (recipientPhone || '').replace(/[^0-9]/g, '')
      const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

      if (automationType === 'quote_followup') {
        automationName = 'Quotation Follow-Up (3-Day Check-in)'
        subject = subject || `Quick check-in on your MoveIt quotation (${ref})`
        whatsappText = `Hello ${customerName}! 🚚\n\nThis is Sherif from MoveIt Maastricht following up on quotation *${ref}* for your relocation (${route}).\n\nWe have reserved your preferred moving slot. Would you like to review or confirm the quote?\n\n👉 View details: https://moveitmaastricht.nl\n📞 Or reply directly here to discuss any details!`
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #dc2626; margin: 0;">MoveIt Maastricht</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Premium Relocation & Logistics</p>
            </div>
            <h3 style="color: #0f172a;">Hello ${customerName},</h3>
            <p style="color: #334155; line-height: 1.6;">
              I wanted to follow up and see if you had any questions regarding quotation <strong>${ref}</strong> for your upcoming move: <strong>${route}</strong>.
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">Quotation Summary:</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0f172a;">Estimated Total: €${quoteAmount} (Incl. VAT)</p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #16a34a; font-weight: bold;">✓ Fixed-Price Guarantee &amp; Comprehensive Insurance Included</p>
            </div>
            <p style="color: #334155; line-height: 1.6;">
              Dates fill up quickly across the Maastricht and Limburg region. If you would like to lock in this date or adjust items, simply reply to this email or reach us on WhatsApp.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://wa.me/31621713503" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
                💬 Chat with Coordinator on WhatsApp
              </a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px;">
              MoveIt Maastricht B.V. • Oranjeplein 35D, 6224 KV Maastricht • Tel: +31 6 21713503
            </p>
          </div>
        `
      } else if (automationType === 'job_reminder') {
        automationName = 'Pre-Move Reminder (24h Before)'
        subject = subject || `Moving Tomorrow! Important details for move ${ref}`
        whatsappText = `Hello ${customerName}! 🚚\n\nYour move with MoveIt Maastricht is scheduled for *TOMORROW*!\n\n📍 Route: ${route}\n🕒 Team Arrival Time: 08:00 AM\n🚐 Vehicle: Ford Transit 20m³\n\n💡 *Helpful Reminders:*\n1. Please ensure a parking spot (~10 meters) is available near your entrance.\n2. Keep valuables and essential documents in a separate personal bag.\n\nSee you tomorrow morning! Call us at +31 6 21713503 if anything changes.`
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #dc2626; margin: 0;">MoveIt Maastricht</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Relocation Checklist & Arrival Time</p>
            </div>
            <h3 style="color: #0f172a;">Good Day ${customerName},</h3>
            <p style="color: #334155; line-height: 1.6;">
              Our moving crew is ready for your relocation tomorrow! Here is your quick checklist and schedule summary:
            </p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 18px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #166534;">⏰ Planned Arrival: 08:00 AM</p>
              <p style="margin: 0; font-size: 13px; color: #15803d;">Route: ${route}</p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #15803d;">Crew: Certified MoveIt Team &amp; Padded Van (20m³)</p>
            </div>
            <h4 style="color: #0f172a; margin: 20px 0 8px 0;">Pre-Move Checklist:</h4>
            <ul style="color: #475569; font-size: 13px; line-height: 1.8;">
              <li>✓ Reserve space for our van right in front of the building entrance.</li>
              <li>✓ Secure keys, passports, and medicines in your personal travel bag.</li>
              <li>✓ Clearly label any fragile or high-priority boxes.</li>
            </ul>
            <p style="color: #64748b; font-size: 13px;">Our drivers will call you 15 minutes before arrival at your address.</p>
          </div>
        `
      } else if (automationType === 'review_request') {
        automationName = 'Post-Move Review & Google 5★ Feedback'
        subject = subject || `How was your relocation with MoveIt Maastricht? ⭐⭐⭐⭐⭐`
        whatsappText = `Hello ${customerName}! ⭐\n\nWe hope you are settling in wonderfully at your new home!\n\nCould you please take 30 seconds to share your experience on Google? It means the world to our local moving crew:\n\n👉 https://g.page/r/MoveItMaastricht/review\n\nThank you for choosing MoveIt Maastricht!`
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; text-align: center;">
            <h2 style="color: #dc2626; margin: 0 0 6px 0;">MoveIt Maastricht</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0 0 20px 0;">Thank You for Moving with Us!</p>
            <h3 style="color: #0f172a;">Hello ${customerName},</h3>
            <p style="color: #334155; line-height: 1.6; max-width: 480px; margin: 0 auto 20px auto;">
              We hope your move from <strong>${route}</strong> went smoothly and you are settling in comfortably.
            </p>
            <div style="font-size: 28px; margin: 20px 0;">
              ⭐⭐⭐⭐⭐
            </div>
            <p style="color: #475569; font-size: 14px; margin-bottom: 24px;">
              Your feedback helps other residents across Limburg and the Netherlands find reliable movers. Could you please leave us a short Google review?
            </p>
            <a href="https://g.page/r/MoveItMaastricht/review" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);">
              ★ Leave a Google Review
            </a>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
              Thank you for trusting MoveIt Maastricht with your relocation!
            </p>
          </div>
        `
      } else {
        automationName = 'Custom Notification Dispatch'
        subject = subject || `Update regarding your move (${ref})`
        whatsappText = customMessage || `Hello ${customerName}, here is an update regarding move ${ref}: ${route}.`
        emailContent = `<div style="font-family: Arial, sans-serif; padding: 20px;"><h3>Hello ${customerName},</h3><p>${customMessage || 'We have updated your moving file.'}</p></div>`
      }

      // 1. Send Email if recipient has valid email
      let emailSent = false
      let emailError: string | null = null
      if (recipientEmail && recipientEmail.includes('@') && recipientEmail !== 'N/A') {
        try {
          await sendEmail({
            to: recipientEmail,
            subject,
            html: emailContent
          })
          emailSent = true
        } catch (err: any) {
          console.warn('Automation email send failed:', err.message)
          emailError = err.message
        }
      }

      // 2. Generate WhatsApp link
      const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}` : ''

      // 3. Log to Supabase
      let logRecord: any = {
        id: `log_${Date.now()}`,
        automation_name: automationName,
        order_id: orderId || null,
        customer_name: customerName,
        customer_email: recipientEmail,
        customer_phone: recipientPhone,
        channel: emailSent ? 'email' : 'whatsapp',
        status: emailSent ? 'sent' : (whatsappUrl ? 'delivered' : 'failed'),
        payload: {
          subject,
          whatsappText,
          ref,
          route
        },
        error_message: emailError,
        created_at: new Date().toISOString()
      }

      if (supabase) {
        try {
          const { data } = await supabase.from('automation_logs').insert([logRecord]).select()
          if (data && data[0]) logRecord = data[0]
        } catch (dbErr) {
          console.warn('Logging to Supabase table automation_logs skipped:', dbErr)
        }
      }

      return {
        success: true,
        automationName,
        emailSent,
        whatsappUrl,
        log: logRecord,
        previewText: whatsappText
      }
    }

    // 2. GET RECENT LOGS ACTION
    if (action === 'get_logs') {
      if (supabase) {
        try {
          const { data } = await supabase.from('automation_logs').select('*').order('created_at', { ascending: false }).limit(20)
          return { success: true, logs: data || [] }
        } catch {
          return { success: true, logs: [] }
        }
      }
      return { success: true, logs: [] }
    }

    return { success: true, message: 'Automation service alive' }
  } catch (err: any) {
    console.error('Automation handler error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal Automation Error'
    })
  }
})

