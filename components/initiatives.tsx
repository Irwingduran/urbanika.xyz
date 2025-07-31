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
    <section id="initiatives" className="py-16 md:py-24 sm:py-26 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
     <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Nuestras Iniciativas Clave</h2>
     <p className="mt-2 text-lg text-gray-600">Soluciones pioneras para las ciudades del mañana</p>

      </div>
      <Tabs defaultValue="urbanikas-bus" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8 sm:mb-20">
          <TabsTrigger value="urbanikas-bus" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
            Autobús Eco-Tecnológico de Urbanika
          </TabsTrigger>
          <TabsTrigger value="smart-homes-sales" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
            Venta de Casas Inteligentes
          </TabsTrigger>
          <TabsTrigger value="eco-marketplace" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
            Eco-Marketplace
          </TabsTrigger>
        </TabsList> 

    <TabsContent value="urbanikas-bus">
     <Card className="bg-gradient-to-r from-brand-aqua/5 to-transparent border-brand-aqua/20">
    <div className="grid md:grid-cols-2 gap-8 items-center p-6">
      <div className="space-y-4">
        <div className="relative w-full max-w-[350px] mx-auto aspect-[2/3]"> {/* Contenedor más pequeño */}
          <Link href="https://www.instagram.com/reel/DMOuEfcx13A/" target="_blank">
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              <Image 
                src="/bus/daninieco.png" 
                width={300}  
                height={450} 
                alt="daninieco"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play className="h-12 w-12 text-white drop-shadow-lg" /> {/* Icono más pequeño */}
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-brand-aqua mb-2">Urbanika es el primer hogar móvil del mundo</h3>
        <p className="mb-6 sm:mb-1">
        Construido con eco-tecnologías que regeneran en lugar de contaminar: biofiltros, digestores, agricultura circular, sensores inteligentes y más.
       <br/>
        Nuestra misión es tener un alto impacto en toda Latinoamérica. Queremos visitar 20 ciudades,
        7 países y más. Frente al colapso de las ciudades, nace una alternativa.
      </p>
 
        <div className="space-y-3 mb-6 sm:mb-3">
          {["Soberanía Energética", "Soberanía Hídrica", "Soberanía Alimentaria"].map((feature) => (
            <div key={feature} className="flex items-center gap-5">
              <Target className="h-4 w-4 text-brand-aqua" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={() => window.open("https://www.instagram.com/reel/DMOuEfcx13A/")} className="bg-brand-aqua text-white hover:bg-teal-600">
            <Instagram className="mr-2 h-4 w-4" />
            Ver en Instagram
          </Button>
          <Button onClick={() => window.open("https://www.tiktok.com/@danini.eco/video/7528458965370408199")} variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
             Ver en Tik Tok
          </Button>
        </div>
      </div>
    </div>
    </Card> 
    </TabsContent>

        <TabsContent value="smart-homes-sales">
          <Card className="bg-gradient-to-r from-brand-yellow/5 to-transparent border-brand-yellow/20">
            <div className="grid md:grid-cols-2 gap-8 items-center p-6">
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
              <div>
                <h3 className="text-3xl font-bold text-brand-aqua mb-4">Compra tu casa con Urbánika</h3>
                <p className="mb-6">
               Diseño arquitectónico personalizable, cada casa Urbanika nace de tus decisiones. En nuestro constructor digital eliges
               módulos: [baño, cocina, sala, dormitorio, etc.] y los combinas a tu gusto en tamaños de 6, 10, 20 o 40 pies.
              <br/>
              También decides qué eco-tecnologías incluir y el nivel de entrega (llave en mano o autoinstalación). Cada combinación se registra como un certificado de propiedad en la blockchain de Scroll.
               </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-brand-aqua/10 rounded-lg">
                    <div className="text-2xl font-bold text-brand-dark">50+</div>
                    <div className="text-sm text-gray-600">Prototipos</div>
                  </div>
                  <div className="text-center p-3 bg-brand-aquea/10 rounded-lg">
                    <div className="text-2xl font-bold text-brand-dark">Tour 3D</div>
                    <div className="text-sm text-gray-600">Próximamente</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => window.open("https://www.urbanika.xyz/investment")} className="bg-brand-yellow text-white hover:bg-yellow-400">
                    <Banknote className="mr-2 h-4 w-4 text-white" />
                   Inversión
                  </Button>
                  <Button onClick={() => window.open("https://tally.so/r/wzbO9k")} variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
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
            <div className="grid md:grid-cols-2 gap-8 items-center p-6">
              <div className="relative">
                <Image
                  src="/placeholder.svg?width=600&height=400"
                  width={600}
                  height={400}
                  alt="Eco-tech Directory"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-brand-aqua text-white px-3 py-1 rounded-full text-sm font-bold">
                  Próximamente
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-brand-aqua mb-4">Marketplace/Directiorio de Eco-Tecnologías</h3>
                <p className="mb-6">
                Un mercado integral para eco-tecnologías, conectando comunidades con proveedores de soluciones sostenibles verificadas a nivel mundial.
                </p>
                <div className="space-y-3 mb-6">
                  {["Red Global de Proveedores", "Verificación de Impacto", "Contratos Inteligentes"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={() => window.open("https://tally.so/r/3qzV4d")} className="bg-brand-aqua hover:bg-brand-aqua ">
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