import React from 'react';
import { Shield, Mail, MessageCircle, Clock, Crown, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-black to-gray-900 border-t border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">X</span>
              </div>
              <div>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  xth3o
                </span>
                <div className="flex items-center space-x-1 -mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-semibold">BOUTIQUE PREMIUM</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Votre boutique de confiance pour les comptes Fortnite premium en France. 
              Transactions 100% sécurisées, livraison instantanée, satisfaction garantie depuis 2023.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-lg font-bold text-white">847+</div>
                    <div className="text-xs text-blue-300">Clients satisfaits</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <div>
                    <div className="text-lg font-bold text-white">4.9/5</div>
                    <div className="text-xs text-purple-300">Note moyenne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#accueil" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Accueil</span>
                </a>
              </li>
              <li>
                <a href="#comptes" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Comptes disponibles</span>
                </a>
              </li>
              <li>
                <a href="#avis" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                  <span>Avis clients</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>FAQ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact & Support</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-white text-sm font-semibold">Email</div>
                  <div className="text-gray-400 text-xs">t2219552@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-white text-sm font-semibold">Discord</div>
                  <div className="text-gray-400 text-xs">xth3o.dev</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50">
                <Clock className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-white text-sm font-semibold">Support</div>
                  <div className="text-gray-400 text-xs">24/7 Disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 xth3o. Tous droits réservés.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Mentions légales</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 px-3 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400 font-semibold">Paiements sécurisés</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 px-3 py-2 rounded-lg">
                <div className="w-4 h-3 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <span className="text-xs text-blue-400 font-semibold">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
            <p className="text-white font-bold mb-2">🚀 Prêt à dominer Fortnite ?</p>
            <p className="text-gray-300 text-sm mb-4">Rejoignez les 847+ gamers qui nous font confiance</p>
            <a
              href="#comptes"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Crown className="h-5 w-5" />
              <span>VOIR LE COMPTE PREMIUM</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;