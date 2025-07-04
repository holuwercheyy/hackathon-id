export interface SMSMessage {
  to: string
  message: string
  orderId?: string
  type: "confirmation" | "reminder" | "cancellation"
}

export interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

export class SMSService {
  // Using a generic SMS API (you can replace with your preferred provider like Twilio, Clickatell, etc.)
  private static readonly SMS_API_URL = process.env.SMS_API_URL || "https://api.demo-sms.com/send"
  private static readonly SMS_API_KEY = process.env.SMS_API_KEY || "demo-key"

  static async sendSMS(smsData: SMSMessage): Promise<SMSResponse> {
    try {
      // For development/demo purposes, simulate SMS sending
      if (this.SMS_API_KEY === "demo-key" || !process.env.SMS_API_KEY) {
        console.log("📱 DEMO SMS (would be sent in production):", smsData)
        return {
          success: true,
          messageId: `demo_msg_${Date.now()}`,
        }
      }

      // Simulate SMS API call
      console.log("Sending SMS:", smsData)

      // In a real implementation, you would make an HTTP request to your SMS provider
      const response = await fetch(this.SMS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.SMS_API_KEY}`,
        },
        body: JSON.stringify({
          to: smsData.to,
          message: smsData.message,
          from: process.env.NEXT_PUBLIC_SALON_NAME || "StyleBook",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          messageId: result.messageId || `msg_${Date.now()}`,
        }
      } else {
        return {
          success: false,
          error: "Failed to send SMS",
        }
      }
    } catch (error) {
      console.error("SMS sending error:", error)
      return {
        success: false,
        error: "SMS service unavailable",
      }
    }
  }

  static async sendOrderConfirmation(
    clientPhone: string,
    orderId: string,
    clientName: string,
    date: string,
    time: string,
    hairstyle: string,
    total: number,
  ): Promise<SMSResponse> {
    const message = `Hi ${clientName}! Your StyleBook appointment is confirmed.
    
Order #: ${orderId}
Service: ${hairstyle}
Date: ${date}
Time: ${time}
Total: R${total.toFixed(2)}

We'll send you a reminder 5 minutes before your appointment. See you soon! ✂️

Reply STOP to opt out.`

    return this.sendSMS({
      to: clientPhone,
      message,
      orderId,
      type: "confirmation",
    })
  }

  static async sendAppointmentReminder(
    clientPhone: string,
    orderId: string,
    clientName: string,
    time: string,
    hairstyle: string,
  ): Promise<SMSResponse> {
    const message = `Hi ${clientName}! Your ${hairstyle} appointment starts in 5 minutes at ${time}.

Order #: ${orderId}

Please arrive on time. Looking forward to seeing you! ✂️

StyleBook Salon`

    return this.sendSMS({
      to: clientPhone,
      message,
      orderId,
      type: "reminder",
    })
  }

  static async sendCancellationNotice(
    clientPhone: string,
    orderId: string,
    clientName: string,
    date: string,
    time: string,
  ): Promise<SMSResponse> {
    const message = `Hi ${clientName}, your StyleBook appointment has been cancelled.

Order #: ${orderId}
Original time: ${date} at ${time}

Please call us to reschedule: (011) 123-4567

We apologize for any inconvenience.

StyleBook Salon`

    return this.sendSMS({
      to: clientPhone,
      message,
      orderId,
      type: "cancellation",
    })
  }
}
