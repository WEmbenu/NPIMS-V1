import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            &copy; {currentYear} National Police Information Management System
            (NPIMS)
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-primary-600"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-primary-600"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-primary-600"
            >
              Help & Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
