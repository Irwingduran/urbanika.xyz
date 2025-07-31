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
    <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Oferta educativa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforma tu comunidad con conocimientos prácticos en regeneración ambiental, tecnología y democracia
            participativa
          </p>
        </div>

        {/* Learning Paths Overview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-brand-dark text-center mb-8">Rutas de Aprendizaje Recomendadas</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {path.axes.map((axisId, i) => {
                      const axis = educationalAxes[axisId]
                      const IconComponent = axis.icon
                      return (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center -ml-2 first:ml-0 border-2 border-white bg-gradient-to-r ${axis.color}`}
                        >
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                      )
                    })}
                  </div>
                  <h4 className="font-bold text-brand-dark mb-2">{path.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>{path.duration}</span>
                    <Badge className={getLevelColor(path.level)} size="sm">
                      {path.level}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="group-hover:bg-brand-aqua group-hover:text-white bg-transparent"
                  >
                    Ver ruta completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Axis Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Object.values(educationalAxes).map((axis) => (
            <Card
              key={axis.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                activeAxis === axis.id
                  ? `${axis.bgColor} border-2 border-brand-aqua shadow-lg scale-105`
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveAxis(axis.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`p-4 bg-gradient-to-r ${axis.color} rounded-full mb-4 mx-auto w-fit`}>
                  <axis.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{axis.emoji}</span>
                  <CardTitle className="text-xl font-bold text-brand-dark">{axis.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{axis.description}</p>
                {activeAxis === axis.id && (
                  <div className="mt-4 flex justify-center">
                    <CheckCircle className="h-6 w-6 text-brand-aqua" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Axis View */}
        <Card className={`${currentAxis.bgColor} border-2 border-brand-aqua/20 shadow-2xl mb-12`}>
          <div className="relative">
            <div className={`h-2 bg-gradient-to-r ${currentAxis.color}`}></div>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Axis Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentAxis.emoji}</span>
                    <div>
                      <h3 className="text-3xl font-bold text-brand-dark mb-2">{currentAxis.title}</h3>
                      <Badge className={`bg-gradient-to-r ${currentAxis.color} text-white`}>Eje Educativo</Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{currentAxis.description}</p>

                  <div className="mb-6">
                    <h4 className="font-bold text-brand-dark mb-3">Habilidades que desarrollarás:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAxis.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/80">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-brand-dark mb-3">Resultados esperados:</h4>
                    <div className="space-y-2">
                      {currentAxis.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="lg:col-span-2">
                  <h4 className="font-bold text-brand-dark mb-6 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-brand-aqua" />
                    Módulos de aprendizaje
                  </h4>
                  <div className="grid gap-4">
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
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${currentAxis.color} text-white font-bold`}
                                >
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-brand-dark">{module.name}</h5>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
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
                                className={
                                  isEnrolled
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-brand-aqua text-white hover:bg-teal-600"
                                }
                              >
                                {isEnrolled ? (
                                  <>
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Inscrito
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-1 h-4 w-4" />
                                    Inscribirse
                                  </>
                                )}
                              </Button>
                            </div>

                            {isEnrolled && module.progress > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progreso</span>
                                  <span>{module.progress}%</span>
                                </div>
                                <Progress value={module.progress} className="h-2" />
                              </div>
                            )}

                            {selectedModule === index && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h6 className="font-semibold text-brand-dark mb-2">Temas incluidos:</h6>
                                <div className="grid grid-cols-2 gap-2">
                                  {module.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                                      <span className="text-sm text-gray-700">{topic}</span>
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
              <div className="mt-12 text-center">
                <Card className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-brand-aqua/30">
                  <CardContent className="p-8">
                    <Target className="h-12 w-12 text-brand-aqua mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-brand-dark mb-4">
                      🎯 Lleva a tu comunidad al siguiente nivel.
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Revisa la oferta educativa disponible y solicita una cotización dando clic en el botón de abajo.
                    </p>
                    <Button
                      onClick={() => setShowQuoteForm(true)}
                      className="bg-brand-aqua text-white hover:bg-teal-600 text-lg px-8 py-4"
                    >
                      👇 Cotizar ahora
                      <ArrowRight className="ml-2 h-5 w-5" />
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
