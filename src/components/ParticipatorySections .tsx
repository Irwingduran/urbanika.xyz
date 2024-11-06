
const ParticipatorySections = () => {
  return (
    <div className="bg-pink-400 text-white p-8 md:p-12 rounded-3xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center relative">
        {/* Left Column */}
        <div className="w-full md:w-2/5 space-y-6 md:pr-12 mb-8 md:mb-0">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
            {/* Aquí puedes colocar tu icono */}
            <img 
              src="/icon/icon-participatory-democracy.svg" 
              alt="Democracy icon" 
              className="w-16 h-16"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Participatory democracy
          </h2>
        </div>

        {/* Vertical Divider Line */}
        <div className="hidden md:block absolute h-full w-px bg-white left-[40%]" />

        {/* Right Column */}
        <div className="w-full md:w-3/5 md:pl-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">
              Our work focuses on two areas:
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-2">
                  Municipalities:
                </h4>
                <p className="text-lg leading-relaxed">
                  We work with GoVocal to support Mayors in building trust and legitimacy, 
                  strengthening their institutions, and making citizens develop a sense of 
                  belonging.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-2">
                  Local communities:
                </h4>
                <p className="text-lg leading-relaxed">
                  We are developing an all-in-one DAO tool known as DecidimOS, to support 
                  condominiums in improving the governance and management of their shared 
                  resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipatorySections;