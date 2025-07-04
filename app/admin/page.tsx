"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Phone, Scissors, TrendingUp, DollarSign } from "lucide-react"
import { ReminderScheduler, type ScheduledReminder } from "@/lib/reminder-scheduler"
import { SMSService } from "@/lib/sms-service"

interface Order {
  id: string
  clientName: string
  clientPhone: string
  hairstyle: string
  date: string
  time: string
  price: number
  status: "pending" | "in-progress" | "completed" | "cancelled"
  paymentMethod: "ozow" | "cash"
  loyaltyPoints: number
}

interface ClientStats {
  name: string
  phone: string
  visits: number
  totalSpent: number
  lastVisit: string
  loyaltyPoints: number
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    clientName: "John Doe",
    clientPhone: "0821234567",
    hairstyle: "Fade Cut",
    date: "2024-01-15",
    time: "09:00",
    price: 200,
    status: "pending",
    paymentMethod: "ozow",
    loyaltyPoints: 20,
  },
  {
    id: "2",
    clientName: "Jane Smith",
    clientPhone: "0827654321",
    hairstyle: "Basic Cut",
    date: "2024-01-15",
    time: "10:30",
    price: 150,
    status: "in-progress",
    paymentMethod: "cash",
    loyaltyPoints: 15,
  },
  {
    id: "3",
    clientName: "Mike Johnson",
    clientPhone: "0823456789",
    hairstyle: "Full Service",
    date: "2024-01-15",
    time: "11:00",
    price: 280,
    status: "completed",
    paymentMethod: "ozow",
    loyaltyPoints: 28,
  },
]

const MOCK_CLIENTS: ClientStats[] = [
  {
    name: "John Doe",
    phone: "0821234567",
    visits: 12,
    totalSpent: 2400,
    lastVisit: "2024-01-10",
    loyaltyPoints: 240,
  },
  {
    name: "Jane Smith",
    phone: "0827654321",
    visits: 8,
    totalSpent: 1200,
    lastVisit: "2024-01-08",
    loyaltyPoints: 120,
  },
]

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [clients] = useState<ClientStats[]>(MOCK_CLIENTS)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [reminders, setReminders] = useState<ScheduledReminder[]>([])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const loadReminders = () => {
    setReminders(ReminderScheduler.getAllReminders())
  }

  const sendManualReminder = async (order: Order) => {
    try {
      await SMSService.sendAppointmentReminder(
        order.clientPhone,
        order.id,
        order.clientName,
        order.time,
        order.hairstyle,
      )
      alert("Reminder sent successfully!")
    } catch (error) {
      alert("Failed to send reminder")
    }
  }

  const todaysOrders = orders.filter((order) => order.date === selectedDate)
  const totalRevenue = todaysOrders.reduce((sum, order) => (order.status === "completed" ? sum + order.price : sum), 0)
  const completedOrders = todaysOrders.filter((order) => order.status === "completed").length

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Salon Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and track your business</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Today's Orders</TabsTrigger>
            <TabsTrigger value="clients">Client Database</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="sms">SMS Management</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R{totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">From {completedOrders} completed appointments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todaysOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Scheduled for today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todaysOrders.length > 0 ? Math.round((completedOrders / todaysOrders.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Orders completed today</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="font-semibold">{order.clientName}</span>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.clientPhone}
                            </span>
                            <span className="flex items-center">
                              <Scissors className="h-3 w-3 mr-1" />
                              {order.hairstyle}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {order.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-bold">R{order.price}</span>
                        <div className="flex space-x-2">
                          {order.status === "pending" && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, "in-progress")}>
                              Start
                            </Button>
                          )}
                          {order.status === "in-progress" && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                              Complete
                            </Button>
                          )}
                          {order.status !== "cancelled" && order.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Database</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{client.name}</div>
                          <div className="text-sm text-gray-600">{client.phone}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">{client.visits} visits</div>
                        <div className="text-sm text-gray-600">R{client.totalSpent} total</div>
                        <div className="text-sm text-blue-600">{client.loyaltyPoints} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R12,450</div>
                  <p className="text-sm text-green-600">+15% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fade Cut</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basic Cut</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Service</span>
                    <span className="font-semibold">25%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2,340</div>
                    <div className="text-sm text-gray-600">Points Redeemed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">R890</div>
                    <div className="text-sm text-gray-600">Rewards Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">SMS Management</h2>
              <Button onClick={loadReminders} variant="outline">
                Refresh Reminders
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SMS Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sent Today:</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scheduled:</span>
                      <span className="font-semibold">{reminders.filter((r) => r.status === "scheduled").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed:</span>
                      <span className="font-semibold text-red-600">
                        {reminders.filter((r) => r.status === "failed").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-transparent" variant="outline">
                    Send Bulk Reminder
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    SMS Templates
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    SMS History
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reminders
                      .filter((r) => r.status === "scheduled")
                      .slice(0, 3)
                      .map((reminder) => (
                        <div key={reminder.id} className="text-sm">
                          <div className="font-semibold">{reminder.clientName}</div>
                          <div className="text-gray-600">
                            {reminder.reminderTime.toLocaleTimeString("en-ZA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manual SMS Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{order.clientName}</div>
                          <div className="text-sm text-gray-600">{order.clientPhone}</div>
                          <div className="text-sm text-gray-600">
                            {order.time} - {order.hairstyle}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => sendManualReminder(order)}>
                          Send Reminder
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await SMSService.sendCancellationNotice(
                                order.clientPhone,
                                order.id,
                                order.clientName,
                                order.date,
                                order.time,
                              )
                              alert("Cancellation notice sent!")
                            } catch (error) {
                              alert("Failed to send cancellation notice")
                            }
                          }}
                        >
                          Send Cancellation
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
