import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SmartCitiesFeatures from './components/SmartCitiesFeatures'
import OurStory from './components/OurStory'
import MeetOurTeam from './components/MeetOurTeam'
import ParticipatorySections from './components/ParticipatorySections '
import DecidimOS from './components/DecidimOS'
import CircularEconomy from './components/CircularEconomy'
import UrbanRegeneration from './components/UrbanRegeneration'
import UrbanRegenerationDirectory from './components/UrbanRegenerationDirectory'
import UnderProgress from './components/UnderProgress'
import EducationalResources from './components/EducationalResources'
import PostCapitalistOntoshift from './components/PostCapitalistOntoshift'
import SupportBanner from './components/SupportBanner'
import MainMessage from './components/MainMessage'
import Footer from './components/Footer'

function App() {

  return (
    <>
    <header>
    <Navbar/>
    </header>
    <div id='home'>
    <Hero/>  
    </div>
    <div id='about'>
    <SmartCitiesFeatures/>
    <OurStory/>
    <MeetOurTeam/>
    </div>
    <div>
    <ParticipatorySections/>  
    </div>
    <div id='decidimos'> {/* hero buttom */}
    <DecidimOS/>
    </div>
    <div> {/* pink banner */}
    <CircularEconomy/> 
    </div>
    <div>
    <UrbanRegeneration/>
    <UrbanRegenerationDirectory/>  
    </div>
    <div>
    <UnderProgress/>
    <EducationalResources/>
    </div>
    <div>
    <PostCapitalistOntoshift/>  
    </div>
    <div id='support'>
    <SupportBanner/>  
    <MainMessage/>
    </div>
    <div id='contact'>
    <Footer/>
    </div>
    </>
  )
}

export default App
