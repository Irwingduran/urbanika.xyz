import React from 'react';

const PostCapitalistOntoshift = () => {
  const courses = [
    {
      title: "Complete practical course about the Commons",
      description: "What is postCapitalism and why is it a key perspective to get out of the meta-crisis we are living in? It is one of many questions you will solve in this course (...)",
    },
    {
      title: "Full Introductory course on Conflict Resolution",
      description: "This complete course of 5 weeks takes you into the path of becoming a professional moderator of any virtual or real community (...)",
    },
    {
      title: "Blockchain tech for Impact Communities",
      description: "This is a full course that takes you from understanding what is the difference between Web3 and the Web 2.0 to opening a DAO and using decentralized tools (...)",
    },
  ];

  const threads = [
    {
      title: "The Commoner's Catalog for Changemakers by David Bollier.",
      link: "Read thread here.",
    },
    {
      title: "Beyond Empowerment by Doug Kirkpatrick.",
      link: "Read thread here.",
    },
    {
      title: "Entangled Life by Merlin Sheldrake.",
      link: "Read thread here.",
    },
    {
      title: "Why Public Goods are not as good as we think.",
      link: "Read thread here.",
    },
  ];

  const videos = [
    "Episode 1: A journey into the Commonverse.",
    "Episode 2: The value of Well-being.",
    "Episode 3: What are the Commons?",
    "Episode 4: Property and the Nidiacl Garden.",
    "Episode 5: History of the Urban Commons.",
    "Episode 6: Rethinking property.",
    "Episode 7: The triad of Commoning.",
    "Episode 8: Do the patterns of commoning constitute some form of economics?",
    "Episode 9: The patterns in Peer Governance.",
    "Episode 10: Keep commons and commerce distinct.",
    "Decades of Commoning in a nutshell: a video-course",
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
            <button className="text-pink-500 mt-3 hover:text-pink-600">Go to the course</button>
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
              <button className="text-pink-500 mt-2 hover:text-pink-600">{thread.link}</button>
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
              <p className="text-gray-800">{video}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCapitalistOntoshift;