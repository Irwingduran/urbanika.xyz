import React from 'react'
import { Leaf } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const Footer = () => {
  return (
      <footer className="py-12 bg-brand-dark text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <img src="/logo.svg" className="h-full w-full object-contain" />
             </div>
            <span className="text-xl font-bold text-brand-dark">Urbánika</span>
           </Link>
           </div>
            <p className="text-gray-300 mb-4">
              Construyendo el futuro de ciudades sostenibles, autónomas y regenerativas a través de la tecnología y la comunidad.
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
            <h4 className="font-semibold mb-4">Iniciativas</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/#initiatives" className="hover:text-brand-yellow">
                  Autobús Eco-Tecnológico de Urbanika
                </Link>
              </li>
              <li>
                <Link href="/#bus-tech" className="hover:text-brand-yellow">
                  Agendar Visita Casa Rodante
                </Link>
              </li>
              <li>
                <Link href="/#houses" className="hover:text-brand-yellow">
                  Casa del Futuro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Publicaciones
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
            <h4 className="font-semibold mb-4">Conectar</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-yellow">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-brand-yellow">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 Urbánika. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-brand-yellow">
              Política de Privacidad
            </Link>
            <Link href="#" className="hover:text-brand-yellow">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer