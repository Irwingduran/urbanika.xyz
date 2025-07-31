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
    <section id="initiatives" className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Our Key Initiatives</h2>
        <p className="mt-2 text-lg text-gray-600">Pioneering solutions for tomorrow's cities</p>
      </div>
      <Tabs defaultValue="urbanikas-bus" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8 sm:mb-20">
          <TabsTrigger value="urbanikas-bus" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
            Urbanika's Eco-Tech Bus
          </TabsTrigger>
          <TabsTrigger value="smart-homes-sales" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
            Smart Home Sales
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
        <h3 className="text-3xl font-bold text-brand-aqua mb-2">Urbánika Is The First Mobile Home On The World</h3>
        <p className="mb-6 sm:mb-1">
         Made with eco-technologies that regenerate rather than pollute: biofilters, digesters, circular agriculture, smart sensors, and more.
          <br/>
          Our mission is to have a high impact throughout Latin America. We want to visit 20 cities,
          7 countries, and more. In the face of collapsing cities, an alternative is born.
        </p>
 
        <div className="space-y-3 mb-6 sm:mb-3">
          {["Energy Sovereignty", "Water Sovereignty", "Food Sovereignty"].map((feature) => (
            <div key={feature} className="flex items-center gap-5">
              <Target className="h-4 w-4 text-brand-aqua" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={() => window.open("https://www.instagram.com/reel/DMOuEfcx13A/")} className="bg-brand-aqua text-white hover:bg-teal-600">
            <Instagram className="mr-2 h-4 w-4" />
            View on Instagram
          </Button>
          <Button onClick={() => window.open("https://www.tiktok.com/@danini.eco/video/7528458965370408199")} variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
             View on Tik Tok
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
                <h3 className="text-3xl font-bold text-brand-aqua mb-4">Buy your home with Urbanika</h3>
                <p className="mb-6">
               Customizable architectural design, each Urbanika home is born from your decisions. In our digital builder, you choose
                modules: [bathroom, kitchen, living room, bedroom, etc.] and combine them to your liking in sizes of 6, 10, 20, or 40 feet.
                  <br/>
                  You also decide which eco-technologies to include and the level of delivery (turnkey or self-installation). Each combination is registered as a certificate of ownership on the Scroll Blockchain.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-brand-aqua/10 rounded-lg">
                    <div className="text-2xl font-bold text-brand-dark">50+</div>
                    <div className="text-sm text-gray-600">Cities Visited</div>
                  </div>
                  <div className="text-center p-3 bg-brand-aquea/10 rounded-lg">
                    <div className="text-2xl font-bold text-brand-dark">5K+</div>
                    <div className="text-sm text-gray-600">Visitors</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => window.open("https://www.urbanika.xyz/investment")} className="bg-brand-yellow text-white hover:bg-yellow-400">
                    <Banknote className="mr-2 h-4 w-4 text-white" />
                   Investment
                  </Button>
                  <Button variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Buy Home
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
                  Coming Soon
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-brand-aqua mb-4">Regeneration Marketplace/Directory</h3>
                <p className="mb-6">
                  A comprehensive marketplace for eco-technologies, connecting communities with verified sustainable
                  solution providers worldwide.
                </p>
                <div className="space-y-3 mb-6">
                  {["Global Provider Network", "Impact Verification", "Smart Contracts"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="bg-brand-aqua hover:bg-brand-aqua ">
                  <Calendar className="mr-2 h-4 w-4" />
                  Notify Me
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