"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Leaf,
  Bot,
  Vote,
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

const educationalAxes = {
  environmental: {
    id: "environmental",
    icon: Leaf,
    title: "Regeneración ambiental",
    emoji: "🌱",
    description:
      "Aprende a lograr soberanía alimentaria, hídrica, energética, y de gestión de residuos desde tu casa, escuela o comunidad. Desde biofiltros purificadores a compostaje con insectos, captación de lluvia y bioconversión de residuos. Exploramos soluciones reales.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    modules: [
      {
        name: "Soberanía Alimentaria",
        duration: "4 semanas",
        level: "Principiante",
        topics: ["Huertos urbanos", "Permacultura", "Compostaje", "Semillas criollas"],
        progress: 0,
      },
      {
        name: "Gestión Hídrica",
        duration: "3 semanas",
        level: "Intermedio",
        topics: ["Captación de lluvia", "Biofiltros", "Tratamiento de aguas", "Riego eficiente"],
        progress: 0,
      },
      {
        name: "Energías Renovables",
        duration: "5 semanas",
        level: "Intermedio",
        topics: ["Paneles solares", "Biogas", "Eólica doméstica", "Eficiencia energética"],
        progress: 0,
      },
      {
        name: "Gestión de Residuos",
        duration: "3 semanas",
        level: "Principiante",
        topics: ["Compostaje con insectos", "Bioconversión", "Reciclaje", "Economía circular"],
        progress: 0,
      },
    ],
    skills: ["Sostenibilidad", "Autosuficiencia", "Diseño ecológico", "Innovación verde"],
    outcomes: ["Reducir huella ecológica 60%", "Autonomía alimentaria 80%", "Ahorro energético 50%"],
  },
  technology: {
    id: "technology",
    icon: Bot,
    title: "Tecnología que potencia",
    emoji: "🤖",
    description:
      "Exploramos cómo la inteligencia artificial puede asistirte en investigación, diseño de prototipos y automatización de tareas. También enseñamos a usar sensores IoT, realidad virtual/aumentada y datos en tiempo real para mejorar procesos educativos, ambientales y productivos. Nuestra formación combina herramientas abiertas y comerciales, siempre con un enfoque claro en privacidad, derechos digitales y soberanía tecnológica.",
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50",
    modules: [
      {
        name: "Inteligencia Artificial Práctica",
        duration: "6 semanas",
        level: "Intermedio",
        topics: ["Machine Learning", "Automatización", "Análisis de datos", "Ética en IA"],
        progress: 0,
      },
      {
        name: "Internet de las Cosas (IoT)",
        duration: "4 semanas",
        level: "Principiante",
        topics: ["Sensores", "Arduino/Raspberry Pi", "Conectividad", "Monitoreo ambiental"],
        progress: 0,
      },
      {
        name: "Realidad Virtual/Aumentada",
        duration: "5 semanas",
        level: "Avanzado",
        topics: ["Desarrollo VR/AR", "Experiencias inmersivas", "Educación virtual", "Prototipado"],
        progress: 0,
      },
      {
        name: "Soberanía Tecnológica",
        duration: "3 semanas",
        level: "Intermedio",
        topics: ["Privacidad digital", "Software libre", "Derechos digitales", "Seguridad"],
        progress: 0,
      },
    ],
    skills: ["Programación", "Análisis de datos", "Innovación digital", "Pensamiento crítico"],
    outcomes: ["Automatización 70% tareas", "Eficiencia productiva +40%", "Competencias digitales"],
  },
  democracy: {
    id: "democracy",
    icon: Vote,
    title: "Democracia participativa",
    emoji: "🗳",
    description:
      "No basta con tener soluciones, también hay que organizarlas colectivamente. Facilitamos experiencias de gobernanza entre iguales, presupuestos participativos, herramientas digitales y metodologías para tomar decisiones en común.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    modules: [
      {
        name: "Facilitación de Grupos",
        duration: "4 semanas",
        level: "Principiante",
        topics: ["Dinámicas grupales", "Resolución de conflictos", "Comunicación asertiva", "Liderazgo"],
        progress: 0,
      },
      {
        name: "Presupuestos Participativos",
        duration: "5 semanas",
        level: "Intermedio",
        topics: ["Metodologías", "Herramientas digitales", "Evaluación de proyectos", "Transparencia"],
        progress: 0,
      },
      {
        name: "Gobernanza Digital",
        duration: "6 semanas",
        level: "Avanzado",
        topics: ["Plataformas participativas", "Blockchain", "Votación electrónica", "Identidad digital"],
        progress: 0,
      },
      {
        name: "Organización Comunitaria",
        duration: "4 semanas",
        level: "Principiante",
        topics: ["Mapeo de actores", "Construcción de consensos", "Movilización social", "Redes"],
        progress: 0,
      },
    ],
    skills: ["Liderazgo", "Facilitación", "Negociación", "Pensamiento sistémico"],
    outcomes: ["Participación +200%", "Consensos efectivos 90%", "Proyectos comunitarios exitosos"],
  },
}

