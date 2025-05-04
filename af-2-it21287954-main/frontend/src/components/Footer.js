// frontend/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Country Explorer</h3>
            <p className="text-sm">Explore countries around the world</p>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Country Explorer</p>
            <p className="text-sm">
              Powered by <a href="https://restcountries.com/" className="text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">REST Countries API</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;