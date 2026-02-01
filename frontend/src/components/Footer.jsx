import React from 'react';
import { BookOpen, Github, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'Discover', href: '/discover' },
        { label: 'Lists', href: '/lists' },
        { label: 'Community', href: '/community' }
      ]
    },
    {
      title: 'Account',
      links: [
        { label: 'My Books', href: '/my-books' },
        { label: 'Profile', href: '/profile' },
        { label: 'Sign In', href: '/auth' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help', href: '#help' },
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Mail, href: '#contact', label: 'Contact' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-amber-600 transition-colors">
                Booky
              </Link>
            </div>
            <p className="text-sm text-gray-600">A modern platform to track, discover, and discuss the books you love.</p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-600">© {currentYear} Booky - Made with ❤️ for book lovers</p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.label}
                    href={social.href} 
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-amber-600 hover:border-amber-600 hover:shadow-md transition-all duration-300"
                    title={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
