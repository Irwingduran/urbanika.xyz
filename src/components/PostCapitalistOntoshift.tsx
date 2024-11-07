
const PostCapitalistOntoshift = () => {
  const courses = [
    {
      title: "Complete practical course about the Commons",
      description: "What is postCapitalism and why is it a key perspective to get out of the meta-crisis we are living in? It is one of many questions you will solve in this course (...)",
      link: "https://urbanika.notion.site/Urb-nika-s-course-on-the-Commons-afda9a109bec4ad29309498668265cbd",
    },
    {
      title: "Full Introductory course on Conflict Resolution",
      description: "This complete course of 5 weeks takes you into the path of becoming a professional moderator of any virtual or real community (...)",
      link: "https://gravitydao.org/online-courses/"
    },
    {
      title: "Blockchain tech for Impact Communities",
      description: "This is a full course that takes you from understanding what is the difference between Web3 and the Web 2.0 to opening a DAO and using decentralized tools (...)",
      link: "https://urbanika.notion.site/Tecnolog-a-Blockchain-para-Comunidades-de-Impacto-e427451ab3e84b4588c7cd0f2e777cc6"
    },
  ];

  const threads = [
    {
      title: "The Commoner's Catalog for Changemakers by David Bollier.",
      link: "https://x.com/0xUrbanika/status/1615031745950146560?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1615031745950146560%7Ctwgr%5Ebe0a14176b69b0c1759fb2192c72d0e160f5cd09%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc",
    },
    {
      title: "Beyond Empowerment by Doug Kirkpatrick.",
      link: "https://x.com/0xUrbanika/status/1615742203132841986?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1615742203132841986%7Ctwgr%5Ebe0a14176b69b0c1759fb2192c72d0e160f5cd09%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc",
    },
    {
      title: "Entangled Life by Merlin Sheldrake.",
      link: "https://x.com/0xUrbanika/status/1616466725414780933?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1616466725414780933%7Ctwgr%5Ebe0a14176b69b0c1759fb2192c72d0e160f5cd09%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Furbanika.notion.site%2FUrbanika-304277770b0e418ea279548983c3c0db%3Fp%3Dd683ea8d7b354d34bde3a675b37f4dfbpm%3Dc",
    },
    {
      title: "Why Public Goods are not as good as we think.",
      link: "https://mirror.xyz/urbanika.eth/EaCBteNZZ-hbJTBkERvYcORdQralhUA7sN5TLAudYzk",
    },
  ];

  const videos = [
    {
        title: "Episode 1: A journey into the Commonverse.",
        link: "https://youtu.be/1m4CDZOU3oQ"
    },
    {
        title: "Episode 2: The value of Well-being.",
        link: "https://www.youtube.com/watch?v=3E5WFB4zGbU"
    },
    {
        title: "Episode 3: What are the Commons?",
        link: "https://www.youtube.com/watch?v=5lu2okHFrkA&t=10s"
    },
    {
        title: "Episode 4: Property and the Nidiacl Garden.",
        link: "https://youtu.be/pONy6o4y8M8"
    },
    {
        title: "Episode 5: History of the Urban Commons.",
        link: "https://www.youtube.com/watch?v=vec0qaVssnE"
    },
    {
        title: "Episode 6: Rethinking property.",
        link: "https://youtu.be/DXsYAdpE9LU"
    },
    {
        title: "Episode 7: The triad of Commoning.",
        link: "https://youtu.be/rzD0NwYh_eY"
    },
    {
        title: "Episode 8: Do the patterns of commoning constitute some form of economics?",
        link: "https://youtu.be/9xqYOXW4S0k"
    },
    {
        title: "Episode 9: The patterns in Peer Governance.",
        link: "https://youtu.be/IzFD_Cdp9v4"
    },
    {
        title: "Episode 10: Keep commons and commerce distinct.",
        link: "https://youtu.be/giqo39jchE0"
    },
    {
        title: "Decades of Commoning in a nutshell: a video-course.",
        link: ""
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-gray-800">The PostCapitalist ontoshift</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          To accelerate and ensure the transition towards a fair, free and alive future you need to start with yourself. These lessons were created to support you in your journey as a changemaker.
        </p>
      </div>

      {/* Courses Section */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="font-semibold text-lg text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <a href={course.link}>
            <button className="text-pink-500 mt-3 hover:text-pink-600">Go to the course</button>
            </a>
          </div>
        ))}
      </div>

      {/* Micro-learning Section */}
      <div className="text-center space-y-2 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">No time for taking a complete course?</h2>
        <p className="text-xl text-gray-700">Jump into micro-learning!</p>
      </div>

      {/* Threads Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Threads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threads.map((thread, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200"
            >
              <h3 className="font-medium text-gray-800">{thread.title}</h3>
              <a href={thread.link}></a>
              <button className="text-pink-500 mt-2 hover:text-pink-600">Read thread here</button>
            </div>
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <h2 className="text-xl text-center font-semibold text-gray-800">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200"
            >
                <a href={video.link}>
              <h3 className="text-gray-800">{video.title}</h3>
                </a>
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCapitalistOntoshift;