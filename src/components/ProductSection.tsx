import React, { useState } from 'react';
import { Star, Shield, Award, Crown, Sword, Users, Zap, CheckCircle } from 'lucide-react';

const ProductSection = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  const rareSkins = [
    { name: "IKONIK", rarity: "Exclusif Samsung", color: "from-purple-500 to-pink-500" },
    { name: "Chevalier Noir", rarity: "Season 2", color: "from-gray-700 to-gray-900" },
    { name: "Renegade Raider", rarity: "Season 1", color: "from-orange-500 to-red-500" },
    { name: "Ghoul Trooper", rarity: "Halloween 2017", color: "from-green-500 to-emerald-500" },
    { name: "Galaxy", rarity: "Samsung Exclusif", color: "from-blue-500 to-purple-500" },
    { name: "Reaper", rarity: "Season 3", color: "from-yellow-500 to-orange-500" }
  ];

  const features = [
    { icon: <Crown className="h-6 w-6" />, title: "252 Skins", description: "Collection complète ultra-rare", color: "text-yellow-400" },
    { icon: <Award className="h-6 w-6" />, title: "15,000 V-Bucks", description: "Monnaie virtuelle incluse", color: "text-blue-400" },
    { icon: <Sword className="h-6 w-6" />, title: "Tous Battle Pass", description: "Saisons 1 à 28 complètes", color: "text-purple-400" },
    { icon: <Star className="h-6 w-6" />, title: "Level 200+", description: "Niveau maximum atteint", color: "text-pink-400" },
    { icon: <Shield className="h-6 w-6" />, title: "Email Inclus", description: "Accès complet au compte", color: "text-green-400" },
    { icon: <Users className="h-6 w-6" />, title: "Emotes Rares", description: "Danses exclusives", color: "text-indigo-400" }
  ];

  return (
    <section id="comptes" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-2 mb-6">
            <Zap className="h-5 w-5 text-red-400" />
            <span className="text-sm font-bold text-red-400">OFFRE LIMITÉE - STOCK ÉPUISÉ BIENTÔT</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            COMPTE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              ULTRA-RARE
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Le compte Fortnite le plus exclusif du marché français
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-purple-500/30">
                <img
                  src={images[selectedImage]}
                  alt="Compte Fortnite Premium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  PREMIUM
                </div>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {selectedImage + 1}/{images.length}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105'
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Aperçu ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Rare Skins Showcase */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                  Skins Ultra-Rares Inclus
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {rareSkins.map((skin, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${skin.color} p-3 rounded-lg text-white text-center`}
                    >
                      <div className="font-bold text-sm">{skin.name}</div>
                      <div className="text-xs opacity-90">{skin.rarity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    COMPTE PREMIUM
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm">(4.9/5 - 247 avis)</span>
                  </div>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Compte à 252 Skins avec IKONIK et Chevalier Noir
                </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Ce compte exceptionnel contient les skins les plus rares et les plus recherchés de Fortnite. 
                  Une collection unique qui vous permettra de vous démarquer dans toutes vos parties !
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className={`${feature.color} mb-2`}>
                      {feature.icon}
                    </div>
                    <div className="font-bold text-white text-sm">{feature.title}</div>
                    <div className="text-xs text-gray-400">{feature.description}</div>
                  </div>
                ))}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-green-400 font-semibold">PRIX EXCEPTIONNEL</div>
                    <div className="text-4xl font-black text-white">149€</div>
                    <div className="text-sm text-gray-400 line-through">Valeur réelle: 1,200€+</div>
                  </div>
                  <div className="text-right">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold mb-2">
                      -88% DE RÉDUCTION
                    </div>
                    <div className="text-green-400 font-bold">ÉCONOMISEZ 1,051€</div>
                  </div>
                </div>
                
                <div className="border-t border-green-500/30 pt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Garantie satisfait ou remboursé 30 jours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Livraison instantanée par email</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Support client 24/7 via Discord</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="#paiement"
                className="group relative w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Crown className="h-7 w-7 relative z-10" />
                <span className="relative z-10">ACHETER MAINTENANT - 149€</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>

              <div className="text-center text-sm text-gray-400">
                <p>🔒 Paiement 100% sécurisé via PayPal</p>
                <p>⚡ Livraison en moins de 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;