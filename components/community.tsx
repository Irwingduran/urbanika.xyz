import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  MessageCircle,
  Lightbulb,
} from "lucide-react"

const CommunitySection = () => {
  return (
      <section id="community" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Únete a Nuestra Comunidad</h2>
          <p className="mt-2 text-lg text-gray-600">Conéctate con agentes de cambio alrededor del mundo</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 
          <Card className="bg-gradient-to-br from-blue-50 to-brand-aqua/10 border-brand-aqua/20 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-brand-aqua mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Comunidad de Telegram</h3>
              <p className="text-gray-600 mb-4">Únete a más de 5K miembros discutiendo innovación urbana</p>
              <Button className="bg-brand-aqua text-white hover:bg-teal-600">Unirse a Telegram</Button>
            </CardContent>
          </Card>
           */}

          <Card className="bg-gradient-to-br from-yellow-50 to-brand-yellow/10 border-brand-yellow/20 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-brand-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Encuentros Mensuales</h3>
              <p className="text-gray-600 mb-4">Eventos virtuales y presenciales en todo el mundo</p>
            </CardContent>
          </Card> 

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Laboratorio de Innovación</h3>
              <p className="text-gray-600 mb-4">Colabora en proyectos de vanguardia</p>
            </CardContent>
          </Card>

           <Card className="bg-gradient-to-br from-blue-50 to-brand-aqua/10 border-brand-aqua/20 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-brand-aqua mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Comunidad</h3>
              <p className="text-gray-600 mb-4">Únete a nuestros miembros discutiendo innovación urbana</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection