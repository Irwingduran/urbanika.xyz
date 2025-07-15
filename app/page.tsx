"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  Leaf,
  Users,
  BookOpen,
  MapPin,
  Calendar,
  Zap,
  Globe,
  Play,
  Download,
  Share2,
  MessageCircle,
  Target,
  Lightbulb,
  Recycle,
  Clock,
} from "lucide-react"
import Script from "next/script"
import MultimediaHubSection from "@/components/MultimediaHubSection"

export default function HomePage() {
  return (
    <div className="bg-background text-foreground w-full">
      {/* Google Calendar Scheduling Scripts */}
      <link href="https://calendar.google.com/calendar/scheduling-button-script.css" rel="stylesheet" />
      <Script src="https://calendar.google.com/calendar/scheduling-button-script.js" strategy="afterInteractive" />

      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <CorePrinciplesSection />
        <InitiativesSection />
        <MultimediaHubSection />
        <BusBookingSection />
        <ImpactStoriesSection />
        <TechnologyShowcaseSection />
        <LearningPathsSection />
        <TeamSection />
        <PartnershipsSection />
        <CommunitySection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  )
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md bg-white/90 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img src="/logo.svg"   className="h-400 w-400" />
          </div>
          <span className="text-xl font-bold text-brand-dark">Urbánika</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-dark">
          <Link href="#impact" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Impact
          </Link>
          <Link href="#initiatives" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Initiatives
          </Link>
          <Link href="#map" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Global Map
          </Link>
          <Link href="#community" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Community
          </Link>
          <Link href="#contact" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Contact
          </Link>
           <Link href="#investment" className="hover:text-brand-aqua transition-colors" prefetch={false}>
            Investment
          </Link>
        </nav>
        <Button className="hidden md:inline-flex bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-semibold">
          Join Movement
        </Button>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 z-0">
        <Image
          src="/Bus.png"
          alt="Smart City Landscape"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="animate-fade-in">
          <Badge className="mb-4 bg-brand-aqua/50 text-white border-brand-aqua/20">
            🌱 Building the Future Today
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-dark via-brand-aqua to-brand-dark">
            Evolving Cities into Smart, Regenerative, & Autonomous Communities
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
            We leverage cutting-edge technology and collective intelligence to build flourishing urban environments that
            prioritize both human and environmental well-being.
          </p>
          {/*  
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-bold shadow-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-brand-aqua text-brand-aqua hover:bg-brand-aqua hover:text-white bg-transparent"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Whitepaper
            </Button>
          </div>
          */}
        </div>

      </div>
    </section>
  )
}

