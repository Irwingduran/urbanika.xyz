import { useState, useEffect } from 'react';
import { Play, MessageCircle, Zap, Star, Share2, Heart, Users, Bell, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

// Define types for the multimedia content
type ContentType = 'video' | 'podcast' | 'interactive' | 'instagram';

interface BaseContent {
  id: number;
  type: ContentType;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  featured?: boolean;
}

interface VideoContent extends BaseContent {
  type: 'video';
  duration: string;
  views: string;
  series?: string;
}

interface PodcastContent extends BaseContent {
  type: 'podcast';
  duration: string;
  plays: string;
  guest?: string;
}

interface InteractiveContent extends BaseContent {
  type: 'interactive';
  interactions: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface InstagramContent extends BaseContent {
  type: 'instagram';
  url: string;
  postId: string;
}

type ContentItem = VideoContent | PodcastContent | InteractiveContent | InstagramContent;

interface Playlist {
  title: string;
  description: string;
  content: ContentItem[];
}

interface MultimediaContent {
  featured: Playlist;
  videos: Playlist;
  podcasts: Playlist;
  interactive: Playlist;
  social: Playlist;
}

const InstagramEmbed = ({ postId }: { postId: string }) => {
  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, manually process new embeds
      (window as any).instgrm.Embeds.process();
    }
  }, [postId]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`https://www.instagram.com/reel/${postId}/`}
      data-instgrm-version="14"
      style={{
        background: '#FFF',
        border: '0',
        borderRadius: '3px',
        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '1px',
        maxWidth: '540px',
        minWidth: '326px',
        padding: '0',
        width: '99.375%',
        width: '-webkit-calc(100% - 2px)',
        width: 'calc(100% - 2px)'
      }}
    >
      <div style={{ padding: '16px' }}>
        <a
          href={`https://www.instagram.com/reel/${postId}/`}
          style={{
            background: '#FFFFFF',
            lineHeight: '0',
            padding: '0 0',
            textAlign: 'center',
            textDecoration: 'none',
            width: '100%'
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: '50%',
                flexGrow: '0',
                height: '40px',
                marginRight: '14px',
                width: '40px'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'center' }}>
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '4px',
                  flexGrow: '0',
                  height: '14px',
                  marginBottom: '6px',
                  width: '100px'
                }}
              />
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '4px',
                  flexGrow: '0',
                  height: '14px',
                  width: '60px'
                }}
              />
            </div>
          </div>
          <div style={{ padding: '19% 0' }} />
          <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
            <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                  <g>
                    <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div style={{ paddingTop: '8px' }}>
            <div style={{ color: '#3897f0', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: '550', lineHeight: '18px' }}>
              View this post on Instagram
            </div>
          </div>
          <div style={{ padding: '12.5% 0' }} />
          <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '14px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '50%',
                  height: '12.5px',
                  width: '12.5px',
                  transform: 'translateX(0px) translateY(7px)'
                }}
              />
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  height: '12.5px',
                  transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                  width: '12.5px',
                  flexGrow: '0',
                  marginRight: '14px',
                  marginLeft: '2px'
                }}
              />
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '50%',
                  height: '12.5px',
                  width: '12.5px',
                  transform: 'translateX(9px) translateY(-18px)'
                }}
              />
            </div>
            <div style={{ marginLeft: '8px' }}>
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '50%',
                  flexGrow: '0',
                  height: '20px',
                  width: '20px'
                }}
              />
              <div
                style={{
                  width: '0',
                  height: '0',
                  borderTop: '2px solid transparent',
                  borderLeft: '6px solid #f4f4f4',
                  borderBottom: '2px solid transparent',
                  transform: 'translateX(16px) translateY(-4px) rotate(30deg)'
                }}
              />
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div
                style={{
                  width: '0px',
                  borderTop: '8px solid #F4F4F4',
                  borderRight: '8px solid transparent',
                  transform: 'translateY(16px)'
                }}
              />
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  flexGrow: '0',
                  height: '12px',
                  width: '16px',
                  transform: 'translateY(-4px)'
                }}
              />
              <div
                style={{
                  width: '0',
                  height: '0',
                  borderTop: '8px solid #F4F4F4',
                  borderLeft: '8px solid transparent',
                  transform: 'translateY(-4px) translateX(8px)'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'center', marginBottom: '24px' }}>
            <div
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: '4px',
                flexGrow: '0',
                height: '14px',
                marginBottom: '6px',
                width: '224px'
              }}
            />
            <div
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: '4px',
                flexGrow: '0',
                height: '14px',
                width: '144px'
              }}
            />
          </div>
        </a>
        <p
          style={{
            color: '#c9c8cd',
            fontFamily: 'Arial,sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            marginBottom: '0',
            marginTop: '8px',
            overflow: 'hidden',
            padding: '8px 0 7px',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <a
            href={`https://www.instagram.com/reel/${postId}/`}
            style={{
              color: '#c9c8cd',
              fontFamily: 'Arial,sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 'normal',
              lineHeight: '17px',
              textDecoration: 'none'
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            A post shared by @instagram
          </a>
        </p>
      </div>
    </blockquote>
  );
};

const MultimediaHubSection = () => {
  const [activePlayer, setActivePlayer] = useState<number | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<keyof MultimediaContent>('featured');

  const multimediaContent: MultimediaContent = {
    featured: {
      title: "Featured Content",
      description: "Our most impactful stories and insights",
      content: [
        {
          id: 1,
          type: "video",
          title: "The Future of Urban Governance",
          description: "A deep dive into how blockchain and AI are transforming city management",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "12:34",
          views: "15.2K",
          category: "Governance",
          featured: true,
        },
        {
          id: 2,
          type: "podcast",
          title: "Voices from the Commons",
          description: "Community leaders share their transformation stories",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "28:15",
          plays: "8.7K",
          category: "Community",
          featured: true,
        },
        {
          id: 3,
          type: "interactive",
          title: "Smart City Simulator",
          description: "Experience urban planning decisions in real-time",
          thumbnail: "/placeholder.svg?width=400&height=225",
          interactions: "3.1K",
          category: "Technology",
          featured: true,
        },
      ],
    },
    videos: {
      title: "Video Library",
      description: "Visual stories of urban transformation",
      content: [
        {
          id: 4,
          type: "video",
          title: "Episode 1: A Journey into the Commonverse",
          description: "Introduction to commons-based urban governance",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "15:42",
          views: "22.1K",
          category: "Education",
          series: "Commonverse",
        },
        {
          id: 5,
          type: "video",
          title: "Episode 2: The Value of Well-being",
          description: "How cities can prioritize citizen happiness",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "18:30",
          views: "18.5K",
          category: "Education",
          series: "Commonverse",
        },
        {
          id: 6,
          type: "video",
          title: "Bus Transformation Timelapse",
          description: "Watch our mobile showroom come to life",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "3:45",
          views: "45.3K",
          category: "Behind the Scenes",
        },
        {
          id: 7,
          type: "video",
          title: "Mexico City Success Story",
          description: "How participatory budgeting changed a neighborhood",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "11:20",
          views: "12.8K",
          category: "Case Study",
        },
      ],
    },
    podcasts: {
      title: "Audio Stories",
      description: "In-depth conversations with urban innovators",
      content: [
        {
          id: 8,
          type: "podcast",
          title: "Beyond Empowerment with Doug Kirkpatrick",
          description: "Exploring self-management in urban contexts",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "45:20",
          plays: "12.3K",
          category: "Leadership",
          guest: "Doug Kirkpatrick",
        },
        {
          id: 9,
          type: "podcast",
          title: "Entangled Life by Merlin Sheldrake",
          description: "Nature's networks inspiring urban design",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "38:15",
          plays: "9.7K",
          category: "Sustainability",
          guest: "Merlin Sheldrake",
        },
        {
          id: 10,
          type: "podcast",
          title: "The Commons Catalog for Changemakers",
          description: "Tools and resources for community organizers",
          thumbnail: "/placeholder.svg?width=400&height=225",
          duration: "32:45",
          plays: "15.1K",
          category: "Tools",
          guest: "David Bollier",
        },
      ],
    },
    interactive: {
      title: "Interactive Experiences",
      description: "Immersive content you can explore and engage with",
      content: [
        {
          id: 11,
          type: "interactive",
          title: "DecidimOS Demo Platform",
          description: "Try our governance platform with sample community data",
          thumbnail: "/placeholder.svg?width=400&height=225",
          interactions: "5.2K",
          category: "Demo",
          difficulty: "Beginner",
        },
        {
          id: 12,
          type: "interactive",
          title: "Urban Planning Challenge",
          description: "Design a sustainable neighborhood with limited resources",
          thumbnail: "/placeholder.svg?width=400&height=225",
          interactions: "3.8K",
          category: "Game",
          difficulty: "Intermediate",
        },
        {
          id: 13,
          type: "interactive",
          title: "Circular Economy Calculator",
          description: "Measure your community's sustainability impact",
          thumbnail: "/placeholder.svg?width=400&height=225",
          interactions: "7.1K",
          category: "Tool",
          difficulty: "Beginner",
        },
        {
          id: 14,
          type: "interactive",
          title: "Virtual Bus Tour",
          description: "360° exploration of our mobile showroom",
          thumbnail: "/placeholder.svg?width=400&height=225",
          interactions: "18.9K",
          category: "Virtual Tour",
          difficulty: "Beginner",
        },
      ],
    },
    social: {
      title: "Social Highlights",
      description: "Our latest Instagram reels and social content",
      content: [
        {
          id: 15,
          type: "instagram",
          title: "Urban Transformation Story",
          description: "See how we transformed a city block in 30 days",
          thumbnail: "/instagram-placeholder.jpg",
          category: "Transformation",
          url: "https://www.instagram.com/reel/DMCERB0tMsK",
          postId: "DMCERB0tMsK"
        },
        {
          id: 16,
          type: "instagram",
          title: "Community Meeting Highlights",
          description: "Key moments from our latest town hall",
          thumbnail: "/instagram-placeholder.jpg",
          category: "Community",
          url: "https://www.instagram.com/reel/DMGmyKkRpTU",
          postId: "DMGmyKkRpTU"
        }
      ]
    }
  };

  const handlePlay = (contentId: number) => {
    setActivePlayer(activePlayer === contentId ? null : contentId);
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Play className="h-5 w-5" />;
      case "podcast":
        return <MessageCircle className="h-5 w-5" />;
      case "interactive":
        return <Zap className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
    }
  };

  const getContentStats = (content: ContentItem) => {
    switch (content.type) {
      case "video":
        return `${content.views} views • ${content.duration}`;
      case "podcast":
        return `${content.plays} plays • ${content.duration}`;
      case "interactive":
        return `${content.interactions} interactions`;
      case "instagram":
        return "Instagram Reel";
      default:
        return '';
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">🎬 Rich Media Experience</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Multimedia Hub</h2>
          <p className="mt-2 text-lg text-gray-600">
            Explore our stories through videos, podcasts, and interactive experiences
          </p>
        </div>

        <Tabs value={currentPlaylist} onValueChange={(value) => setCurrentPlaylist(value as keyof MultimediaContent)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-100 mb-8">
            <TabsTrigger value="featured" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Star className="mr-2 h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Play className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <MessageCircle className="mr-2 h-4 w-4" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="interactive" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Zap className="mr-2 h-4 w-4" />
              Interactive
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Instagram className="mr-2 h-4 w-4" />
              Social
            </TabsTrigger>
          </TabsList>

          {Object.entries(multimediaContent).map(([key, playlist]) => (
            <TabsContent key={key} value={key}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-2">{playlist.title}</h3>
                <p className="text-gray-600">{playlist.description}</p>
              </div>

              {/* Featured Content Layout */}
              {key === "featured" && (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Featured Item */}
                  <div className="lg:col-span-2">
                    <Card className="bg-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
                      <div className="relative">
                        {playlist.content[0].type === 'instagram' ? (
                          <InstagramEmbed postId={(playlist.content[0] as InstagramContent).postId} />
                        ) : (
                          <>
                            <Image
                              src={playlist.content[0].thumbnail || "/placeholder.svg"}
                              width={800}
                              height={450}
                              alt={playlist.content[0].title}
                              className="w-full h-64 md:h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <button
                              onClick={() => handlePlay(playlist.content[0].id)}
                              className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all"
                            >
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                {getContentIcon(playlist.content[0].type)}
                              </div>
                            </button>
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-brand-yellow text-brand-dark">Featured</Badge>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                              {playlist.content[0].type === 'video' || playlist.content[0].type === 'podcast' 
                                ? (playlist.content[0] as VideoContent | PodcastContent).duration 
                                : `${(playlist.content[0] as InteractiveContent).interactions} interactions`}
                            </div>
                          </>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-2 bg-purple-100 text-purple-700">{playlist.content[0].category}</Badge>
                        <h4 className="text-xl font-bold text-brand-dark mb-2">{playlist.content[0].title}</h4>
                        <p className="text-gray-600 mb-4">{playlist.content[0].description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{getContentStats(playlist.content[0])}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button size="sm" className="bg-purple-500 text-white hover:bg-purple-600">
                              {playlist.content[0].type === 'video' ? 'Watch Now' : 
                               playlist.content[0].type === 'podcast' ? 'Listen Now' :
                               playlist.content[0].type === 'instagram' ? 'View Post' : 'Try Now'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Side Featured Items */}
                  <div className="space-y-6">
                    {playlist.content.slice(1).map((content) => (
                      <Card
                        key={content.id}
                        className="bg-white shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                        onClick={() => handlePlay(content.id)}
                      >
                        <div className="flex gap-4 p-4">
                          <div className="relative flex-shrink-0">
                            {content.type === 'instagram' ? (
                              <div className="w-30 h-20 bg-gray-100 rounded flex items-center justify-center">
                                <Instagram className="h-8 w-8 text-gray-400" />
                              </div>
                            ) : (
                              <>
                                <Image
                                  src={content.thumbnail || "/placeholder.svg"}
                                  width={120}
                                  height={80}
                                  alt={content.title}
                                  className="w-30 h-20 object-cover rounded"
                                />
                                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all rounded">
                                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                    {getContentIcon(content.type)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge className="mb-1 bg-gray-100 text-gray-700 text-xs">{content.category}</Badge>
                            <h5 className="font-semibold text-brand-dark text-sm mb-1 line-clamp-2">{content.title}</h5>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{content.description}</p>
                            <span className="text-xs text-gray-500">{getContentStats(content)}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid Layout for Other Tabs */}
              {key !== "featured" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlist.content.map((content) => (
                    <Card
                      key={content.id}
                      className="bg-white shadow-lg hover:shadow-xl transition-all group cursor-pointer overflow-hidden"
                      onClick={() => handlePlay(content.id)}
                    >
                      <div className="relative">
                        {content.type === 'instagram' ? (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <InstagramEmbed postId={(content as InstagramContent).postId} />
                          </div>
                        ) : (
                          <>
                            <Image
                              src={content.thumbnail || "/placeholder.svg"}
                              width={400}
                              height={225}
                              alt={content.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all">
                              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                {getContentIcon(content.type)}
                              </div>
                            </div>
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-black/70 text-white text-xs">{content.category}</Badge>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              {content.type === 'video' || content.type === 'podcast' 
                                ? (content as VideoContent | PodcastContent).duration 
                                : `${(content as InteractiveContent).interactions} interactions`}
                            </div>
                          </>
                        )}
                        {content.type === 'video' && 'series' in content && content.series && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-brand-aqua text-white text-xs">{content.series}</Badge>
                          </div>
                        )}
                        {content.type === 'interactive' && content.difficulty && (
                          <div className="absolute top-3 right-3">
                            <Badge
                              className={`text-xs ${
                                content.difficulty === "Beginner"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {content.difficulty}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-brand-dark mb-2 line-clamp-2">{content.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
                        {content.type === 'podcast' && content.guest && (
                          <p className="text-brand-aqua text-sm mb-2">Guest: {content.guest}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{getContentStats(content)}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Call to Action */}
              <Card className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                <CardContent className="p-8 text-center">
                  <h4 className="text-xl font-bold text-brand-dark mb-2">Want to Create Content With Us?</h4>
                  <p className="text-gray-600 mb-6">
                    Share your urban innovation story or collaborate on multimedia projects
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-purple-500 text-white hover:bg-purple-600">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Pitch Your Story
                    </Button>
                    <Button variant="outline" className="border-purple-300 text-purple-700 bg-transparent">
                      <Users className="mr-2 h-4 w-4" />
                      Join Creator Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Subscription CTA */}
        <Card className="mt-16 bg-gradient-to-r from-brand-aqua/10 to-brand-yellow/10 border-brand-aqua/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-brand-dark mb-4">Never Miss New Content</h3>
            <p className="text-gray-600 mb-6">
              Get notified when we release new videos, podcasts, and interactive experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="bg-brand-aqua text-white hover:bg-teal-600">
                <Bell className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Join 12,000+ subscribers • Unsubscribe anytime</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MultimediaHubSection;