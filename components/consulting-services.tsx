"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Leaf,
  Bot,
  Vote,
  Calendar,
  CheckCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Phone,
  Clock,
  Star,
  Building,
  Briefcase,
  Rocket,
} from "lucide-react"

const consultingServices = {
  environmental: {
    id: "environmental",
    icon: Leaf,
    title: "Regeneración ambiental",
    emoji: "🌱",
    description:
      "Diseñamos estrategias y tecnologías para lograr soberanía hídrica, alimentaria, energética y de residuos en contextos urbanos, rurales o turísticos.",
    details:
      "Desde bioinfraestructura hasta análisis de ciclo de vida, ayudamos a que tus desarrollos sean verdaderamente sostenibles y resilientes.",
    services: [
      "Soberanía hídrica y gestión de agua",
      "Sistemas de producción alimentaria",
      "Energías renovables y eficiencia",
      "Gestión circular de residuos",
      "Bioinfraestructura y construcción sostenible",
      "Análisis de ciclo de vida (LCA)",
    ],
    outcomes: ["Reducción 60% huella de carbono", "Autonomía energética 85%", "Zero waste certificado"],
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    clients: ["Gobiernos locales", "Desarrolladores inmobiliarios", "Empresas turísticas"],
  },
  technology: {
    id: "technology",
    icon: Bot,
    title: "Tecnología que potencia",
    emoji: "🤖",
    description:
      "Asesoramos en la integración de inteligencia artificial, IoT, blockchain y RV/RM para automatizar procesos, generar datos estratégicos y aumentar capacidades operativas.",
    details: "Evaluamos soluciones abiertas y comerciales, con criterios de privacidad, eficiencia y escalabilidad.",
    services: [
      "Inteligencia artificial y machine learning",
      "Internet de las cosas (IoT) y sensores",
      "Blockchain y contratos inteligentes",
      "Realidad virtual y aumentada",
      "Automatización de procesos",
      "Análisis de datos y business intelligence",
    ],
    outcomes: ["Eficiencia operativa +40%", "Reducción costos 30%", "ROI en 18 meses"],
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50",
    clients: ["Startups tecnológicas", "Empresas manufactureras", "Instituciones financieras"],
  },
  democracy: {
    id: "democracy",
    icon: Vote,
    title: "Democracia participativa",
    emoji: "🗳",
    description:
      "Te ofrecemos plataformas de participación ciudadana comerciales o co-diseñamos una contigo, nos enfocamos en presupuestos participativos, identidad digital anti-fraudes, y automatización de procesos tanto internos como de recopilación y procesamiento de denuncias ciudadanas.",
    details:
      "Aplicamos metodologías ágiles y tecnologías digitales para activar la inteligencia colectiva y la corresponsabilidad social.",
    services: [
      "Plataformas de participación ciudadana",
      "Presupuestos participativos",
      "Identidad digital segura",
      "Sistemas de votación electrónica",
      "Procesamiento de denuncias ciudadanas",
      "Metodologías de co-diseño",
    ],
    outcomes: ["Participación ciudadana +200%", "Transparencia 95%", "Satisfacción 4.8/5"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    clients: ["Gobiernos municipales", "ONGs", "Organizaciones comunitarias"],
  },
}

const consultants = [
  {
    name: "Humberto Besso",
    role: "Director de Estrategia",
    specialty: "Blockchain & Governance",
    experience: "10+ años",
    image: "/placeholder-user.jpg?1",
    expertise: ["Blockchain", "eGovernance", "Smart Cities"],
  },
  {
    name: "Alejandra Verde",
    role: "Directora de Sostenibilidad",
    specialty: "Environmental Systems",
    experience: "8+ años",
    image: "/placeholder-user.jpg?2",
    expertise: ["Sustainability", "Environmental Risk", "Circular Economy"],
  },
  {
    name: "Irwing Duran",
    role: "Director de Tecnología",
    specialty: "Full-stack & Web3",
    experience: "12+ años",
    image: "/placeholder-user.jpg?3",
    expertise: ["Web3", "AI/ML", "IoT Systems"],
  },
]

const testimonials = [
  {
    quote:
      "Urbanika transformó completamente nuestra visión de sostenibilidad urbana. Su enfoque integral nos ayudó a reducir costos y aumentar el impacto.",
    author: "María González",
    role: "Directora de Desarrollo Urbano",
    company: "Gobierno de Guadalajara",
    rating: 5,
  },
  {
    quote:
      "La implementación de su plataforma de participación ciudadana aumentó la participación en un 300%. Excelente trabajo técnico y metodológico.",
    author: "Carlos Mendoza",
    role: "Alcalde",
    company: "Municipio de Querétaro",
    rating: 5,
  },
  {
    quote:
      "Su consultoría en tecnologías emergentes nos posicionó como líderes en innovación. ROI excepcional y equipo altamente profesional.",
    author: "Ana Ruiz",
    role: "CEO",
    company: "TechSolutions México",
    rating: 5,
  },
]

export default function ConsultingServicesSection() {
  const [activeService, setActiveService] = useState("environmental")
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const currentService = consultingServices[activeService]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
      
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Servicios de consultoría para transformar con impacto
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Acompañamos a empresas, gobiernos y emprendimientos que buscan integrar soluciones regenerativas,
            tecnologías emergentes y modelos participativos en sus proyectos. Nuestro enfoque combina conocimiento
            técnico, experiencia territorial y visión sistémica.
          </p>
        </div>

        {/* Services Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {Object.values(consultingServices).map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                activeService === service.id
                  ? `${service.bgColor} border-2 border-brand-aqua shadow-lg scale-105`
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveService(service.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`p-4 bg-gradient-to-r ${service.color} rounded-full mb-4 mx-auto w-fit`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{service.emoji}</span>
                  <CardTitle className="text-xl font-bold text-brand-dark">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                {activeService === service.id && (
                  <div className="mt-4 flex justify-center">
                    <CheckCircle className="h-6 w-6 text-brand-aqua" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Service View */}
        <Card className={`${currentService.bgColor} border-2 border-brand-aqua/20 shadow-2xl mb-16`}>
          <div className="relative">
            <div className={`h-2 bg-gradient-to-r ${currentService.color}`}></div>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentService.emoji}</span>
                    <div>
                      <h3 className="text-3xl font-bold text-brand-dark mb-2">{currentService.title}</h3>
                      <Badge className={`bg-gradient-to-r ${currentService.color} text-white`}>
                        Consultoría Especializada
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">{currentService.description}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{currentService.details}</p>

                  <div className="mb-6">
                    <h4 className="font-bold text-brand-dark mb-3">Servicios incluidos:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {currentService.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-brand-aqua flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-brand-dark mb-3">Resultados típicos:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {currentService.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm font-medium">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-brand-aqua" />
                        Clientes típicos
                      </h4>
                      <div className="space-y-2">
                        {currentService.clients.map((client, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-brand-aqua" />
                            <span className="text-gray-700 text-sm">{client}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-aqua" />
                        Proceso de trabajo
                      </h4>
                      <div className="space-y-3">
                        {[
                          "Diagnóstico inicial",
                          "Diseño de estrategia",
                          "Implementación",
                          "Seguimiento y optimización",
                        ].map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-brand-aqua text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-gray-700 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-brand-aqua text-white hover:bg-teal-600 text-lg py-6"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Agenda una consulta gratuita
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

      </div>
    </section>
  )
}
