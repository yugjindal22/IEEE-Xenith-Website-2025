import React from 'react'
import './About.css';
import Confetti from "react-confetti-boom";
import { useState } from "react";

const About = () => {
  return (
    <div className='bg'>
      <h1 className='head'>About us</h1>
      <p>
      In recent years, we've realised the transformative power of technology, propelling ventures to remarkable heights. Fueled 
      by curiosity, IEEE Student Branch of JIIT Noida presents Xenith’25 - ‘The Shard of Frost’, our flagship event. This annual 
      technical fest is a vibrant showcase of innovation and skill-building, inviting students to embrace new challenges and 
      cultivate confidence. With the 'The Shard of Frost' theme, Xenith'25 invites you to delve into the unknown, pushing 
      boundaries and unlocking hidden potential. Embark on a journey of self-discovery, fasten your safety jackets, and join us 
      for an exhilarating exploration into the enigma!
      </p>
    </div>
  )
}

export default About;
