import { SMSService } from "./sms-service"

export interface ScheduledReminder {
  id: string
  orderId: string
  clientPhone: string
  clientName: string
  appointmentTime: Date
  hairstyle: string
  reminderTime: Date
  status: "scheduled" | "sent" | "failed"
}

export class ReminderScheduler {
  private static reminders: Map<string, NodeJS.Timeout> = new Map()
  private static scheduledReminders: ScheduledReminder[] = []

  static scheduleReminder(
    orderId: string,
    clientPhone: string,
    clientName: string,
    appointmentDateTime: Date,
    hairstyle: string,
  ): string {
    // Calculate reminder time (5 minutes before appointment)
    const reminderTime = new Date(appointmentDateTime.getTime() - 5 * 60 * 1000)
    const now = new Date()

    // Only schedule if reminder time is in the future
    if (reminderTime <= now) {
      console.log("Appointment is too soon to schedule reminder")
      return ""
    }

    const reminderId = `reminder_${orderId}_${Date.now()}`
    const timeUntilReminder = reminderTime.getTime() - now.getTime()

    // Schedule the reminder
    const timeoutId = setTimeout(async () => {
      await this.sendReminder(orderId, clientPhone, clientName, appointmentDateTime, hairstyle)
      this.reminders.delete(reminderId)
    }, timeUntilReminder)

    // Store the timeout reference
    this.reminders.set(reminderId, timeoutId)

    // Store reminder details
    const reminder: ScheduledReminder = {
      id: reminderId,
      orderId,
      clientPhone,
      clientName,
      appointmentTime: appointmentDateTime,
      hairstyle,
      reminderTime,
      status: "scheduled",
    }

    this.scheduledReminders.push(reminder)

    console.log(`Reminder scheduled for ${reminderTime.toLocaleString()}`)
    return reminderId
  }

  private static async sendReminder(
    orderId: string,
    clientPhone: string,
    clientName: string,
    appointmentDateTime: Date,
    hairstyle: string,
  ): Promise<void> {
    try {
      const timeString = appointmentDateTime.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      const result = await SMSService.sendAppointmentReminder(clientPhone, orderId, clientName, timeString, hairstyle)

      // Update reminder status
      const reminder = this.scheduledReminders.find((r) => r.orderId === orderId)
      if (reminder) {
        reminder.status = result.success ? "sent" : "failed"
      }

      console.log(`Reminder ${result.success ? "sent" : "failed"} for order ${orderId}`)
    } catch (error) {
      console.error("Error sending reminder:", error)
    }
  }

  static cancelReminder(orderId: string): boolean {
    const reminder = this.scheduledReminders.find((r) => r.orderId === orderId)
    if (reminder && this.reminders.has(reminder.id)) {
      clearTimeout(this.reminders.get(reminder.id))
      this.reminders.delete(reminder.id)
      reminder.status = "failed" // Mark as cancelled
      return true
    }
    return false
  }

  static getScheduledReminders(): ScheduledReminder[] {
    return this.scheduledReminders.filter((r) => r.status === "scheduled")
  }

  static getAllReminders(): ScheduledReminder[] {
    return this.scheduledReminders
  }
}
