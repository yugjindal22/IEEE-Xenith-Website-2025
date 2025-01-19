import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { name, email, message });

    setIsSubmitting(false);
    setSubmitMessage('Thank you for your message. We\'ll get back to you soon!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Feel free to get in touch with us using the form or our contact information below.</p>
        {/* <div className="info-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>123 Main St, Anytown, USA 12345</span>
        </div>
        <div className="info-item">
          <i className="fas fa-phone"></i>
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="info-item">
          <i className="fas fa-envelope"></i>
          <span>contact@example.com</span>
        </div> */}
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
      <div className="contact-form-container">
        <h3>Send us a message</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button className='submit-button' type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </div>
    </div>
  );
};

export default Contact;
