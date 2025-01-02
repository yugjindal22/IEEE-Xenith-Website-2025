import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  return (
    <header className='header'>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='w-8 h-8 object-contain' />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-grey-600" : "text-white" }>
          About
        </NavLink>
        <NavLink to='/timeline' className={({ isActive }) => isActive ? "text-grey-600" : "text-white"}>
          Timeline
        </NavLink>
        <NavLink to='/events' className={({ isActive }) => isActive ? "text-grey-600" : "text-white"}>
          Events
        </NavLink>
        <NavLink to='/gallery' className={({ isActive }) => isActive ? "text-grey-600" : "text-white"}>
          Gallery
        </NavLink>
        <NavLink to='/team' className={({ isActive }) => isActive ? "text-grey-600" : "text-white"}>
          Team
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-grey-600" : "text-white"}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
