import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Target,
  Recycle,
  Instagram,
  Play,
  Banknote,
  HomeIcon
} from "lucide-react"
import Link from "next/link";

const IniciativesSection = () => {  
    const showroomImages = [
        "/home-sales/design1.png",
        "/home-sales/design2.png",
        "/home-sales/design3.png",
        "/home-sales/design4.png",
        "/home-sales/design5.png",
      ]
  return (
    <section id="initiatives" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark">Nuestras Iniciativas Clave</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600">Soluciones pioneras para las ciudades del mañana</p>
        </div>
        
        <Tabs defaultValue="urbanikas-bus" className="w-full">
          {/* TabsList móvil */}
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-6 md:mb-12 gap-1 p-1">
            <TabsTrigger 
              value="urbanikas-bus" 
              className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white py-2 text-sm md:text-base whitespace-normal h-auto"
            >
              Autobús Eco-Tecnológico
            </TabsTrigger>
            <TabsTrigger 
              value="smart-homes-sales" 
              className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white py-2 text-sm md:text-base whitespace-normal h-auto"
            >
              Casas Inteligentes
            </TabsTrigger>
            <TabsTrigger 
              value="eco-marketplace" 
              className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white py-2 text-sm md:text-base whitespace-normal h-auto"
            >
              Eco-Marketplace
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <TabsContent value="urbanikas-bus">
            <Card className="bg-gradient-to-r from-brand-aqua/5 to-transparent border-brand-aqua/20">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6">
                {/* Video thumbnail -  móvil */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[350px] aspect-[2/3]">
                    <Link href="https://www.instagram.com/reel/DMOuEfcx13A/" target="_blank">
                      <div className="relative w-full h-full overflow-hidden rounded-xl">
                        <Image 
                          src="/bus/daninieco.png" 
                          fill
                          alt="daninieco"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Text content */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-aqua">Urbanika es el primer hogar móvil del mundo</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Construido con eco-tecnologías que regeneran en lugar de contaminar: biofiltros, digestores, agricultura circular, sensores inteligentes y más.
                    <br/><br/>
                    Nuestra misión es tener un alto impacto en toda Latinoamérica. Queremos visitar 20 ciudades, 7 países y más. Frente al colapso de las ciudades, nace una alternativa.
                  </p>
                  
                  <div className="space-y-3">
                    {["Soberanía Energética", "Soberanía Hídrica", "Soberanía Alimentaria"].map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-brand-aqua" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      onClick={() => window.open("https://www.instagram.com/reel/DMOuEfcx13A/")} 
                      className="bg-brand-aqua text-white hover:bg-teal-600 text-sm sm:text-base"
                      size="sm"
                    >
                      <Instagram className="mr-2 h-4 w-4" />
                      Ver en Instagram
                    </Button>
                    <Button 
                      onClick={() => window.open("https://www.tiktok.com/@danini.eco/video/7528458965370408199")} 
                      variant="outline" 
                      className="border-brand-aqua text-brand-aqua text-sm sm:text-base"
                      size="sm"
                    >
                      Ver en Tik Tok
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="smart-homes-sales">
            <Card className="bg-gradient-to-r from-brand-yellow/5 to-transparent border-brand-yellow/20">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6">
                {/* Carousel - móvil */}
                <div className="w-full md:w-1/2">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {showroomImages.map((src, i) => (
                        <CarouselItem key={i}>
                          <div className="relative">
                            <Image
                              src={src || "/placeholder.svg"}
                              width={600}
                              height={400}
                              alt={`Urban Showroom ${i + 1}`}
                              className="rounded-lg object-cover aspect-[3/2]"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
                
                {/* Text content */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-aqua">Compra tu casa con Urbánika</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Diseño arquitectónico personalizable, cada casa Urbanika nace de tus decisiones. En nuestro constructor digital eliges
                    módulos: [baño, cocina, sala, dormitorio, etc.] y los combinas a tu gusto en tamaños de 6, 10, 20 o 40 pies.
                    <br/><br/>
                    También decides qué eco-tecnologías incluir y el nivel de entrega (llave en mano o autoinstalación). Cada combinación se registra como un certificado de propiedad en la blockchain de Scroll.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-brand-aqua/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-brand-dark">50+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Prototipos</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-brand-aquea/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-brand-dark">Tour 3D</div>
                      <div className="text-xs sm:text-sm text-gray-600">Próximamente</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      onClick={() => window.open("https://www.urbanika.xyz/investment")} 
                      className="bg-brand-yellow text-white hover:bg-yellow-400 text-sm sm:text-base"
                      size="sm"
                    >
                      <Banknote className="mr-2 h-4 w-4 text-white" />
                      Inversión
                    </Button>
                    <Button 
                      onClick={() => window.open("https://tally.so/r/wzbO9k")} 
                      variant="outline" 
                      className="border-brand-aqua text-brand-aqua text-sm sm:text-base"
                      size="sm"
                    >
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Comprar Casa
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="eco-marketplace">
            <Card className="bg-gradient-to-r from-brand-aqua/5 to-transparent border-brand-aqua/20">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6">
                <div className="w-full md:w-1/2 relative">
                  <Image
                    src="/placeholder.svg?width=600&height=400"
                    width={600}
                    height={400}
                    alt="Eco-tech Directory"
                    className="rounded-lg shadow-2xl w-full aspect-[3/2] object-cover"
                  />
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-brand-aqua text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                    Próximamente
                  </div>
                </div>
                
                {/* Text content */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-aqua">Marketplace/Directiorio de Eco-Tecnologías</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Un mercado integral para eco-tecnologías, conectando comunidades con proveedores de soluciones sostenibles verificadas a nivel mundial.
                  </p>
                  
                  <div className="space-y-3">
                    {["Red Global de Proveedores", "Verificación de Impacto", "Contratos Inteligentes"].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Recycle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => window.open("https://tally.so/r/3qzV4d")} 
                    className="bg-brand-aqua hover:bg-brand-aqua text-sm sm:text-base mt-4"
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Ser Proveedor
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default IniciativesSection
