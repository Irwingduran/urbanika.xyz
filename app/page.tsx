"use client"
import Script from "next/script"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero"
import CorePrinciplesSection from "@/components/core-principles"
import InitiativesSection from "@/components/initiatives"
import BusBooking from "@/components/bus-booking"
import HomeSalesSection from "@/components/home-sales"
import ConsultingServicesSection from "@/components/consulting-services"
import EducationalOfferingSection from "@/components/educational-offering"
import Footer from "@/components/footer"
import TeamSection from "@/components/team-section"
import CommunitySection from "@/components/community"
import AboutSection from "@/components/about"
import ContactSection from "@/components/contact"
import InvestmentSidebar from "@/components/investment-sidebar"

export default function HomePage() {
  return (
    <div className="bg-background text-foreground w-full">
      {/* Google Calendar Scheduling Scripts */}
      <link href="https://calendar.google.com/calendar/scheduling-button-script.css" rel="stylesheet" />
      <Script src="https://calendar.google.com/calendar/scheduling-button-script.js" strategy="afterInteractive" />

      <Navbar />
      <main className="overflow-x-hidden">
        <InvestmentSidebar/>
        <HeroSection />
        <div id="initiatives">
        <InitiativesSection />
        </div>
        <CorePrinciplesSection />
        <div id="about">
        <AboutSection />
        </div>
        <div id="bus-tech">
        <BusBooking />
        </div>
        <div id="houses">
        <HomeSalesSection/>
        </div>
        <ConsultingServicesSection/>
        <TeamSection />
        <EducationalOfferingSection/>
        <CommunitySection />
        <div id="contact">
        <ContactSection />
        </div>
        <Footer />
      </main>
    </div>
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



{/*  
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
   */}

