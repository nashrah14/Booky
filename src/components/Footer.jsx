import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
  <footer className="bg-orange-50 border-t mt-8">


      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-7 w-7 text-amber-600" />
              <Link to="/" className="text-xl font-bold text-gray-900">Booky</Link>
            </div>
            <p className="text-sm text-gray-600">A simple place to track, discover and discuss books you love.</p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Explore</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><Link to="/discover" className="hover:underline">Discover</Link></li>
                <li><Link to="/lists" className="hover:underline">Lists</Link></li>
                <li><Link to="/community" className="hover:underline">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Account</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><Link to="/my-books" className="hover:underline">My Books</Link></li>
                <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                <li><Link to="/auth" className="hover:underline">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Resources</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:underline">Help</a></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Booky — Made with ❤️</p>
          <div className="mt-3 sm:mt-0 flex items-center space-x-4">
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">GitHub</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
