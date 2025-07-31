"use client";
import React, {useEffect, useState} from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Zap,
  Clock,
  MapPin,
} from "lucide-react"
const BusBooking = () => {
     const [showFullCalendar, setShowFullCalendar] = useState<boolean>(false)

  useEffect(() => {
    
    // Initialize Google Calendar scheduling button
    const initializeCalendarButton = () => {
      if (window.calendar && window.calendar.schedulingButton) {
        const target = document.getElementById("calendar-button-target") as HTMLElement | null
        if (target) {
          window.calendar.schedulingButton.load({
            url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1eTqJ75GqNLJIIQ67GTbpW63vKCdE-fVHL3-LMmDUYTLVUgwsOAfxWk5qy1Fcgq7usQknX_qWi?gv=true",
            color: "#1fa597",
            label: "Schedule your bus visit",
            target,
          })
        }
      }
    }

    // Wait for the script to load
    const checkForCalendar = setInterval(() => {
      if (window.calendar) {
        initializeCalendarButton()
        clearInterval(checkForCalendar)
      }
    }, 100)

    return () => clearInterval(checkForCalendar)
  }, [])

  return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-yellow/10 via-white to-brand-aqua/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-brand-yellow/20 text-brand-dark border-brand-yellow/30">
            🚌 Experience the Future
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Visit The Urbanika's Eco-Tech Bus</h2>
          <p className="mt-2 text-lg text-gray-600">
            Book your exclusive tour of the world's first urban regeneration bus
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-brand-aqua/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-yellow/20 rounded-full">
                      <Calendar className="h-6 w-6 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">Quick Booking</h3>
                      <p className="text-gray-600">Schedule your visit in seconds</p>
                    </div>

                  {/* Google Calendar Button Target */}
                  <div id="calendar-button-target" className="mb-4"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-aqua" />
                      <span>30-45 min tours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-aqua" />
                      <span>Groups up to 8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-aqua" />
                      <span>Multiple locations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-brand-aqua" />
                      <span>Interactive demos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-brand-aqua/20">
                <CardContent className="p-6">
                  <h4 className="font-bold text-brand-dark mb-3">What You'll Experience:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Smart home automation systems
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Renewable energy solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Circular economy demonstrations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Community governance tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Card className="bg-white shadow-2xl overflow-hidden">
                <div className="bg-brand-aqua p-4">
                  <div className="flex items-center justify-between text-white">
                    <h3 className="font-bold">Live Bus Tracker</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Currently in Zacatlán de las Manzanas</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
                    <Image
                      src="/destinations/puebla.jpg"
                      width={400}
                      height={400}
                      alt="Bus location map"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                        <MapPin className="h-8 w-8 text-brand-aqua mx-auto mb-2" />
                        <p className="font-semibold text-brand-dark">Next Stop: Puebla</p>
                        <p className="text-sm text-gray-600">Arriving August 4th </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -bottom-4 -right-4 bg-brand-aqua text-white p-3 rounded-lg shadow-lg">
                <div className="text-lg font-bold">150+</div>
                <div className="text-xs">Visitors this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BusBooking
