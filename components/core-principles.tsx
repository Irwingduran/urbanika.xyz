import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Leaf,
  Users,
} from "lucide-react"
const CorePrinciplesSection = () => {

    const principles = [
        {
          icon: Users,
          title: "Descentralizado",
          description:
            "Sistemas impulsados por las personas que dan a las comunidades el control sobre su futuro a través de la participación democrática.",
          features: ["Votación Comunitaria", "Gobierno Local", "Redes entre Pares"],
        },
        {
          icon: Bot,
          title: "Autónomo",
          description:
            "IoT, IA y Blockchain automatizando procesos basados en las necesidades humanas y de la naturaleza para una eficiencia óptima.",
          features: ["Infraestructura Inteligente", "Soporte de Decisiones con IA", "Sistemas Automatizados"],
        },
        {
          icon: Leaf,
          title: "Regenerativo",
          description: "Principios de economía circular integrados en el diseño mismo de la ciudad y sus procesos sostenibles.",
          features: ["Cero Residuos", "Energía Renovable", "Enfoque en Biodiversidad"],
        },
      ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Tres Pilares de las Ciudades Inteligentes</h2>
        <p className="mt-2 text-lg text-gray-600">La base de nuestro enfoque de transformación urbana</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {principles.map((principle, index) => (
          <Card
            key={principle.title}
            className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <CardHeader className="text-center">
              <div className="p-4 bg-gradient-to-br from-brand-aqua/10 to-brand-yellow/10 rounded-full mb-4 mx-auto w-fit group-hover:animate-pulse-glow">
                <principle.icon className="h-8 w-8 text-brand-aqua" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-dark">{principle.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">{principle.description}</p>
              <div className="space-y-2">
                {principle.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="mr-2 bg-brand-aqua/10 text-brand-aqua">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  )
}

export default CorePrinciplesSection