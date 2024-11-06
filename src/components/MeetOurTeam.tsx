const TeamMember = ({ image, name, twitter, role, description }) => (
    <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
      <img 
        src={image} 
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
      <a 
        href={`https://twitter.com/${twitter.replace('@', '')}`}
        className="text-pink-500 hover:underline inline-block mb-3"
      >
        {twitter}
      </a>
      <p className="text-gray-600 mb-2">{role}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );

const MeetOurTeam = () => {
    const teamMembers = [
      {
        image: "/img/member3.jpg",
        name: "Humberto",
        twitter: "@HumbertoBesso",
        role: "MSc & MA in eGovernance and Public Sector Innovation",
        description: "In blockchain tech since 2017."
      },
      {
        image: "/img/member2.jpg",
        name: "Anna",
        twitter: "@KaicAnna",
        role: "MSc Marketing",
        description: "Specialized in web3 fundraising and project analysis since 2021."
      },
      {
        image: "/img/member1.jpg",
        name: "Sofia",
        twitter: "@0xSofiverse",
        role: "Architect and UI/UX designer",
        description: "Specialized in Urbanism, local governance, and the design of immersive experiences."
      },
      {
        image: "/img/member4.jpg",
        name: "Irwing",
        twitter: "@Irwingduran",
        role: "Full-stack web3 developer",
        description: "Multi-chain hackathon winner."
      }
    ];
  
    return (
      <div className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-700 mb-12">
          Meet the team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    );
  };

  export default MeetOurTeam;