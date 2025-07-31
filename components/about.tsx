import Image from 'next/image'
import React from 'react'

const AboutSection = () => {
  return (
   <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-brand-aqua/5 to-brand-yellow/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Our Story</h2>
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
              src="/about-image.jpeg"
              width={500}
              height={250}
              alt="Team working on urban project"
              className="rounded-lg shadow-2xl"
            />
           
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection