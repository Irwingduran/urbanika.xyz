import { Leaf } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Footer = () => {
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

export default Footer
