

import React, { useState, useEffect } from 'react';
import Confetti from "react-confetti-boom";


import './Team.css'; 

function TeamSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Team Section</title>
                <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+SA:wght@100..400&family=Playwrite+VN:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;600&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Gwendolyn:wght@400;700&family=Playwrite+AU+SA:wght@100..400&family=Playwrite+VN:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;500&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Cookie&family=Gwendolyn:wght@400;700&family=Playwrite+AU+SA:wght@100..400&family=Playwrite+VN:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            </head>
            <div className="team-section">
                <div className="team-container">
                    <h2 className="team-title">ORGANIZING TEAM</h2>
                    
                    <div className="team-grid">
                        {!isMobile ? (
                            <>
                                <div className="team-row">
                                    <div className="team-member-card wave-animation" style={{ '--i': 1 }}>
                                        <img src="core_images\vimarsh_mishra.png" alt="Team member 1" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name"><br />Vimarsh<br />Mishra</h3>
                                            <p className="team-member-position">Chairperson</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 2 }}>
                                        <img src="core_images\Devanshi Mishra.jpeg" alt="Team member 2" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Devanshi <br /> Mishra</h3>
                                            <p className="team-member-position">Vice<br />Chairperson</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 3 }}>
                                        <img src="core_images\krishna2.JPG" alt="Team member 3" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Krishna<br />Agrawal</h3>
                                            <p className="team-member-position">Organizing<br />Secretary</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 4 }}>
                                        <img src="core_images\gaurav2.jpg" alt="Team member 4" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Gaurav<br />Agarwal</h3>
                                            <p className="team-member-position">Treasurer</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 5 }}>
                                        <img src="core_images\IMG_6971.JPG" alt="Team member 5" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Pankhuri<br />Asthana</h3>
                                            <p className="team-member-position">WIE Head</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-row">
                                    <div className="team-member-card wave-animation" style={{ '--i': 6 }}>
                                        <img src="core_images\muskaan.png" alt="Team member 6" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Muskaan<br />Singhal</h3>
                                            <p className="team-member-position">Strategic<br />Head</p>
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="team-member-card wave-animation" style={{ '--i': 8 }}>
                                        <img src="core_images\aman.png" alt="Team member 8" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Aman Singh</h3>
                                            <p className="team-member-position">Tech CSE<br />Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 9 }}>
                                        <img src="core_images\NikhilMittal.jpg" alt="Team member 9" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Nikhil<br />Mittal</h3>
                                            <p className="team-member-position">Tech ECE<br /> Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 10 }}>
                                        <img src="core_images\IMG_2208.jpg" alt="Team member 10" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Omar<br />Shahab</h3>
                                            <p className="team-member-position">Digital Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 11 }}>
                                        <img src="core_images\aditya.jpg" alt="Team member 11" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Aditya Patil</h3>
                                            <p className="team-member-position-ad" >Cinematography<br />Head</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="team-row">
                                    <div className="team-member-card wave-animation" style={{ '--i': 12 }}>
                                        <img src="core_images\muskanasthana.jpeg" alt="Team member 12" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Muskan<br />Asthana</h3>
                                            <p className="team-member-position">Marketing<br />Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 13 }}>
                                        <img src="core_images\Suhani Gupta.jpeg" alt="Team member 13" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Suhani <br />Gupta</h3>
                                            <p className="team-member-position">Public<br />Relations<br />Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 14 }}>
                                        <img src="core_images/Sneha_Tyagi.jpg" alt="Team member 14" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Sneha Tyagi</h3>
                                            <p className="team-member-position">Management<br />Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 15 }}>
                                        <img src="core_images\Kavya Gauri.jpg" alt="Team member 15" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Kavya <br />Gupta</h3>
                                            <p className="team-member-position">Creative<br />Head</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 16 }}>
                                        <img src="core_images\Abhinav.jpg" alt="Team member 16" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Abhinav<br />Mishra</h3>
                                            <p className="team-member-position">Webmaster</p>
                                        </div>
                                    </div>
                                    <div className="team-member-card wave-animation" style={{ '--i': 16 }}>
                                        <img src="core_images\Vanisha Agarwal_.jpg" alt="Team member 16" className="team-member-image" />
                                        <div className="team-member-info">
                                            <h3 className="team-member-name">Vanisha<br />Agarwal</h3>
                                            <p className="team-member-position">Campus<br />Outreach<br />Head</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mobile-team-grid">
        <div className="team-member-card wave-animation" style={{ '--i': 1 }}>
            <img src="core_images/vimarsh_mishra.png" alt="Team member 1" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name"><br />Vimarsh<br />Mishra</h3>
                <p className="team-member-position">Chairperson</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 2 }}>
            <img src="core_images\Devanshi Mishra.jpeg" alt="Team member 2" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Devanshi <br /> Mishra</h3>
                <p className="team-member-position">Vice<br />Chairperson</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 3 }}>
            <img src="core_images\krishna2.JPG" alt="Team member 3" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Krishna<br />Agrawal</h3>
                <p className="team-member-position">Organizing<br />Secretary</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 4 }}>
            <img src="core_images\gaurav2 - Copy.jpg" alt="Team member 4" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Gaurav<br />Agarwal</h3>
                <p className="team-member-position">Treasurer</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 5 }}>
            <img src="core_images\IMG_6971.JPG" alt="Team member 5" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Pankhuri<br />Asthana</h3>
                <p className="team-member-position">WIE Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 6 }}>
            <img src="core_images\muskaan.png" alt="Team member 6" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Muskaan<br />Singhal</h3>
                <p className="team-member-position">Strategic<br />Head</p>
            </div>
        </div>
        
        <div className="team-member-card wave-animation" style={{ '--i': 8 }}>
            <img src="core_images\aman.png" alt="Team member 8" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Aman Singh</h3>
                <p className="team-member-position">Tech CSE<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 9 }}>
            <img src="core_images\NikhilMittal.jpg" alt="Team member 9" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Nikhil Mittal</h3>
                <p className="team-member-position">Tech ECE<br /> Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 10 }}>
            <img src="core_images\IMG_2208.jpg" alt="Team member 10" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Omar<br />Shahab</h3>
                <p className="team-member-position">Digital <br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 11 }}>
            <img src="core_images\aditya.jpg" alt="Team member 11" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Aditya Patil</h3>
                <p className="team-member-position-ads">Cinematography<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 12 }}>
            <img src="core_images\muskan.png" alt="Team member 12" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Muskan<br />Asthana</h3>
                <p className="team-member-position">Marketing<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 13 }}>
            <img src="core_images\Suhani Gupta.jpeg" alt="Team member 13" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Suhani<br /> Gupta</h3>
                <p className="team-member-position">Public<br />Relations<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 14 }}>
            <img src="core_images\Sneha_Tyagi.jpg" alt="Team member 14" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Sneha Tyagi</h3>
                <p className="team-member-position">Management<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 15 }}>
            <img src="core_images\Kavya Gauri.jpg" alt="Team member 15" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Kavya<br /> Gupta</h3>
                <p className="team-member-position">Creative<br />Head</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 16 }}>
            <img src="core_images\Abhinav.jpg" alt="Team member 16" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Abhinav<br />Mishra</h3>
                <p className="team-member-position">Webmaster</p>
            </div>
        </div>
        <div className="team-member-card wave-animation" style={{ '--i': 17 }}>
            <img src="core_images\Vanisha Agarwal_.jpg" alt="Team member 17" className="team-member-image" />
            <div className="team-member-info">
                <h3 className="team-member-name">Vanisha<br />Agarwal</h3>
                <p className="team-member-position">Campus<br />Outreach<br />Head</p>
            </div>
        </div>
    </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TeamSection;
