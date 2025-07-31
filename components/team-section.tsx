import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const TeamSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Conoce Nuestros Perfiles</h2>
          <p className="mt-2 text-lg text-gray-600">Expertos con experiencia comprobada en transformación urbana y tecnológica</p>
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

export default TeamSection

