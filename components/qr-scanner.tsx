"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Smartphone, Gift } from "lucide-react"

interface LoyaltyData {
  clientPhone: string
  points: number
  visits: number
  lastVisit: string
}

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<string>("")
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async (data: string) => {
    if (data.startsWith("loyalty:")) {
      const [, phone] = data.split(":")

      // Simulate loyalty lookup
      const mockLoyaltyData: LoyaltyData = {
        clientPhone: phone,
        points: 150,
        visits: 8,
        lastVisit: "2024-01-10",
      }

      setLoyaltyData(mockLoyaltyData)
      setScannedData(data)
    }
  }

  const addLoyaltyPoints = (points: number) => {
    if (loyaltyData) {
      setLoyaltyData((prev) =>
        prev
          ? {
              ...prev,
              points: prev.points + points,
              visits: prev.visits + 1,
              lastVisit: new Date().toISOString().split("T")[0],
            }
          : null,
      )
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Loyalty Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loyaltyData ? (
            <div className="space-y-4">
              <div className="text-center">
                <Smartphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Scan customer's QR code or enter manually</p>
              </div>

              <Input
                placeholder="Enter loyalty code or phone number"
                value={scannedData}
                onChange={(e) => setScannedData(e.target.value)}
              />

              <Button onClick={() => handleScan(`loyalty:${scannedData}`)} className="w-full" disabled={!scannedData}>
                Look Up Customer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Customer Found!</h3>
                <p className="text-sm text-gray-600">{loyaltyData.clientPhone}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Current Points:</span>
                  <span className="font-semibold">{loyaltyData.points}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Visits:</span>
                  <span className="font-semibold">{loyaltyData.visits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Visit:</span>
                  <span className="font-semibold">{loyaltyData.lastVisit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => addLoyaltyPoints(10)} variant="outline">
                  +10 Points
                </Button>
                <Button onClick={() => addLoyaltyPoints(20)} variant="outline">
                  +20 Points
                </Button>
              </div>

              <Button
                onClick={() => {
                  setLoyaltyData(null)
                  setScannedData("")
                }}
                className="w-full"
              >
                Scan Next Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
