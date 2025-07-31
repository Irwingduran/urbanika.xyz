"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Puzzle,
  DollarSign,
  Building2,
  Truck,
  Leaf,
  Droplets,
  Zap,
  Coins,
  Recycle,
  Shield,
  TreePine,
  Clock,
  Wrench,
  Gift,
  ArrowRight,
  Users,
  CheckCircle,
} from "lucide-react"

const features = {
  design: {
    id: "design",
    icon: Puzzle,
    title: "Diseño arquitectónico personalizable",
    emoji: "🧩",
    description:
      "Cada casa Urbanika nace de tus decisiones. En nuestro constructor digital eliges módulos (baño, cocina, sala, etc.) y los combinas a tu medida en tamaños de 6, 10, 20 o 40 pies. También decides qué ecotecnias incluir y el nivel de entrega (llave en mano o instalación propia). Con certificado de propiedad en la blockchain de Scroll.",
    cta: "Diseña una casa tan única como tú.",
    category: "Personalización",
    color: "from-gray-600 to-slate-600",
    bgColor: "bg-gary-50",
  },
  affordable: {
    id: "affordable",
    icon: DollarSign,
    title: "Para todos los bolsillos",
    emoji: "💸",
    description:
      "Urbanika trabaja por alianzas con programas gubernamentales, cooperativas y fondos privados para facilitar el acceso a crédito justo y flexible.",
    cta: "Tu nueva casa está más cerca de lo que crees.",
    category: "Accesibilidad",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gray-50",
  },
  modular: {
    id: "modular",
    icon: Building2,
    title: "Modular, expandible y modificable",
    emoji: "🧱",
    description:
      "Empieza con lo esencial. Crece cuando lo necesites. Las casas Urbanika se adaptan a tus cambios: puedes expandir horizontalmente, construir hasta tres niveles o vender módulos de segunda mano en nuestra tienda.",
    cta: "Tu vida cambia. Tu casa también puede hacerlo.",
    category: "Flexibilidad",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gray-50",
  },
  mobile: {
    id: "mobile",
    icon: Truck,
    title: "Móviles y fijas",
    emoji: "🚚",
    description:
      "En caso de emergencia o de cambio de ciudad, tienes el poder de mover tu casa. Con un sistema de remolque opcional (oculto a la vista), puedes convertir tu hogar en un refugio seguro. También puedes elegir que sea completamente fija.",
    cta: "Una casa con superpoderes. Discreta y preparada.",
    category: "Movilidad",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gray-50",
  },
  food: {
    id: "food",
    icon: Leaf,
    title: "Soberanía alimentaria",
    emoji: "🥬",
    description:
      "Producción casera de vegetales, insectos, hongos, peces y más. Con Urbanika cultivas alimentos con nutrientes, control sanitario y amor, directamente desde casa.",
    cta: "Cultiva abundancia desde casa.",
    category: "Sostenibilidad",
    color: "from-green-600 to-lime-500",
    bgColor: "bg-gray-50",
  },
  water: {
    id: "water",
    icon: Droplets,
    title: "Soberanía hídrica",
    emoji: "💧",
    description:
      "No vuelvas a depender de pipas ni de redes inestables. Captamos lluvia, purificamos agua y tratamos residuos. La tecnología ya existe, y está al alcance de tu hogar.",
    cta: "El agua es un derecho, no una incertidumbre.",
    category: "Sostenibilidad",
    color: "from-blue-600 to-teal-500",
    bgColor: "bg-gray-50",
  },
  energy: {
    id: "energy",
    icon: Zap,
    title: "Soberanía energética",
    emoji: "⚡️",
    description:
      "Sol, viento, biomasa y más. Genera tu propia electricidad, produce gas con residuos y únete a redes vecinales de intercambio.",
    cta: "Tu casa siempre conectada y sin posibilidad de apagones.",
    category: "Sostenibilidad",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gray-50",
  },
  income: {
    id: "income",
    icon: Coins,
    title: "Que tu casa te pague",
    emoji: "💰",
    description:
      "Tu casa no solo ahorra: también produce. Sensores, compostas, nodos, colmenas y cargadores inteligentes generan ingresos o recompensas.",
    cta: "Activa el potencial económico de tu vivienda.",
    category: "Economía",
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-gray-50",
  },
  waste: {
    id: "waste",
    icon: Recycle,
    title: "Soberanía en gestión de residuos",
    emoji: "♻️",
    description:
      "Bioconversión, separación, reciclaje, recolección programada. Urbanika transforma tu basura en valor, y comparte contigo parte de la utilidad.",
    cta: "Lo que desechas puede regenerar.",
    category: "Sostenibilidad",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-gray-50",
  },
  automation: {
    id: "automation",
    icon: Shield,
    title: "Automatización local, privada y segura",
    emoji: "🔐",
    description:
      "Tu casa piensa, pero no espía. El sistema corre localmente, sin exponer tu información. Tú tienes el control con una llave privada.",
    cta: "Inteligencia que protege tu privacidad.",
    category: "Tecnología",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-gray-50",
  },
  bioconstruction: {
    id: "bioconstruction",
    icon: TreePine,
    title: "Bioconstruidas",
    emoji: "🌿",
    description:
      "Construidas con materiales naturales, ensambladas en sitio y diseñadas para regular temperatura y humedad de forma pasiva. Hermosas por dentro y por fuera.",
    cta: "Una casa que respira contigo.",
    category: "Construcción",
    color: "from-green-700 to-emerald-600",
    bgColor: "bg-gray-50",
  },
  delivery: {
    id: "delivery",
    icon: Clock,
    title: "120 días para entrega",
    emoji: "🕒",
    description: "Desde que empieza la prefabricación hasta que te mudas, solo necesitas cuatro meses.",
    cta: "Define un terreno, ordena con nosotros y disfruta.",
    category: "Servicio",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-gray-50",
  },
  maintenance: {
    id: "maintenance",
    icon: Wrench,
    title: "Mantenimientos programados",
    emoji: "🛠",
    description:
      "Para preservar tu garantía y rendimiento, programamos visitas de mantenimiento cada 6 meses. Tú decides cuándo, nosotros lo hacemos.",
    cta: "Cuidamos tu casa como si fuera nuestra.",
    category: "Servicio",
    color: "from-gray-600 to-slate-600",
    bgColor: "bg-gray-50",
  },
  rewards: {
    id: "rewards",
    icon: Gift,
    title: "Puntos en la tienda",
    emoji: "🎁",
    description:
      "Por adquirir una casa Urbanika obtienes 1,000 puntos de bienvenida en nuestra tienda, además de acceso exclusivo a promociones, servicios y módulos.",
    cta: "Bienvenido a la comunidad Urbanika.",
    category: "Comunidad",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gray-50",
  },
}

