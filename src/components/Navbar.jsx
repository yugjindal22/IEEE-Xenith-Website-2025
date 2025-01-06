import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { logo } from "../assets/images";

const Navbar = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date("2025-02-02T00:00:00");
    const currentTime = new Date();
    const difference = eventDate - currentTime;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className='header relative'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center'>
          <div className='text-black mr-4 text-xl font-bold'>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
          <NavLink to='/'>
            <img src={logo} alt='logo' className='w-8 h-8 object-contain invert' />
          </NavLink>
        </div>
        <button 
          className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className='hidden md:flex text-lg gap-7 font-medium'>
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          About
        </NavLink>
        <NavLink to='/timeline' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          Timeline
        </NavLink>
        <NavLink to='/events' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          Events
        </NavLink>
        <NavLink to='/gallery' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          Gallery
        </NavLink>
        <NavLink to='/team' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          Team
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-grey-600" : "text-black"}>
          Contact
        </NavLink>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <div className={`
        md:hidden 
        absolute 
        top-full 
        right-0 
        w-48 
        bg-white 
        shadow-lg 
        rounded-lg 
        py-2 
        mt-2
        transition-all 
        duration-200 
        transform 
        origin-top-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        <nav className='flex flex-col text-sm'>
          <NavLink 
            to='/about' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink 
            to='/timeline' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Timeline
          </NavLink>
          <NavLink 
            to='/events' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Events
          </NavLink>
          <NavLink 
            to='/gallery' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Gallery
          </NavLink>
          <NavLink 
            to='/team' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Team
          </NavLink>
          <NavLink 
            to='/contact' 
            className={({ isActive }) => 
              `px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${isActive ? 'text-gray-600' : 'text-black'}`
            }
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
