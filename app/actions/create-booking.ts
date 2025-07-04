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

interface DailyOrderData {
  orderId: string
  clientName: string
  clientPhone: string
  hairstyle: string
  date: string
  time: string
  total: number
  paymentMethod: string
  hasFriendDiscount: boolean
  timestamp: string
}

// In-memory storage for demo (in production, use a database)
const dailyOrders: DailyOrderData[] = []

export async function createBooking(params: CreateBookingParams) {
  // Generate order ID
  const orderId = `SB-${Date.now()}`

  // Store order data for daily report
  const orderData: DailyOrderData = {
    orderId,
    clientName: params.clients[0].name,
    clientPhone: params.clients[0].phone,
    hairstyle: params.clients.map((c) => c.hairstyle).join(", "),
    date: params.dateISO,
    time: params.time,
    total: params.total,
    paymentMethod: params.paymentMethod,
    hasFriendDiscount: params.hasFriendDiscount,
    timestamp: new Date().toISOString(),
  }

  dailyOrders.push(orderData)

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

export async function sendDailyReport(dateISO: string) {
  // Filter orders for the specific date
  const dayOrders = dailyOrders.filter((order) => order.date === dateISO)

  if (dayOrders.length === 0) {
    console.log("No orders for", dateISO)
    return
  }

  // Calculate daily statistics
  const totalRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = dayOrders.length
  const friendDiscountOrders = dayOrders.filter((order) => order.hasFriendDiscount).length
  const ozowPayments = dayOrders.filter((order) => order.paymentMethod === "ozow").length
  const cashPayments = dayOrders.filter((order) => order.paymentMethod === "cash").length

  // Create CSV content
  const csvHeader = "Order ID,Client Name,Phone,Service,Date,Time,Total,Payment Method,Friend Discount,Timestamp\n"
  const csvRows = dayOrders
    .map(
      (order) =>
        `${order.orderId},${order.clientName},${order.clientPhone},"${order.hairstyle}",${order.date},${order.time},${order.total},${order.paymentMethod},${order.hasFriendDiscount},${order.timestamp}`,
    )
    .join("\n")

  const csvContent = csvHeader + csvRows

  // Create summary
  const summary = `
STYLEBOOK DAILY REPORT - ${dateISO}
=====================================

📊 SUMMARY:
• Total Orders: ${totalOrders}
• Total Revenue: R${totalRevenue.toFixed(2)}
• Friend Discounts: ${friendDiscountOrders} orders
• Ozow Payments: ${ozowPayments}
• Cash Payments: ${cashPayments}

📈 PERFORMANCE:
• Average Order Value: R${(totalRevenue / totalOrders).toFixed(2)}
• Friend Discount Rate: ${((friendDiscountOrders / totalOrders) * 100).toFixed(1)}%
• Digital Payment Rate: ${((ozowPayments / totalOrders) * 100).toFixed(1)}%

Generated: ${new Date().toLocaleString("en-ZA")}
  `

  // In a real implementation, you would:
  // 1. Send email with CSV attachment to salon owner
  // 2. Upload to cloud storage (Google Drive, Dropbox, etc.)
  // 3. Send via WhatsApp Business API
  // 4. Store in database for historical tracking

  console.log("📧 DAILY REPORT SENT TO SALON OWNER:")
  console.log(summary)
  console.log("\n📋 CSV DATA:")
  console.log(csvContent)

  // Simulate email sending
  await sendEmailReport({
    to: "owner@stylebook.co.za",
    subject: `StyleBook Daily Report - ${dateISO}`,
    summary,
    csvContent,
    date: dateISO,
  })

  return { success: true, ordersCount: totalOrders, revenue: totalRevenue }
}

async function sendEmailReport(params: {
  to: string
  subject: string
  summary: string
  csvContent: string
  date: string
}) {
  // Check if SMTP is configured
  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

  if (!smtpConfigured) {
    console.log("📧 DEMO EMAIL (SMTP not configured):")
    console.log(`To: ${params.to}`)
    console.log(`Subject: ${params.subject}`)
    console.log(`CSV attachment: daily-report-${params.date}.csv`)
    console.log("Configure SMTP environment variables to send real emails")
    return
  }

  // Mock email sending - in production, use SendGrid, Nodemailer, etc.
  console.log(`📧 Email sent to: ${params.to}`)
  console.log(`📧 Subject: ${params.subject}`)
  console.log(`📧 CSV attachment: daily-report-${params.date}.csv`)

  // Simulate email API call
  await new Promise((resolve) => setTimeout(resolve, 500))
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
  // Calculate arrival time (30 minutes before appointment)
  const [hours, minutes] = params.time.split(":").map(Number)
  const appointmentDate = new Date()
  appointmentDate.setHours(hours, minutes, 0, 0)
  const arrivalDate = new Date(appointmentDate.getTime() - 30 * 60 * 1000)
  const arrivalTime = arrivalDate.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const message = `Hi ${params.clientName}! Your StyleBook appointment is confirmed.

Order #: ${params.orderId}
Service: ${params.hairstyle}
Date: ${params.date}
Time: ${params.time}
Total: R${params.total.toFixed(2)}
${params.hasFriendDiscount ? "Friend Discount Applied: -10%" : ""}

⏰ IMPORTANT: Please arrive at ${arrivalTime} (30 minutes early)

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
