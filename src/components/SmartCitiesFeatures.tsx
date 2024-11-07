interface FeatureCardProps {
    title: string;
    description: string;
  }
  
  const FeatureCard = ({ title, description }: FeatureCardProps) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
  
  const SmartCitiesFeatures = () => {
    const features: FeatureCardProps[] = [
      {
        title: "Decentralized",
        description: "People powered."
      },
      {
        title: "Autonomous",
        description: "IoT, AI and Blockchain technologies automate processes based on human, nature and machine needs."
      },
      {
        title: "Regenerative",
        description: "Circular economy embedded in the design of the city and its processes."
      }
    ];
  
    return (
      <div className="h-fit bg-gray-50 px-4 py-16 rounded-3xl">
        {/* Main Container */}
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-8">
              Welcome to the evolution of<br />Smart Cities
            </h1>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          {/* Bottom Text */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Let's make your city a hub for human and nature flourishment through technology and collective intelligence.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SmartCitiesFeatures;