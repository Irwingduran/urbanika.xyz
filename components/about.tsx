import Image from 'next/image'
import React from 'react'

const AboutSection = () => {
  return (
   <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/5 to-brand-yellow/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Nuestra Historia</h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Desde 2015, Urbanika ha estado a la vanguardia de la innovación urbana, experimentando con gobernanza basada en bienes comunes,
                economía cooperativa y democracia participativa.
              </p>
              <p>
                Colaboramos con autoridades locales, investigadores, vecinos y empresas para co-diseñar e implementar
                soluciones que hagan las ciudades más habitables, sostenibles y equitativas.
              </p>
              <p>
                Nuestro equipo combina activismo, ciencia y experiencia profesional para dar vida a proyectos de regeneración urbana
                que priorizan tanto el bienestar humano como el ambiental.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-aqua">10+</div>
                <div className="text-sm text-gray-600">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-aqua">25+</div>
                <div className="text-sm text-gray-600">Ciudades Impactadas</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/about-image.jpeg"
              width={500}
              height={250}
              alt="Equipo trabajando en proyecto urbano"
              className="rounded-lg shadow-2xl"
            />
           
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection