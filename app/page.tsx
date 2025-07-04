"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Scissors, Users, Gift, CreditCard, Smartphone, QrCode } from "lucide-react"
import { format } from "date-fns"
import { createBooking } from "@/app/actions/create-booking"

interface Client {
  name: string
  phone: string
}

interface BookingData {
  clients: Client[]
  hairstyles: { client: number; style: string; price: number }[]
  selectedDate: Date | null
  selectedTime: string
  hasBringFriend: boolean
  paymentMethod: "ozow" | "cash" | null
  totalPrice: number
}

const HAIRSTYLES = [
  { name: "Basic Cut", price: 150 },
  { name: "Fade Cut", price: 200 },
  { name: "Beard Trim", price: 80 },
  { name: "Full Service", price: 280 },
  { name: "Kids Cut", price: 120 },
  { name: "Wash & Cut", price: 180 },
]

const TIME_SLOTS = [
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

const BOOKED_SLOTS = ["09:00", "11:30", "14:00"] // Simulated booked slots

export default function BookingSystem() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState<BookingData>({
    clients: [{ name: "", phone: "" }],
    hairstyles: [],
    selectedDate: null,
    selectedTime: "",
    hasBringFriend: false,
    paymentMethod: null,
    totalPrice: 0,
  })
  const [orderId, setOrderId] = useState<string>("")

  const addClient = () => {
    setBooking((prev) => ({
      ...prev,
      clients: [...prev.clients, { name: "", phone: "" }],
      hasBringFriend: prev.clients.length === 0,
    }))
  }

  const updateClient = (index: number, field: keyof Client, value: string) => {
    setBooking((prev) => ({
      ...prev,
      clients: prev.clients.map((client, i) => (i === index ? { ...client, [field]: value } : client)),
    }))
  }

  const updateHairstyle = (clientIndex: number, style: string, price: number) => {
    setBooking((prev) => {
      const newHairstyles = [...prev.hairstyles]
      const existingIndex = newHairstyles.findIndex((h) => h.client === clientIndex)

      if (existingIndex >= 0) {
        newHairstyles[existingIndex] = { client: clientIndex, style, price }
      } else {
        newHairstyles.push({ client: clientIndex, style, price })
      }

      const baseTotal = newHairstyles.reduce((sum, h) => sum + h.price, 0)
      const discount = prev.hasBringFriend ? 0.1 : 0
      const totalPrice = baseTotal * (1 - discount)

      return {
        ...prev,
        hairstyles: newHairstyles,
        totalPrice,
      }
    })
  }

  const generateQRCode = () => {
    const qrData = `loyalty:${booking.clients[0].phone}:${Date.now()}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`
  }

  const handleBookingConfirmation = async () => {
    const { orderId } = await createBooking({
      clientName: booking.clients[0].name,
      clientPhone: booking.clients[0].phone,
      hairstyle: booking.hairstyles[0]?.style ?? "Service",
      dateISO: booking.selectedDate!.toISOString().split("T")[0],
      time: booking.selectedTime,
      total: booking.totalPrice,
    })
    setOrderId(orderId)
    setStep(5)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Scissors className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Welcome to StyleBook</h2>
              <p className="text-gray-600">Let's get you booked for your perfect cut!</p>
            </div>

            {booking.clients.map((client, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client {index + 1} Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${index}`}>Full Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={client.name}
                      onChange={(e) => updateClient(index, "name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                    <Input
                      id={`phone-${index}`}
                      value={client.phone}
                      onChange={(e) => updateClient(index, "phone", e.target.value)}
                      placeholder="e.g., 0821234567"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button onClick={addClient} variant="outline" className="flex-1 bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                Add Another Person
              </Button>
              {booking.clients.length > 1 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  10% Friend Discount Applied!
                </Badge>
              )}
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full"
              disabled={!booking.clients.every((c) => c.name && c.phone)}
            >
              Next: Choose Hairstyles
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Select Hairstyles</h2>

            {booking.clients.map((client, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{client.name}'s Hairstyle</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    onValueChange={(value) => {
                      const style = HAIRSTYLES.find((s) => s.name === value)
                      if (style) updateHairstyle(index, style.name, style.price)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a hairstyle" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAIRSTYLES.map((style) => (
                        <SelectItem key={style.name} value={style.name}>
                          {style.name} - R{style.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <div className="text-right">
                  {booking.hasBringFriend && <div className="text-sm text-green-600">Friend Discount: -10%</div>}
                  <div className="text-xl font-bold">R{booking.totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1"
                disabled={booking.hairstyles.length !== booking.clients.length}
              >
                Next: Select Date & Time
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Select Date & Time</h2>

            <Card>
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={booking.selectedDate || undefined}
                  onSelect={(date) => setBooking((prev) => ({ ...prev, selectedDate: date || null }))}
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {booking.selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Times for {format(booking.selectedDate, "MMMM d, yyyy")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isBooked = BOOKED_SLOTS.includes(time)
                      return (
                        <Button
                          key={time}
                          variant={booking.selectedTime === time ? "default" : "outline"}
                          disabled={isBooked}
                          onClick={() => setBooking((prev) => ({ ...prev, selectedTime: time }))}
                          className="relative"
                        >
                          {time}
                          {isBooked && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                              Booked
                            </Badge>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1"
                disabled={!booking.selectedDate || !booking.selectedTime}
              >
                Next: Payment
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Payment Options</h2>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.clients.map((client, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{client.name}</span>
                    <span>{booking.hairstyles[index]?.style}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>R{booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(booking.selectedDate!, "MMMM d, yyyy")} at {booking.selectedTime}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <Button
                variant={booking.paymentMethod === "ozow" ? "default" : "outline"}
                onClick={() => setBooking((prev) => ({ ...prev, paymentMethod: "ozow" }))}
                className="h-16 text-left"
              >
                <CreditCard className="mr-3 h-6 w-6" />
                <div>
                  <div className="font-semibold">Pay with Ozow</div>
                  <div className="text-sm opacity-70">Secure online payment</div>
                </div>
              </Button>

              <Button
                variant={booking.paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setBooking((prev) => ({ ...prev, paymentMethod: "cash" }))}
                className="h-16 text-left"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                <div>
                  <div className="font-semibold">Pay Cash at Salon</div>
                  <div className="text-sm opacity-70">Pay when you arrive</div>
                </div>
              </Button>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleBookingConfirmation} className="flex-1" disabled={!booking.paymentMethod}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="text-green-600">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">✓</div>
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-gray-600">Your appointment has been successfully booked.</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <QrCode className="mx-auto h-8 w-8 mb-2" />
                  <p className="font-semibold">Your Loyalty QR Code</p>
                  <img src={generateQRCode() || "/placeholder.svg"} alt="Loyalty QR Code" className="mx-auto mt-2" />
                  <p className="text-sm text-gray-600 mt-2">Show this QR code at the salon to earn loyalty points!</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Details:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Order #:</strong> {orderId}
                </p>
                <p>
                  <strong>Date:</strong> {format(booking.selectedDate!, "MMMM d, yyyy")}
                </p>
                <p>
                  <strong>Time:</strong> {booking.selectedTime}
                </p>
                <p>
                  <strong>Total:</strong> R{booking.totalPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Payment:</strong> {booking.paymentMethod === "ozow" ? "Ozow (Paid)" : "Cash at salon"}
                </p>
              </div>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full">
              Book Another Appointment
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}
