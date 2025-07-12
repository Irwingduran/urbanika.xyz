
const Hero = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background image container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/Bus.png')"
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/100 to-white/30" />
      
      {/* Content container */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 max-w-4xl mb-8">
          We evolve cities into Smart, Regenerative, and Autonomous communities.
        </h1>
        
        <a href="#initiatives">
            <button className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium px-8 py-3 rounded-md transition-colors">
          Explore our work
        </button>
            </a>
      </div>
    </div>
  );
};

export default Hero;
