const SupportBanner = () => {
    return (
      <div className="bg-[#5BC0DE] rounded-3xl p-8 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Want to support our work? ❤️</h2>
        <p className="text-2xl mb-8">These rounds are active!</p>
        
        <div className="flex justify-center items-center gap-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2">
              <img 
                src="/icon/icon-giveth.svg" 
                alt="Giveth logo" 
                className="w-full"
              />
            </div>
            <p className="font-medium">Giveth</p>
            <p className="text-sm">Urbanika</p>
          </div>
  
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-2">
              <img 
                src="/icon/icon-gitcoin.svg" 
                alt="Gitcoin logo" 
                className="w-full"
              />
            </div>
            <p className="font-medium">Gitcoin</p>
            <p className="text-sm">Round name</p>
          </div>
        </div>
      </div>
    );
  };

  export default SupportBanner;