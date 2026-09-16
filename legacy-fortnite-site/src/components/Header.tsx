import React, { useState } from 'react';
import { Menu, X, Shield, Star, Zap } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl font-black text-white">X</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
            </div>
            <div>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                xth3o
              </span>
              <div className="flex items-center space-x-1 -mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-semibold">EN LIGNE</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#accueil" className="text-white hover:text-blue-400 transition-all duration-300 font-semibold relative group">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#comptes" className="text-white hover:text-purple-400 transition-all duration-300 font-semibold relative group">
              Comptes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#avis" className="text-white hover:text-pink-400 transition-all duration-300 font-semibold relative group">
              Avis
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#faq" className="text-white hover:text-blue-400 transition-all duration-300 font-semibold relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-white hover:text-purple-400 transition-all duration-300 font-semibold relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-3 py-2 rounded-lg border border-yellow-400/30">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-yellow-400">4.9/5</span>
              <span className="text-xs text-gray-300">(247 avis)</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400/20 to-blue-400/20 px-3 py-2 rounded-lg border border-green-400/30">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400">LIVRAISON 5MIN</span>
            </div>
          </div>

          <button
            className="md:hidden text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-purple-500/30">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <a href="#accueil" className="block px-4 py-3 text-white hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
              Accueil
            </a>
            <a href="#comptes" className="block px-4 py-3 text-white hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all">
              Comptes
            </a>
            <a href="#avis" className="block px-4 py-3 text-white hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all">
              Avis
            </a>
            <a href="#faq" className="block px-4 py-3 text-white hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
              FAQ
            </a>
            <a href="#contact" className="block px-4 py-3 text-white hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;