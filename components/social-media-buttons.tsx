import React, { JSX } from 'react';

interface SocialLink {
  name: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  icon: JSX.Element;
}

const SocialMediaButtons: React.FC = () => {
  const socialLinks: SocialLink[] = [
    {
      name: 'X (Twitter)',
      url: 'https://x.com/0xUrbanika',
      bgColor: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      icon: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/0xUrbanika',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      icon: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18" cy="6" r="1" fill="currentColor"/>
        </>
      ),
    },
     {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yourusername',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      icon: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      ),
    },
  ];

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 ${social.bgColor} ${social.hoverColor} rounded-full shadow-lg transition-all duration-300 hover:scale-110 transform`}
          aria-label={`Visitar ${social.name}`}
          title={social.name}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {social.icon}
          </svg>
        </a>
      ))}
    </div>
  );
};

export default SocialMediaButtons;