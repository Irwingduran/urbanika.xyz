const Footer = () => {
    return (
      <div className="bg-[#5BC0DE]  p-8 text-white text-center">
        <div className="w-12 h-12 mx-auto mb-4">
          <img 
            src="/logo/logo-white.svg" 
            alt="Hummingbird logo" 
            className="w-full"
          />
        </div>
        
        <p className="mb-4">Find us on:</p>
        <div className="space-y-2">
          <p className="hover:underline cursor-pointer"><a href="http://x.com/0xurbanika">Twitter</a></p>
          <p className="hover:underline cursor-pointer"><a href="https://www.instagram.com/0xurbanika/">Instagram</a></p>
          <p className="hover:underline cursor-pointer"><a href="http://x.com/0xurbanika">Farcaster</a></p>
        </div>
      </div>
    );
  };

export default Footer;  