import { Link } from "react-router-dom";
import { arrow } from "../assets/icons";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <div className='backdrop-blur-sm bg-black rounded-lg p-4 max-w-md mx-auto'>
        <h1 className='text-lg text-cyan-300 font-tech tracking-wider text-center mb-2 glowing-text'>
          XENITH'25
        </h1>
        <p className='text-sm text-gray-200 leading-tight text-center'>
          Shard of Frost: IEEE JIIT's technical odyssey of innovation and skill mastery
        </p>
      </div>
    );

  if (currentStage === 2) {
    return (
      <div className='backdrop-blur-sm bg-black rounded-lg p-4 max-w-md mx-auto'>
        <div className='text-cyan-300 font-tech text-lg mb-2 text-center glowing-text'>TIMELINE</div>
        <Link to='/timeline' className='transition-all duration-300 px-4 py-2 text-cyan-300 text-sm flex items-center gap-2 justify-center mx-auto border border-cyan-300/20 hover:border-cyan-300/50 hover:text-cyan-200'>
          Explore
          <img src={arrow} alt='arrow' className='w-3 h-3 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div className='backdrop-blur-sm bg-black rounded-lg p-4 max-w-md mx-auto'>
        <div className='text-cyan-300 font-tech text-lg mb-2 text-center glowing-text'>EVENTS</div>
        <Link to='/events' className='transition-all duration-300 px-4 py-2 text-cyan-300 text-sm flex items-center gap-2 justify-center mx-auto border border-cyan-300/20 hover:border-cyan-300/50 hover:text-cyan-200'>
          Check Them Out
          <img src={arrow} alt='arrow' className='w-3 h-3 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className='backdrop-blur-sm bg-black rounded-lg p-4 max-w-md mx-auto'>
        <div className='text-cyan-300 font-tech text-lg mb-2 text-center glowing-text'>Glimpses</div>
        <Link to='/glimpses' className='transition-all duration-300 px-4 py-2 text-cyan-300 text-sm flex items-center gap-2 justify-center mx-auto border border-cyan-300/20 hover:border-cyan-300/50 hover:text-cyan-200'>
          Memories
          <img src={arrow} alt='arrow' className='w-3 h-3 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 5) {
    return (
      <div className='backdrop-blur-sm bg-black rounded-lg p-4 max-w-md mx-auto'>
        <div className='text-cyan-300 font-tech text-lg mb-2 text-center glowing-text'>Team</div>
        <Link to='/team' className='transition-all duration-300 px-4 py-2 text-cyan-300 text-sm flex items-center gap-2 justify-center mx-auto border border-cyan-300/20 hover:border-cyan-300/50 hover:text-cyan-200'>
          IEEE Team
          <img src={arrow} alt='arrow' className='w-3 h-3 object-contain' />
        </Link>
      </div>
    );
  }
  

  return null;
};

export default HomeInfo;
