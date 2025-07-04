"use server"

export interface BookingClient {
  name: string
  phone: string
  hairstyle: string
  price: number
}

interface CreateBookingParams {
  clients: BookingClient[]
  dateISO: string
  time: string
  paymentMethod: "ozow" | "cash"
  hasFriendDiscount: boolean
  subtotal: number
  discount: number
  total: number
}

export async function createBooking(params: CreateBookingParams) {
  // Generate order ID
  const orderId = `SB-${Date.now()}`

  // Simulate booking creation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Send SMS confirmations
  try {
    for (const client of params.clients) {
      await sendBookingConfirmation({
        orderId,
        clientName: client.name,
        clientPhone: client.phone,
        hairstyle: client.hairstyle,
        date: params.dateISO,
        time: params.time,
        total: params.total,
        paymentMethod: params.paymentMethod,
        hasFriendDiscount: params.hasFriendDiscount,
      })
    }

    // Schedule 5-minute reminders
    await scheduleReminder({
      orderId,
      clients: params.clients,
      dateISO: params.dateISO,
      time: params.time,
    })
  } catch (error) {
    console.error("SMS sending failed:", error)
    // Continue with booking even if SMS fails
  }

  return { orderId }
}

export async function getAvailableTimeSlots(dateISO: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const allSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  // Simulate some booked slots based on date
  const bookedSlots = dateISO.includes("2024-01-15") ? ["09:00", "11:30", "14:00"] : ["10:00", "13:30"]

  const available = allSlots.filter((slot) => !bookedSlots.includes(slot))

  return {
    available,
    booked: bookedSlots,
  }
}

async function sendBookingConfirmation(params: {
  orderId: string
  clientName: string
  clientPhone: string
  hairstyle: string
  date: string
  time: string
  total: number
  paymentMethod: string
  hasFriendDiscount: boolean
}) {
  const message = `Hi ${params.clientName}! Your StyleBook appointment is confirmed.

Order #: ${params.orderId}
Service: ${params.hairstyle}
Date: ${params.date}
Time: ${params.time}
Total: R${params.total.toFixed(2)}
${params.hasFriendDiscount ? "Friend Discount Applied: -10%" : ""}

We'll send you a reminder 5 minutes before your appointment. See you soon! ✂️`

  // Mock SMS sending
  console.log("SMS sent to", params.clientPhone, ":", message)
}

async function scheduleReminder(params: {
  orderId: string
  clients: BookingClient[]
  dateISO: string
  time: string
}) {
  // Mock reminder scheduling
  console.log("Reminder scheduled for order:", params.orderId)
}
