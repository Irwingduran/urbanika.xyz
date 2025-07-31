import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  MessageCircle,
  Lightbulb,
} from "lucide-react"

const ContactSection = () => {
  return (
   <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/10 to-brand-yellow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Get In Touch</h2>
            <p className="mt-2 text-lg text-gray-600">Ready to transform your community? Let's talk!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Start Your Journey</h3>
              <p className="text-gray-600 mb-8">
                Whether you're a city official, community leader, or passionate citizen, we're here to help you create
                positive change in your urban environment.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-aqua/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-brand-aqua" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Book a Consultation</h4>
                    <p className="text-gray-600">Free 30-minute strategy session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-yellow/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Join Our Community</h4>
                    <p className="text-gray-600">Connect with like-minded changemakers</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Collaborate</h4>
                    <p className="text-gray-600">Partner with us on innovative projects</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Organization</label>
                    <Input placeholder="Your organization (optional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Message</label>
                    <Textarea placeholder="Tell us about your project or how we can help..." rows={4} />
                  </div>
                  <Button className="w-full bg-brand-aqua text-white hover:bg-teal-600">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection