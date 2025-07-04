"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SMSService } from "@/lib/sms-service"
import { MessageSquare, Send } from "lucide-react"

export default function SMSTester() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<string>("")

  const sendTestSMS = async () => {
    if (!phoneNumber || !message) return

    setIsSending(true)
    setResult("")

    try {
      const response = await SMSService.sendSMS({
        to: phoneNumber,
        message: message,
        type: "reminder",
      })

      if (response.success) {
        setResult(`✅ SMS sent successfully! Message ID: ${response.messageId}`)
      } else {
        setResult(`❌ Failed to send SMS: ${response.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsSending(false)
    }
  }

  const sendTestReminder = async () => {
    if (!phoneNumber) return

    setIsSending(true)
    setResult("")

    try {
      const response = await SMSService.sendAppointmentReminder(
        phoneNumber,
        "TEST-001",
        "Test Client",
        "14:30",
        "Fade Cut",
      )

      if (response.success) {
        setResult(`✅ Test reminder sent! Message ID: ${response.messageId}`)
      } else {
        setResult(`❌ Failed to send reminder: ${response.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g., 0821234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your test message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={sendTestSMS}
              disabled={isSending || !phoneNumber || !message}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Custom
            </Button>

            <Button
              onClick={sendTestReminder}
              disabled={isSending || !phoneNumber}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <MessageSquare className="h-4 w-4" />
              Test Reminder
            </Button>
          </div>

          {result && <div className="p-3 bg-gray-50 rounded-lg text-sm">{result}</div>}

          {isSending && <div className="text-center text-sm text-gray-600">Sending SMS...</div>}
        </CardContent>
      </Card>
    </div>
  )
}