const learningPaths = [
  {
    name: "Activista Ambiental",
    axes: ["environmental", "democracy"],
    duration: "12 semanas",
    level: "Principiante",
    description: "Combina conocimientos ecológicos con habilidades organizativas",
  },
  {
    name: "Innovador Tecnológico",
    axes: ["technology", "environmental"],
    duration: "16 semanas",
    level: "Intermedio",
    description: "Desarrolla soluciones tech para problemas ambientales",
  },
  {
    name: "Líder Comunitario Digital",
    axes: ["democracy", "technology"],
    duration: "14 semanas",
    level: "Intermedio",
    description: "Lidera procesos participativos con herramientas digitales",
  },
  {
    name: "Regenerador Integral",
    axes: ["environmental", "technology", "democracy"],
    duration: "24 semanas",
    level: "Avanzado",
    description: "Domina los tres ejes para transformación completa",
  },
]

export default function EducationalOfferingSection() {
  const [activeAxis, setActiveAxis] = useState("environmental")
  const [selectedModule, setSelectedModule] = useState(null)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [enrolledModules, setEnrolledModules] = useState(new Set())

  const currentAxis = educationalAxes[activeAxis]

  const handleModuleEnroll = (moduleIndex) => {
    const newEnrolled = new Set(enrolledModules)
    const moduleKey = `${activeAxis}-${moduleIndex}`

    if (newEnrolled.has(moduleKey)) {
      newEnrolled.delete(moduleKey)
    } else {
      newEnrolled.add(moduleKey)
      // Simulate progress
      setTimeout(() => {
        const updatedAxis = { ...educationalAxes[activeAxis] }
        updatedAxis.modules[moduleIndex].progress = Math.floor(Math.random() * 100)
        educationalAxes[activeAxis] = updatedAxis
      }, 1000)
    }
    setEnrolledModules(newEnrolled)
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Principiante":
        return "bg-green-100 text-green-700"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-700"
      case "Avanzado":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-3 md:mb-4">
            Oferta educativa
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforma tu comunidad con conocimientos prácticos en regeneración ambiental, tecnología y democracia
            participativa
          </p>
        </div>

        {/* Learning Paths Overview */}
        <div className="mb-8 md:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-dark text-center mb-6 md:mb-8">
            Rutas de Aprendizaje Recomendadas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {learningPaths.map((path, index) => (
              <Card 
                key={index} 
                className="bg-white shadow-lg hover:shadow-xl transition-all group cursor-pointer h-full"
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="flex justify-center mb-3 md:mb-4">
                    {path.axes.map((axisId, i) => {
                      const axis = educationalAxes[axisId]
                      const IconComponent = axis.icon
                      return (
                        <div
                          key={i}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center -ml-2 first:ml-0 border-2 border-white bg-gradient-to-r ${axis.color}`}
                        >
                          <IconComponent className="h-3 w-3 md:h-4 md:w-4 text-white" />
                        </div>
                      )
                    })}
                  </div>
                  <h4 className="font-bold text-brand-dark mb-1 md:mb-2 text-sm md:text-base">{path.name}</h4>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">{path.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-2 md:mb-3">
                    <span>{path.duration}</span>
                    <Badge className={getLevelColor(path.level)} size="sm">
                      {path.level}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="group-hover:bg-brand-aqua group-hover:text-white bg-transparent text-xs md:text-sm"
                  >
                    Ver ruta completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Axis Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {Object.values(educationalAxes).map((axis) => (
            <Card
              key={axis.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                activeAxis === axis.id
                  ? `${axis.bgColor} border-2 border-brand-aqua shadow-lg scale-[1.02]`
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveAxis(axis.id)}
            >
              <CardHeader className="text-center pb-2 md:pb-4">
                <div className={`p-3 md:p-4 bg-gradient-to-r ${axis.color} rounded-full mb-3 md:mb-4 mx-auto w-fit`}>
                  <axis.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
                  <span className="text-xl md:text-2xl">{axis.emoji}</span>
                  <CardTitle className="text-lg md:text-xl font-bold text-brand-dark">
                    {axis.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center px-4 pb-4">
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-4">
                  {axis.description}
                </p>
                {activeAxis === axis.id && (
                  <div className="mt-2 md:mt-4 flex justify-center">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-brand-aqua" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Axis View */}
        <Card className={`${currentAxis.bgColor} border-2 border-brand-aqua/20 shadow-xl md:shadow-2xl mb-8 md:mb-12`}>
          <div className="relative">
            <div className={`h-2 bg-gradient-to-r ${currentAxis.color}`}></div>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                {/* Axis Info */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <span className="text-3xl md:text-4xl">{currentAxis.emoji}</span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-1 md:mb-2">
                        {currentAxis.title}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${currentAxis.color} text-white text-xs md:text-sm`}>
                        Eje Educativo
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    {currentAxis.description}
                  </p>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-bold text-brand-dark mb-2 md:mb-3 text-sm md:text-base">
                      Habilidades que desarrollarás:
                    </h4>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {currentAxis.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/80 text-xs md:text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h4 className="font-bold text-brand-dark mb-2 md:mb-3 text-sm md:text-base">
                      Resultados esperados:
                    </h4>
                    <div className="space-y-1 md:space-y-2">
                      {currentAxis.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-xs md:text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="lg:w-2/3">
                  <h4 className="font-bold text-brand-dark mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-brand-aqua" />
                    Módulos de aprendizaje
                  </h4>
                  <div className="grid gap-3 md:gap-4">
                    {currentAxis.modules.map((module, index) => {
                      const moduleKey = `${activeAxis}-${index}`
                      const isEnrolled = enrolledModules.has(moduleKey)
                      return (
                        <Card
                          key={index}
                          className={`transition-all hover:shadow-lg cursor-pointer ${
                            isEnrolled ? "bg-white border-brand-aqua" : "bg-white/80"
                          }`}
                          onClick={() => setSelectedModule(selectedModule === index ? null : index)}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 md:mb-4">
                              <div className="flex items-center gap-2 md:gap-3">
                                <div
                                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${currentAxis.color} text-white font-bold text-sm md:text-base`}
                                >
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-brand-dark text-sm md:text-base">{module.name}</h5>
                                  <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-600">
                                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                                    <span>{module.duration}</span>
                                    <Badge className={getLevelColor(module.level)} size="sm">
                                      {module.level}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleModuleEnroll(index)
                                }}
                                className={`text-xs md:text-sm ${
                                  isEnrolled
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-brand-aqua text-white hover:bg-teal-600"
                                }`}
                              >
                                {isEnrolled ? (
                                  <>
                                    <CheckCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                    Inscrito
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                    Inscribirse
                                  </>
                                )}
                              </Button>
                            </div>

                            {isEnrolled && module.progress > 0 && (
                              <div className="mb-3 md:mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progreso</span>
                                  <span>{module.progress}%</span>
                                </div>
                                <Progress value={module.progress} className="h-2" />
                              </div>
                            )}

                            {selectedModule === index && (
                              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                                <h6 className="font-semibold text-brand-dark mb-2 text-sm">Temas incluidos:</h6>
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 md:gap-2">
                                  {module.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="flex items-center gap-1 md:gap-2">
                                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-aqua rounded-full"></div>
                                      <span className="text-xs md:text-sm text-gray-700">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 md:mt-12 text-center">
                <Card className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-brand-aqua/30">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <Target className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-brand-aqua mx-auto mb-2 sm:mb-4" />
                    <h4 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2 sm:mb-4">
                      🎯 Lleva a tu comunidad al siguiente nivel.
                    </h4>
                    <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                      Revisa la oferta educativa disponible y solicita una cotización dando clic en el botón de abajo.
                    </p>
                    <Button
                      onClick={() => setShowQuoteForm(true)}
                      className="bg-brand-aqua text-white hover:bg-teal-600 text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
                    >
                      👇 Cotizar ahora
                      <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}
