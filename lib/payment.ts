export interface OzowPaymentData {
  amount: number
  reference: string
  clientName: string
  clientEmail?: string
  clientPhone: string
}

export class PaymentService {
  private static readonly OZOW_SITE_CODE = process.env.OZOW_SITE_CODE || "DEMO_SITE"
  private static readonly OZOW_API_KEY = process.env.OZOW_API_KEY || "demo-key"

  static async initiateOzowPayment(paymentData: OzowPaymentData): Promise<string> {
    // For development/demo purposes
    if (this.OZOW_API_KEY === "demo-key" || !process.env.OZOW_API_KEY) {
      console.log("💳 DEMO PAYMENT (would redirect to Ozow in production):", paymentData)
      return `https://demo-payment.com/pay?amount=${paymentData.amount}&ref=${paymentData.reference}`
    }

    // Simulate Ozow payment initiation
    const paymentUrl = `https://pay.ozow.com/payment?amount=${paymentData.amount}&reference=${paymentData.reference}&name=${encodeURIComponent(paymentData.clientName)}&phone=${paymentData.clientPhone}&siteCode=${this.OZOW_SITE_CODE}`

    console.log("Initiating Ozow payment:", paymentData)

    // In a real implementation, you would:
    // 1. Make API call to Ozow
    // 2. Return the payment URL
    // 3. Handle webhooks for payment confirmation

    return paymentUrl
  }

  static async verifyPayment(reference: string): Promise<boolean> {
    // Simulate payment verification
    console.log("Verifying payment:", reference)
    return true
  }

  static calculateDiscount(baseAmount: number, hasBringFriend: boolean): number {
    return hasBringFriend ? baseAmount * 0.1 : 0
  }

  static calculateTotal(baseAmount: number, hasBringFriend: boolean): number {
    const discount = this.calculateDiscount(baseAmount, hasBringFriend)
    return baseAmount - discount
  }
}
