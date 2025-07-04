"use server"

import { format } from "date-fns"
import { SMSService } from "@/lib/sms-service"
import { ReminderScheduler } from "@/lib/reminder-scheduler"

export interface BookingClient {
  name: string
  phone: string
  hairstyle: string
  price: number
}

export interface BookingPayload {
  clients: BookingClient[]
  dateISO: string
  time: string
  paymentMethod: "ozow" | "cash"
  hasFriendDiscount: boolean
  subtotal: number
  discount: number
  total: number
}

export async function createBooking(payload: BookingPayload) {
  // Generate order number with timestamp and random component
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const orderId = `SB-${timestamp.slice(-6)}${random}`

  const appointmentDateTime = new Date(`${payload.dateISO}T${payload.time}:00`)

  // Send confirmation SMS to primary client
  const primaryClient = payload.clients[0]
  await SMSService.sendOrderConfirmation(
    primaryClient.phone,
    orderId,
    primaryClient.name,
    format(appointmentDateTime, "MMMM d, yyyy"),
    payload.time,
    payload.clients.map((c) => c.hairstyle).join(" + "),
    payload.total,
    payload.hasFriendDiscount,
    payload.clients.length,
  )

  // Schedule reminder SMS
  ReminderScheduler.scheduleReminder(
    orderId,
    primaryClient.phone,
    primaryClient.name,
    appointmentDateTime,
    payload.clients.map((c) => c.hairstyle).join(" + "),
  )

  // If there are multiple clients, send SMS to friend too
  if (payload.clients.length > 1) {
    const friendClient = payload.clients[1]
    await SMSService.sendFriendConfirmation(
      friendClient.phone,
      orderId,
      friendClient.name,
      primaryClient.name,
      format(appointmentDateTime, "MMMM d, yyyy"),
      payload.time,
      friendClient.hairstyle,
      payload.total,
    )
  }

  return { orderId, appointmentDateTime: appointmentDateTime.toISOString() }
}

// Get real available time slots for a specific date
export async function getAvailableTimeSlots(dateISO: string) {
  // In a real implementation, this would check your booking database
  // For now, we'll simulate some booked slots based on the date
  const date = new Date(dateISO)
  const dayOfWeek = date.getDay()

  // Simulate different booking patterns for different days
  let bookedSlots: string[] = []

  if (dayOfWeek === 1) {
    // Monday
    bookedSlots = ["09:00", "11:30", "14:00", "16:00"]
  } else if (dayOfWeek === 5) {
    // Friday
    bookedSlots = ["10:00", "12:00", "13:30", "15:00", "16:30"]
  } else if (dayOfWeek === 6) {
    // Saturday
    bookedSlots = ["08:30", "09:30", "11:00", "12:30", "14:30", "15:30"]
  } else {
    bookedSlots = ["09:30", "13:00", "15:30"]
  }

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

  return {
    available: allSlots.filter((slot) => !bookedSlots.includes(slot)),
    booked: bookedSlots,
  }
}
