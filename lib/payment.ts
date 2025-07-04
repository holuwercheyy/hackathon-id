export interface OzowPaymentData {
  amount: number
  reference: string
  clientName: string
  clientEmail?: string
  clientPhone: string
}

export class PaymentService {
  static async initiateOzowPayment(paymentData: OzowPaymentData): Promise<string> {
    // Simulate Ozow payment initiation
    const paymentUrl = `https://pay.ozow.com/payment?amount=${paymentData.amount}&reference=${paymentData.reference}&name=${encodeURIComponent(paymentData.clientName)}&phone=${paymentData.clientPhone}`

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
