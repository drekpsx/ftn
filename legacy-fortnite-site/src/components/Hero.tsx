import React from 'react';
import { Star, Shield, Users, Zap, Crown, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section id="accueil" className="relative py-24 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-6 py-2 mb-8">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              BOUTIQUE PREMIUM #1 FRANCE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            COMPTES
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
              FORTNITE
            </span>
            <span className="text-4xl md:text-5xl text-yellow-400">PREMIUM</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Découvre des comptes Fortnite <span className="text-blue-400 font-bold">ultra-rares</span> avec les skins les plus 
            <span className="text-purple-400 font-bold"> exclusifs</span>. Transactions 100% sécurisées, 
            <span className="text-pink-400 font-bold"> livraison instantanée</span>, satisfaction garantie !
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-sm text-blue-300 font-semibold">SÉCURISÉ</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">5MIN</div>
              <div className="text-sm text-purple-300 font-semibold">LIVRAISON</div>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <Users className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">847+</div>
              <div className="text-sm text-pink-300 font-semibold">CLIENTS</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">4.9/5</div>
              <div className="text-sm text-yellow-300 font-semibold">ÉTOILES</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#comptes"
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Crown className="h-6 w-6 relative z-10" />
              <span className="relative z-10">VOIR LES COMPTES</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </a>
            
            <a
              href="#avis"
              className="group inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              <Award className="h-6 w-6" />
              <span>VOIR LES AVIS</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Garantie 30 jours</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">PayPal sécurisé</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Support 24/7</span>
            </div>
            <div className="flex items-center space-x-2 text-pink-400">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Comptes légitimes</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;