function CorePrinciplesSection() {
  const principles = [
    {
      icon: Users,
      title: "Decentralized",
      description:
        "People-powered systems that give communities control over their future through democratic participation.",
      features: ["Community Voting", "Local Governance", "Peer Networks"],
    },
    {
      icon: Bot,
      title: "Autonomous",
      description:
        "IoT, AI, and Blockchain automating processes based on human and nature's needs for optimal efficiency.",
      features: ["Smart Infrastructure", "AI Decision Support", "Automated Systems"],
    },
    {
      icon: Leaf,
      title: "Regenerative",
      description: "Circular economy principles embedded in the very design of the city and its sustainable processes.",
      features: ["Zero Waste", "Renewable Energy", "Biodiversity Focus"],
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Three Pillars of Smart Cities</h2>
          <p className="mt-2 text-lg text-gray-600">The foundation of our urban transformation approach</p>
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

function InitiativesSection() {
  const showroomImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-11%20at%204.12.49%E2%80%AFp.m.-3FguoU2CrOicdgqFbj0GrC13offyXc.png",
    "/placeholder.svg?width=600&height=400",
    "/placeholder.svg?width=600&height=400",
    "/placeholder.svg?width=600&height=400",
  ]

  return (
    <section id="initiatives" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Our Key Initiatives</h2>
          <p className="mt-2 text-lg text-gray-600">Pioneering solutions for tomorrow's cities</p>
        </div>
        <Tabs defaultValue="decidimos" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-24">
            <TabsTrigger value="decidimos" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              DecidimOS
            </TabsTrigger>
            <TabsTrigger value="showroom" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              Urban Showroom
            </TabsTrigger>
            <TabsTrigger value="directory" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              Eco-Tech Directory
            </TabsTrigger>
          </TabsList> 

          <TabsContent value="decidimos">
            <Card className="bg-gradient-to-r from-brand-aqua/5 to-transparent border-brand-aqua/20">
              <div className="grid md:grid-cols-2 gap-8 items-center p-6">
                <div className="relative">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-11%20at%204.12.21%E2%80%AFp.m.-ldqEFsLWv6tnnEkKKAr0kPDlNN0OFA.png"
                    width={600}
                    height={400}
                    alt="DecidimOS UI"
                    className="rounded-lg shadow-2xl"
                  />
                  <div className="absolute -top-4 -right-4 bg-brand-yellow text-brand-dark px-3 py-1 rounded-full text-sm font-bold">
                    Live Demo
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-brand-aqua mb-4">DecidimOS</h3>
                  <p className="text-gray-600 mb-6">
                    Leverage collective intelligence through decentralized autonomous organizations (DAOs), IoT, and AI
                    for community-driven decision making.
                  </p>
                  <div className="space-y-3 mb-6">
                    {["Blockchain Governance", "Smart Voting", "Community Analytics"].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-brand-yellow" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-brand-aqua text-white hover:bg-teal-600">Try Demo</Button>
                    <Button variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="showroom">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
                <div>
                  <h3 className="text-3xl font-bold text-brand-yellow mb-4">Urban Regeneration Showroom</h3>
                  <p className="text-gray-600 mb-6">
                    The world's first mobile urban regeneration showroom - a transformed bus showcasing sustainable
                    living technologies and community spaces.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-brand-yellow/10 rounded-lg">
                      <div className="text-2xl font-bold text-brand-dark">50+</div>
                      <div className="text-sm text-gray-600">Cities Visited</div>
                    </div>
                    <div className="text-center p-3 bg-brand-yellow/10 rounded-lg">
                      <div className="text-2xl font-bold text-brand-dark">5K+</div>
                      <div className="text-sm text-gray-600">Visitors</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-brand-yellow text-brand-dark hover:bg-yellow-400">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Visit
                    </Button>
                    <Button variant="outline" className="border-brand-aqua text-brand-aqua bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" />
                      Track Location
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="directory">
            <Card className="bg-gradient-to-r from-green-50 to-transparent border-green-200">
              <div className="grid md:grid-cols-2 gap-8 items-center p-6">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?width=600&height=400"
                    width={600}
                    height={400}
                    alt="Eco-tech Directory"
                    className="rounded-lg shadow-2xl"
                  />
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Coming Soon
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-green-600 mb-4">Urban Regeneration Directory</h3>
                  <p className="text-gray-600 mb-6">
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
                  <Button disabled className="bg-gray-300 text-gray-500">
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





// Extend the Window interface for TypeScript
declare global {
  interface Window {
    calendar?: {
      schedulingButton?: {
        load: (options: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

function BusBookingSection() {
  const [showFullCalendar, setShowFullCalendar] = useState<boolean>(false)

  useEffect(() => {
    
    // Initialize Google Calendar scheduling button
    const initializeCalendarButton = () => {
      if (window.calendar && window.calendar.schedulingButton) {
        const target = document.getElementById("calendar-button-target") as HTMLElement | null
        if (target) {
          window.calendar.schedulingButton.load({
            url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1eTqJ75GqNLJIIQ67GTbpW63vKCdE-fVHL3-LMmDUYTLVUgwsOAfxWk5qy1Fcgq7usQknX_qWi?gv=true",
            color: "#1fa597",
            label: "Schedule your bus visit",
            target,
          })
        }
      }
    }

    // Wait for the script to load
    const checkForCalendar = setInterval(() => {
      if (window.calendar) {
        initializeCalendarButton()
        clearInterval(checkForCalendar)
      }
    }, 100)

    return () => clearInterval(checkForCalendar)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-yellow/10 via-white to-brand-aqua/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-brand-yellow/20 text-brand-dark border-brand-yellow/30">
            🚌 Experience the Future
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Visit Our Mobile Showroom</h2>
          <p className="mt-2 text-lg text-gray-600">
            Book your exclusive tour of the world's first urban regeneration bus
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-brand-aqua/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-yellow/20 rounded-full">
                      <Calendar className="h-6 w-6 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">Quick Booking</h3>
                      <p className="text-gray-600">Schedule your visit in seconds</p>
                    </div>

                  {/* Google Calendar Button Target */}
                  <div id="calendar-button-target" className="mb-4"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-aqua" />
                      <span>30-45 min tours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-aqua" />
                      <span>Groups up to 8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-aqua" />
                      <span>Multiple locations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-brand-aqua" />
                      <span>Interactive demos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-brand-aqua/20">
                <CardContent className="p-6">
                  <h4 className="font-bold text-brand-dark mb-3">What You'll Experience:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Smart home automation systems
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Renewable energy solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Circular economy demonstrations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                      Community governance tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Card className="bg-white shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-brand-aqua to-brand-yellow p-4">
                  <div className="flex items-center justify-between text-white">
                    <h3 className="font-bold">Live Bus Tracker</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Currently in Mexico City</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
                    <Image
                      src="/destinations/puebla.jpg"
                      width={400}
                      height={400}
                      alt="Bus location map"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                        <MapPin className="h-8 w-8 text-brand-aqua mx-auto mb-2" />
                        <p className="font-semibold text-brand-dark">Next Stop: Puebla</p>
                        <p className="text-sm text-gray-600">Arriving July 19th </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -bottom-4 -right-4 bg-brand-yellow text-brand-dark p-3 rounded-lg shadow-lg">
                <div className="text-lg font-bold">150+</div>
                <div className="text-xs">Visitors this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ImpactStoriesSection() {
  const stories = {
    mexico: {
      title: "Mexico City Transformation",
      location: "Mexico City, Mexico",
      impact: "25% reduction in community conflicts",
      image: "/placeholder.svg?width=600&height=400",
      description: "How participatory budgeting revolutionized neighborhood governance in Colonia Roma.",
      metrics: [
        { label: "Citizens Engaged", value: "2,500+" },
        { label: "Projects Funded", value: "45" },
        { label: "Budget Allocated", value: "$1.2M" },
      ],
      testimonial: {
        quote:
          "For the first time, we feel heard by our local government. The DecidimOS platform gave us a real voice.",
        author: "Maria González",
        role: "Community Leader",
      },
    },
    barcelona: {
      title: "Smart Energy Grid",
      location: "Barcelona, Spain",
      impact: "40% energy efficiency improvement",
      image: "/placeholder.svg?width=600&height=400",
      description: "Implementing IoT sensors and AI-driven energy management in the Gràcia district.",
      metrics: [
        { label: "Homes Connected", value: "1,200" },
        { label: "Energy Saved", value: "40%" },
        { label: "CO₂ Reduced", value: "150T" },
      ],
      testimonial: {
        quote: "The smart grid not only reduced our bills but made us more conscious about energy consumption.",
        author: "Josep Martí",
        role: "Resident",
      },
    },
    berlin: {
      title: "Circular Economy Hub",
      location: "Berlin, Germany",
      impact: "Zero waste community achieved",
      image: "/placeholder.svg?width=600&height=400",
      description: "Creating a fully circular neighborhood where waste becomes resource through community cooperation.",
      metrics: [
        { label: "Waste Diverted", value: "95%" },
        { label: "Jobs Created", value: "120" },
        { label: "Revenue Generated", value: "€500K" },
      ],
      testimonial: {
        quote: "We've proven that zero waste isn't just possible, it's profitable and brings communities together.",
        author: "Anna Weber",
        role: "Circular Economy Coordinator",
      },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Impact Stories</h2>
          <p className="mt-2 text-lg text-gray-600">Real transformations happening in communities worldwide</p>
        </div>

        <Tabs defaultValue="mexico" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8">
            <TabsTrigger value="mexico" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              🇲🇽 Mexico City
            </TabsTrigger>
            <TabsTrigger value="barcelona" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              🇪🇸 Barcelona
            </TabsTrigger>
            <TabsTrigger value="berlin" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              🇩🇪 Berlin
            </TabsTrigger>
          </TabsList>

          {Object.entries(stories).map(([key, story]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-green-200">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  <div className="relative">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      width={600}
                      height={400}
                      alt={story.title}
                      className="rounded-lg shadow-lg"
                    />
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {story.impact}
                    </div>
                  </div>
                  <div>
                    <Badge className="mb-3 bg-green-100 text-green-700">{story.location}</Badge>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">{story.title}</h3>
                    <p className="text-gray-600 mb-6">{story.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {story.metrics.map((metric) => (
                        <div key={metric.label} className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{metric.value}</div>
                          <div className="text-xs text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                      <CardContent className="p-4">
                        <blockquote className="text-gray-700 italic mb-3">"{story.testimonial.quote}"</blockquote>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {story.testimonial.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-brand-dark">{story.testimonial.author}</div>
                            <div className="text-sm text-gray-600">{story.testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function TechnologyShowcaseSection() {
  const technologies = {
    iot: {
      title: "IoT Sensor Networks",
      category: "Smart Infrastructure",
      description: "Distributed sensors monitoring air quality, noise levels, and energy consumption in real-time.",
      features: ["Real-time Monitoring", "Predictive Analytics", "Community Alerts"],
      demo: "Live sensor data from 50+ locations",
      image: "/placeholder.svg?width=600&height=400",
      stats: { deployed: "500+", cities: "12", accuracy: "99.2%" },
    },
    blockchain: {
      title: "Governance Blockchain",
      category: "Democratic Tools",
      description: "Transparent, immutable voting and decision-making platform for community governance.",
      features: ["Secure Voting", "Transparent Budgets", "Smart Contracts"],
      demo: "Interactive governance simulation",
      image: "/placeholder.svg?width=600&height=400",
      stats: { votes: "25K+", proposals: "340", communities: "18" },
    },
    ai: {
      title: "Urban AI Assistant",
      category: "Intelligent Systems",
      description: "AI-powered recommendations for urban planning and resource optimization.",
      features: ["Pattern Recognition", "Resource Optimization", "Predictive Modeling"],
      demo: "Chat with our urban AI",
      image: "/placeholder.svg?width=600&height=400",
      stats: { decisions: "1.2K", efficiency: "+35%", satisfaction: "94%" },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Technology Showcase</h2>
          <p className="mt-2 text-lg text-gray-600">Cutting-edge tools powering smart cities</p>
        </div>

        <Tabs defaultValue="iot" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8">
            <TabsTrigger value="iot" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              <Zap className="mr-2 h-4 w-4" />
              IoT Sensors
            </TabsTrigger>
            <TabsTrigger
              value="blockchain"
              className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              <Bot className="mr-2 h-4 w-4" />
              AI Systems
            </TabsTrigger>
          </TabsList>

          {Object.entries(technologies).map(([key, tech]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-gradient-to-r from-brand-aqua/5 to-transparent border-brand-aqua/20">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  <div>
                    <Badge className="mb-3 bg-brand-aqua/10 text-brand-aqua">{tech.category}</Badge>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">{tech.title}</h3>
                    <p className="text-gray-600 mb-6">{tech.description}</p>

                    <div className="space-y-3 mb-6">
                      {tech.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(tech.stats).map(([label, value]) => (
                        <div key={label} className="text-center p-3 bg-brand-aqua/10 rounded-lg">
                          <div className="text-lg font-bold text-brand-aqua">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">{label}</div>
                        </div>
                      ))}
                    </div>

                    <Button className="bg-brand-aqua text-white hover:bg-teal-600">
                      <Play className="mr-2 h-4 w-4" />
                      {tech.demo}
                    </Button>
                  </div>
                  <div className="relative">
                    <Image
                      src={tech.image || "/placeholder.svg"}
                      width={600}
                      height={400}
                      alt={tech.title}
                      className="rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-aqua/20 to-transparent rounded-lg" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm font-semibold text-brand-dark">Live Demo Available</div>
                      <div className="text-xs text-gray-600">Interactive experience</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function LearningPathsSection() {
  const paths = {
    beginner: {
      title: "Community Organizer",
      level: "Beginner",
      duration: "4 weeks",
      description: "Learn the fundamentals of community engagement and participatory democracy.",
      courses: [
        { name: "Introduction to Commons", duration: "2h", completed: true },
        { name: "Community Mapping", duration: "3h", completed: true },
        { name: "Facilitation Basics", duration: "4h", completed: false },
        { name: "Conflict Resolution", duration: "5h", completed: false },
      ],
      certificate: "Community Organizer Certificate",
      nextStep: "Urban Planner Path",
    },
    intermediate: {
      title: "Urban Planner",
      level: "Intermediate",
      duration: "8 weeks",
      description: "Master sustainable urban design and smart city technologies.",
      courses: [
        { name: "Sustainable Design Principles", duration: "6h", completed: false },
        { name: "IoT for Cities", duration: "8h", completed: false },
        { name: "Data-Driven Planning", duration: "10h", completed: false },
        { name: "Circular Economy Design", duration: "12h", completed: false },
      ],
      certificate: "Urban Innovation Specialist",
      nextStep: "Systems Architect Path",
    },
    advanced: {
      title: "Systems Architect",
      level: "Advanced",
      duration: "12 weeks",
      description: "Design and implement complete smart city ecosystems.",
      courses: [
        { name: "Blockchain Governance", duration: "15h", completed: false },
        { name: "AI for Urban Systems", duration: "20h", completed: false },
        { name: "Systems Integration", duration: "25h", completed: false },
        { name: "Impact Measurement", duration: "18h", completed: false },
      ],
      certificate: "Smart City Architect",
      nextStep: "Mentor Program",
    },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-yellow/10 to-brand-red/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Learning Paths</h2>
          <p className="mt-2 text-lg text-gray-600">Structured journeys to become an urban changemaker</p>
        </div>

        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8">
            <TabsTrigger
              value="beginner"
              className="data-[state=active]:bg-brand-yellow data-[state=active]:text-brand-dark"
            >
              🌱 Beginner
            </TabsTrigger>
            <TabsTrigger
              value="intermediate"
              className="data-[state=active]:bg-brand-yellow data-[state=active]:text-brand-dark"
            >
              🌿 Intermediate
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-brand-yellow data-[state=active]:text-brand-dark"
            >
              🌳 Advanced
            </TabsTrigger>
          </TabsList>

          {Object.entries(paths).map(([key, path]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="grid md:grid-cols-3 gap-8 p-6">
                  <div className="md:col-span-1">
                    <Badge className="mb-3 bg-brand-yellow/20 text-brand-dark">{path.level}</Badge>
                    <h3 className="text-2xl font-bold text-brand-dark mb-2">{path.title}</h3>
                    <p className="text-gray-600 mb-4">{path.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-yellow" />
                        <span className="text-sm text-gray-600">{path.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-brand-yellow" />
                        <span className="text-sm text-gray-600">{path.certificate}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-brand-yellow text-brand-dark hover:bg-yellow-400 mb-4">
                      Start Learning Path
                    </Button>

                    <p className="text-xs text-gray-500">
                      Next: <span className="font-semibold">{path.nextStep}</span>
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-brand-dark mb-4">Course Curriculum</h4>
                    <div className="space-y-3">
                      {path.courses.map((course, index) => (
                        <Card
                          key={course.name}
                          className={`p-4 ${course.completed ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  course.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                                }`}
                              >
                                {course.completed ? "✓" : index + 1}
                              </div>
                              <div>
                                <h5 className="font-medium text-brand-dark">{course.name}</h5>
                                <p className="text-sm text-gray-600">{course.duration}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={course.completed ? "secondary" : "default"}
                              className={course.completed ? "bg-green-100 text-green-700" : "bg-brand-aqua text-white"}
                            >
                              {course.completed ? "Completed" : "Start"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function PartnershipsSection() {
  const partnerships = {
    cities: {
      title: "City Partnerships",
      description: "Collaborating with forward-thinking municipalities to implement smart city solutions.",
      partners: [
        {
          name: "Mexico City Government",
          type: "Municipal",
          project: "Participatory Budgeting Platform",
          status: "Active",
        },
        { name: "Barcelona Smart City", type: "Innovation Hub", project: "IoT Sensor Network", status: "Expanding" },
        { name: "Berlin Senate", type: "Regional", project: "Circular Economy Initiative", status: "Planning" },
      ],
      cta: "Partner with Us",
      benefits: ["Direct Implementation", "Policy Integration", "Citizen Engagement"],
    },
    academic: {
      title: "Academic Institutions",
      description: "Research partnerships advancing the science of urban regeneration and smart governance.",
      partners: [
        { name: "MIT Urban Planning", type: "Research", project: "AI Urban Optimization", status: "Research" },
        { name: "ETH Zurich", type: "Technology", project: "Blockchain Governance", status: "Development" },
        { name: "Universidad Nacional", type: "Social Science", project: "Community Impact Study", status: "Analysis" },
      ],
      cta: "Research Together",
      benefits: ["Cutting-edge Research", "Student Programs", "Knowledge Exchange"],
    },
    corporate: {
      title: "Corporate Partners",
      description: "Working with innovative companies to scale sustainable urban technologies.",
      partners: [
        {
          name: "Siemens Smart Infrastructure",
          type: "Technology",
          project: "Smart Grid Integration",
          status: "Pilot",
        },
        { name: "Microsoft AI for Good", type: "Platform", project: "Urban AI Assistant", status: "Beta" },
        { name: "Patagonia", type: "Sustainability", project: "Regenerative Business Model", status: "Active" },
      ],
      cta: "Join Our Network",
      benefits: ["Market Access", "Innovation Labs", "Impact Scaling"],
    },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/5 to-brand-yellow/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Strategic Partnerships</h2>
          <p className="mt-2 text-lg text-gray-600">Building the future together with leading organizations</p>
        </div>

        <Tabs defaultValue="cities" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-100 mb-8">
            <TabsTrigger value="cities" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              <Globe className="mr-2 h-4 w-4" />
              Cities
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              <BookOpen className="mr-2 h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="corporate" className="data-[state=active]:bg-brand-aqua data-[state=active]:text-white">
              <Target className="mr-2 h-4 w-4" />
              Corporate
            </TabsTrigger>
          </TabsList>

          {Object.entries(partnerships).map(([key, partnership]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="grid md:grid-cols-3 gap-8 p-6">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">{partnership.title}</h3>
                    <p className="text-gray-600 mb-6">{partnership.description}</p>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-brand-dark">Partnership Benefits:</h4>
                      {partnership.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-aqua rounded-full"></div>
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-brand-aqua text-white hover:bg-teal-600">{partnership.cta}</Button>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-brand-dark mb-4">Current Partners</h4>
                    <div className="space-y-4">
                      {partnership.partners.map((partner) => (
                        <Card key={partner.name} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="font-medium text-brand-dark">{partner.name}</h5>
                                <Badge variant="secondary" className="text-xs">
                                  {partner.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{partner.project}</p>
                            </div>
                            <Badge
                              className={`${
                                partner.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : partner.status === "Expanding"
                                    ? "bg-blue-100 text-blue-700"
                                    : partner.status === "Planning"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {partner.status}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="mt-6 p-4 bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-dashed border-2 border-brand-aqua/30">
                      <div className="text-center">
                        <h5 className="font-semibold text-brand-dark mb-2">Become a Partner</h5>
                        <p className="text-sm text-gray-600 mb-3">Join our network of innovative organizations</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-brand-aqua text-brand-aqua bg-transparent"
                        >
                          Learn More
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}



function CommunitySection() {
  return (
    <section id="community" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Join Our Community</h2>
          <p className="mt-2 text-lg text-gray-600">Connect with changemakers worldwide</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-brand-aqua/10 border-brand-aqua/20 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-brand-aqua mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Telegram Community</h3>
              <p className="text-gray-600 mb-4">Join 5K+ members discussing urban innovation</p>
              <Button className="bg-brand-aqua text-white hover:bg-teal-600">Join Telegram</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-brand-yellow/10 border-brand-yellow/20 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-brand-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Monthly Meetups</h3>
              <p className="text-gray-600 mb-4">Virtual and in-person events worldwide</p>
              <Button className="bg-brand-yellow text-brand-dark hover:bg-yellow-400">View Events</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Innovation Lab</h3>
              <p className="text-gray-600 mb-4">Collaborate on cutting-edge projects</p>
              <Button className="bg-green-600 text-white hover:bg-green-700">Get Involved</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/5 to-brand-yellow/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Since 2015, Urbanika has been at the forefront of urban innovation, experimenting with commons-based
                governance, cooperative economics, and participatory democracy.
              </p>
              <p>
                We collaborate with local authorities, researchers, neighbors, and businesses to co-design and implement
                solutions that make cities more livable, sustainable, and equitable.
              </p>
              <p>
                Our team combines activism, science, and professional expertise to breathe life into urban regeneration
                projects that prioritize both human and environmental well-being.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-aqua">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-aqua">25+</div>
                <div className="text-sm text-gray-600">Cities Impacted</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?width=600&height=400"
              width={600}
              height={400}
              alt="Team working on urban project"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-yellow text-brand-dark p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold">150+</div>
              <div className="text-sm">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const team = [
    {
      name: "Humberto",
      handle: "@HumbertoBesso",
      role: "MSc & MA in eGovernance",
      specialty: "Blockchain & Governance",
      img: "/member/01member.jpg",
    },
    {
      name: "Irwing",
      handle: "@Irwingduran",
      role: "Full-stack Web3 Developer",
      specialty: "Full Stack Dev",
      img: "/member/00001memeber.jpg",
    },
    {
      name: "Dorian",
      handle: "@Solxpriestess",
      role: "MSc Environmental Risks",
      specialty: "Sustainability",
      img: "/member/0001member.jpg",
    },
    {
      name: "Alejandra",
      handle: "@AleVerde999",
      role: "MSc Environmental Risks",
      specialty: "Sustainability",
      img: "/member/0000001member.jpeg",
    },
    {
      name: "Sofia",
      handle: "@0xSofiverse",
      role: "Architect & UI/UX Designer",
      specialty: "Urban Design",
      img: "/member/001member.jpg",
    },
    {
      name: "Brenda",
      handle: "@Be_magra",
      role: "Social Media Manager",
      specialty: "Marketing",
      img: "/member/000001member.jpg",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Meet Our Team</h2>
          <p className="mt-2 text-lg text-gray-600">Passionate experts driving urban transformation</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card
              key={member.name}
              className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-brand-aqua/20 group-hover:border-brand-aqua transition-colors">
                  <AvatarImage src={member.img || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-brand-aqua/10 text-brand-aqua text-xl">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-brand-dark">{member.name}</h3>
                <p className="text-brand-aqua font-medium">{member.handle}</p>
                <p className="text-gray-600 text-sm mt-1">{member.role}</p>
                <Badge className="mt-2 bg-brand-yellow/20 text-brand-dark">{member.specialty}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/10 to-brand-yellow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Get In Touch</h2>
            <p className="mt-2 text-lg text-gray-600">Ready to transform your community? Let's talk!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Start Your Journey</h3>
              <p className="text-gray-600 mb-8">
                Whether you're a city official, community leader, or passionate citizen, we're here to help you create
                positive change in your urban environment.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-aqua/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-brand-aqua" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Book a Consultation</h4>
                    <p className="text-gray-600">Free 30-minute strategy session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-yellow/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Join Our Community</h4>
                    <p className="text-gray-600">Connect with like-minded changemakers</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark">Collaborate</h4>
                    <p className="text-gray-600">Partner with us on innovative projects</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-1">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Organization</label>
                    <Input placeholder="Your organization (optional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Message</label>
                    <Textarea placeholder="Tell us about your project or how we can help..." rows={4} />
                  </div>
                  <Button className="w-full bg-brand-aqua text-white hover:bg-teal-600">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 bg-brand-dark text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                <Leaf className="h-5 w-5 text-brand-dark" />
              </div>
              <span className="text-xl font-bold">Urbánika</span>
            </div>
            <p className="text-gray-300 mb-4">
              Building the future of sustainable, autonomous, and regenerative cities through technology and community.
            </p>
            <div className="flex gap-4">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                LinkedIn
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Initiatives</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  DecidimOS
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Urban Showroom
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Eco-Tech Directory
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 Urbanika. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-brand-yellow">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-brand-yellow">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
