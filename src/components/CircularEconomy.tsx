
const CircularEconomy = () => {
    return (
      <div className="bg-pink-400 text-white p-8 md:p-12 rounded-3xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center relative">
          {/* Left Column */}
          <div className="w-full md:w-2/5 space-y-6 md:pr-12 mb-8 md:mb-0">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              {/* Aquí puedes colocar tu icono */}
              <img 
                src="/icon/icon-bus.svg" 
                alt="Democracy icon" 
                className="w-16 h-16"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
            Circular economy and self-sovereignty
            </h2>
          </div>
  
          {/* Vertical Divider Line */}
          <div className="hidden md:block absolute h-full w-px bg-white left-[40%]" />
  
          {/* Right Column */}
          <div className="w-full md:w-3/5 md:pl-12">
            <div className="space-y-8">
              
              
              <div className="space-y-6">
                <div>
                  
                  <p className="text-lg leading-relaxed">
                  We built the first ever urban regeneration showroom on wheels that allows decision makers to experience  regenerative technology applied to a house and municipal infrastructure.
                  </p>
                </div>
  
              
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CircularEconomy;