const categories = {
  Personalización: ["design"],
  Accesibilidad: ["affordable"],
  Flexibilidad: ["modular", "mobile"],
  Sostenibilidad: ["food", "water", "energy", "waste"],
  Tecnología: ["automation"],
  Construcción: ["bioconstruction"],
  Economía: ["income"],
  Servicio: ["delivery", "maintenance"],
  Comunidad: ["rewards"],
}

export default function HomeSalesSection() {
  const [activeFeature, setActiveFeature] = useState("design")
  const [activeCategory, setActiveCategory] = useState("Personalización")

  const currentFeature = features[activeFeature]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/5 via-white to-brand-yellow/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">La Casa del Futuro llegó</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre sus ventajas y beneficios en una experiencia completamente personalizable
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {Object.keys(categories).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveCategory(category)
                  setActiveFeature(categories[category][0])
                }}
                className={`${
                  activeCategory === category
                    ? "bg-brand-aqua text-white"
                    : "border-brand-aqua/30 text-brand-aqua bg-transparent hover:bg-brand-aqua/10"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Feature List */}
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {categories[activeCategory].map((featureId) => {
                const feature = features[featureId]
                return (
                  <Card
                    key={featureId}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      activeFeature === featureId
                        ? `${feature.bgColor} border-2 border-brand-aqua shadow-lg`
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveFeature(featureId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} text-white flex-shrink-0`}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{feature.emoji}</span>
                            <h3 className="font-semibold text-brand-dark text-sm leading-tight">{feature.title}</h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                        {activeFeature === featureId && (
                          <CheckCircle className="h-5 w-5 text-brand-aqua flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-2">
            <Card className={`${currentFeature.bgColor} border-2 border-brand-aqua/20 shadow-xl overflow-hidden`}>
              <div className="relative">
                <div className={`h-2 bg-gradient-to-r ${currentFeature.color}`}></div>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{currentFeature.emoji}</span>
                        <div>
                          <Badge className={`bg-gradient-to-r ${currentFeature.color} text-white mb-2`}>
                            {currentFeature.category}
                          </Badge>
                          <h3 className="text-2xl font-bold text-brand-dark">{currentFeature.title}</h3>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6 leading-relaxed">{currentFeature.description}</p>

                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-brand-aqua/20">
                        <div className="flex items-center gap-2 text-brand-aqua font-semibold">
                          <ArrowRight className="h-4 w-4" />
                          <span>{currentFeature.cta}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className={`p-12 rounded-lg bg-gradient-to-br ${currentFeature.color} text-white flex items-center justify-center`}>
                        <currentFeature.icon className="h-24 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>

        {/* Simple Clean Call to Action */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Build Your Sustainable Future
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join the modular housing revolution today
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Waitlist Card */}
              <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-aqua transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 bg-brand-aqua/10 p-3 rounded-full w-fit">
                    <Users className="h-8 w-8 text-brand-aqua" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Join Waitlist</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Be first to know when we're available in your area
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => window.open("https://tally.so/r/wzbO9k")} className="w-full bg-brand-aqua hover:bg-brand-aqua/90 text-white font-medium">
                      Join Waitlist de Urbanika
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* NFT Card */}
              <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-yellow transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 bg-brand-yellow/10 p-3 rounded-full w-fit">
                    <Coins className="h-8 w-8 text-brand-yellow" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Invest in NFTs</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Own a piece of the future housing economy
                  </p>
                  <Button onClick={() => window.open("https://urbanika.xyz/investment")} className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-gray-900 font-medium">
                    View NFT Collection
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🌱 500+ families on waitlist • 🏠 First deliveries Q2 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}