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
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Contáctanos</h2>
            <p className="mt-2 text-lg text-gray-600">¿Listo para transformar tu comunidad? ¡Hablemos!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Comienza tu viaje</h3>
              <p className="text-gray-600 mb-8">
                Ya seas un funcionario municipal, líder comunitario o ciudadano apasionado, estamos aquí para ayudarte a crear
                un cambio positivo en tu entorno urbano.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-aqua/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-brand-aqua" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Reserva una consulta</h4>
                    <p className="text-gray-600">Sesión estratégica gratuita de 30 minutos</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-yellow/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Únete a nuestra comunidad</h4>
                    <p className="text-gray-600">Conéctate con agentes de cambio afines</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Colabora</h4>
                    <p className="text-gray-600">Asóciate con nosotros en proyectos innovadores</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Nombre</label>
                      <Input placeholder="Juan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Apellido</label>
                      <Input placeholder="Pérez" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Correo electrónico</label>
                    <Input type="email" placeholder="juan@ejemplo.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Organización</label>
                    <Input placeholder="Tu organización (opcional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Mensaje</label>
                    <Textarea placeholder="Cuéntanos sobre tu proyecto o cómo podemos ayudarte..." rows={4} />
                  </div>
                  <Button className="w-full bg-brand-aqua text-white hover:bg-teal-600">Enviar mensaje</Button>
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