"use server"

import { format } from "date-fns"
import { SMSService } from "@/lib/sms-service"
import { ReminderScheduler } from "@/lib/reminder-scheduler"

/**
 * Payload coming from the client booking form
 */
export interface BookingPayload {
  clientName: string
  clientPhone: string
  hairstyle: string
  dateISO: string // e.g. "2025-07-04"
  time: string // e.g. "14:30"
  total: number
}

/**
 * Creates the booking, sends confirmation SMS and
 * schedules the 5-minute reminder.
 */
export async function createBooking(payload: BookingPayload) {
  const orderId = `ORD-${Date.now().toString().slice(-6)}`

  const appointmentDateTime = new Date(`${payload.dateISO}T${payload.time}:00`)

  // 1️⃣ confirmation SMS
  await SMSService.sendOrderConfirmation(
    payload.clientPhone,
    orderId,
    payload.clientName,
    format(appointmentDateTime, "MMMM d, yyyy"),
    payload.time,
    payload.hairstyle,
    payload.total,
  )

  // 2️⃣  five-minute reminder
  ReminderScheduler.scheduleReminder(
    orderId,
    payload.clientPhone,
    payload.clientName,
    appointmentDateTime,
    payload.hairstyle,
  )

  return { orderId }
}
