import React, { useState } from 'react';

const UrbanRegeneration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const timelineEvents = [
    {
      date: "June 30th 2024",
      title: "Neighborhood governance:",
      subtitle: "Participatory budgeting, session 1.",
      link: "https://x.com/0xUrbanika/status/1807460032948133930?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1807460032948133930%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "June 28th 2024",
      title: "Making bus installations invisible.",
      link: "https://x.com/0xUrbanika/status/1807373695091933184?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1807373695091933184%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "June 7th 2024",
      title: "Food garden design.",
      link: "https://x.com/0xUrbanika/status/1806087900318380423?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1806087900318380423%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "May 29th 2024",
      title: "More on the structure of the bus.",
      link: "https://x.com/0xUrbanika/status/1795868758013096268?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1795868758013096268%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "May 24th 2024",
      title: "WiFi, data and security camera networks.",
      link: "https://x.com/0xUrbanika/status/1794107788324401251?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1794107788324401251%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "May 15th 2024",
      title: "The structure of the bus.",
      link: "https://x.com/0xUrbanika/status/1790842721814368598?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1790842721814368598%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "May 1st 2024",
      title: "Electric Installation for the bus.",
      link: "https://x.com/0xUrbanika/status/1785748966509773054?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1785748966509773054%7Ctwgr%5E21cb36b965b1b4980ce641bbcf9f8b0c8f80f37c%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc"
    },
    {
      date: "April 29th 2024",
      title: "Biofilter explanation.",
      link: "#"
    },
    {
      date: "April 26th 2024",
      title: "Delivery of the architectural project.",
      link: "#"
    },
    {
      date: "April 24th 2024",
      title: "Dry toilet mode explanation.",
      link: "#"
    }
  ];

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Urban Regeneration Showroom</h1>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          It's a bus turned into a house and a school.
        </p>
        <p className="text-gray-600 max-w-3xl mx-auto">
          We've achieved an important level of sovereignty, which is useful for every house and
          building. The bus produces food, generates 100% of its energy needs from the sun and
          the wind, treats 100% of its grey waters into drinkable water, harvests rain water too,
          treats 100% of our organic waste and turns it into protein, oil, and compost at least 3x
          faster than with worms. In the near future we will even produce our own Diesel from
          microwaving plastics.
        </p>
      </div>

      {/* Large Images Section */}
      <div className=" gap-8 mb-12">
         <img
          src="/img/Untitled.webp"
          alt="Bus exterior"
          className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick("/img/Untitled.webp")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <img
          src="/img/Bus.webp"
          alt="Bus exterior"
          className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick("/img/Bus.webp")}
        />
        <img
          src="/img/Infographic_of_the_climate_positive_bus_-_Urbanika.webp"
          alt="Bus technical diagram"
          className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick("/img/Infographic_of_the_climate_positive_bus_-_Urbanika.webp")}
        />
      </div>

      {/* Call to Action */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">
          Turn your house or city building into a regenerative hub with us!
        </h2>
        <button 
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-md transition-colors"
          onClick={() => window.location.href = '#contact'}
        >
          Book a call with us!
        </button>
      </div>

      {/* Timeline Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-8 text-center">Making the solarpunk bus happen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timelineEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm mb-2">{event.date}</p>
              <h3 className="font-medium mb-2">{event.title}</h3>
              {event.subtitle && <p className="text-gray-600 mb-2">{event.subtitle}</p>}
              <a href={event.link} className="text-pink-500 hover:text-pink-600 text-sm">
                Read more here.
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
             onClick={() => setIsModalOpen(false)}>
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full relative"
               onClick={e => e.stopPropagation()}>
            <button
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="text-2xl">&times;</span>
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-auto"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrbanRegeneration;