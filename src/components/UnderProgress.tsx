const UnderProgress = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {/* Title */}
      <h1 className="text-5xl font-semibold text-gray-700 mb-12">
        Under progress
      </h1>

      {/* Main Description */}
      <div className="space-y-8 mb-12">
        <p className="text-gray-600 text-lg">
          This eCommerce platform will offer you worldwide eco-solution providers
          filtrated by country, impact, and climate-related problems.
        </p>

        <p className="text-gray-600 text-lg">
          Our key features are: token-gated cabilities such as writing reviews only
          available for buyers, protection against fraud via smart contracts, impact
          trazability, and certification.
        </p>
      </div>

      {/* Call to Action Section */}
      <div className="space-y-6">
        <p className="text-gray-600 text-xl">
          Interested in partnering or supporting us?
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          <button 
            className="bg-[#70C7D3] hover:bg-[#5BB8C4] text-white font-medium px-8 py-3 rounded-md transition-colors"
            onClick={() => window.location.href = '#book-call'}
          >
            Book a call
          </button>
          
          <button 
            className="bg-[#70C7D3] hover:bg-[#5BB8C4] text-white font-medium px-8 py-3 rounded-md transition-colors"
            onClick={() => window.location.href = 'https://t.me/+i5tEIvodgZk1MGI5'}
          >
            Join our Telegram channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderProgress;