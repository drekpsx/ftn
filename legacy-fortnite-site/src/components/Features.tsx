import React from 'react';
import { Shield, Zap, Award, Users, Crown, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Sécurisé",
      description: "Tous nos comptes sont légitimes et vérifiés. Paiement sécurisé via PayPal avec protection acheteur.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Livraison Express",
      description: "Recevez vos identifiants par email en moins de 5 minutes après votre paiement. Service ultra-rapide !",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Garantie 30 Jours",
      description: "Satisfait ou remboursé ! Si vous rencontrez le moindre problème, nous vous remboursons intégralement.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "847+ Clients Satisfaits",
      description: "Rejoignez notre communauté de gamers satisfaits. Plus de 847 comptes vendus avec 0 problème !",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Skins Ultra-Rares",
      description: "Accédez aux skins les plus exclusifs : IKONIK, Chevalier Noir, Renegade Raider et bien plus !",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Support 24/7",
      description: "Notre équipe est disponible 24h/24 et 7j/7 pour répondre à toutes vos questions via Discord.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-500/20 to-purple-500/20",
      borderColor: "border-indigo-500/30"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Pourquoi nous faire
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              CONFIANCE ?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez pourquoi des centaines de gamers nous font confiance pour leurs comptes Fortnite premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm border ${feature.borderColor} rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Animated border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à rejoindre l'élite ?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Ne ratez pas cette opportunité d'obtenir les skins les plus rares de Fortnite
            </p>
            <a
              href="#comptes"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Crown className="h-6 w-6" />
              <span>DÉCOUVRIR LES COMPTES</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;