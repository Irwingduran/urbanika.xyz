

const DecidimOS = () => {
  const publications = [
    {
      title: "Co-creating Autonomous Cities",
      description: "An article on local urban governance for the National Association of Parks and Recreation in Mexico, by Sofia. Written in Spanish.",
      link: "https://anpr.org.mx/co-creando-ciudades-autonomas/",
      linkText: "Go to the article."
    },
    {
      title: "Cases of Descentralized Governance in LATAM",
      description: "Conference in ETH Mexico, in Merida (Yucatan).",
      link: "https://youtu.be/67HoYlScOtk?si=v5DdUDAMhXGYhNJc",
      linkText: "Go to the video."
    },
    {
      title: "Neighborhood governance, the beginning of a national level governance?",
      description: "Thoughts on democracy by Humberto.",
      link: "https://connexionmexico.com/comercial/?p=242",
      linkText: "Go to the article."
    },
    {
      title: "Decentralized Horizon Europe",
      description: "Mission-oriented organizations for the world.",
      link: "https://www.linkedin.com/in/humbertobesso/details/featured/1635462027873/single-media-viewer/?profileId=ACoAAA46KWYBc50zhP4QTXEmypMNySNLd1908GY",
      linkText: "Go to the article."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">DecidimOS</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Leverage the collective intelligence within your local community,
          neighborhood, or city through the power of decentralized autonomous
          organizations (DAOs), IoT, and AI.
        </p>
      </div>

      {/* Screenshots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={`/img/screenshot-${item}.png`}
              alt={`DecidimOS interface ${item}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      {/* Publications Section */}
      <div>
        <h2 className="text-3xl font-semibold mb-8 text-center">Publications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publications.map((pub, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">{pub.title}</h3>
              <p className="text-gray-600 mb-4">{pub.description}</p>
              <a 
                href={pub.link}
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                {pub.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecidimOS;