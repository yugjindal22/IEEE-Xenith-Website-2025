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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className='header'>
      <div className='flex items-center'>
        <div className='text-black mr-4 text-xl font-bold'>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
        <NavLink to='/'>
          <img src={logo} alt='logo' className='w-8 h-8 object-contain invert' />
        </NavLink>
      </div>
      <nav className='flex text-lg gap-7 font-medium'>
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-grey-600" : "text-black" }>
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
    </header>
  );
};

export default Navbar;
