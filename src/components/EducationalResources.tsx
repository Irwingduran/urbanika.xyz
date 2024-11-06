
const EducationalResources = () => {
    return (
      <div className="bg-pink-400 text-white p-8 md:p-12 rounded-3xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center relative">
          {/* Left Column */}
          <div className="w-full md:w-2/5 space-y-6 md:pr-12 mb-8 md:mb-0">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              {/* Aquí puedes colocar tu icono */}
              <img 
                src="/icon/icon-educational-resources.svg" 
                alt="Democracy icon" 
                className="w-16 h-16"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
            Educational resources
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
                  Thanks to donors from all around the world and to top practitioners that have gifted their time and knowledge, we created a series of educational content relating to peer governance, bioregions, and commoning. 
                  </p>
                </div>

                <p className="text-lg leading-relaxed">
                Enjoy them, they are free!
                </p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EducationalResources;