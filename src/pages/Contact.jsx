import React, { useRef, useState } from 'react';
import './Contact.css';
import { sendForm } from '@emailjs/browser';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Send the form data to your email service
    try {
      await sendForm('service_mlcdhfm', 'template_5mf5u7e', formRef.current, import.meta.env.VITE_EMAILJS_USER_ID);
    } catch (error) {
      console.error('Failed to send the form:', error);
      setIsSubmitting(false);
      setSubmitMessage('Failed to send the form. Please try again later.');
      return;
    }

    
    // Simulate form submission
    // await new Promise(resolve => setTimeout(resolve, 2000));


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
        <form onSubmit={handleSubmit} ref={formRef} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name='name'
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
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name='message'
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
