import React from 'react';
import { Star, User, CheckCircle, MessageCircle, UserCircle } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Matheo L.",
      username: "Matheo_L",
      rating: 5,
      comment: "Compte reçu en 4min après le paiement, tout est nickel ! Le Renegade Raider était bien là comme promis. J'ai pu changer le mdp sans problème, vraiment content de mon achat 👍",
      date: "Il y a 3 jours",
      verified: true,
      purchase: "Compte Renegade Raider"
    },
    {
      name: "Nora",
      username: "nora.98",
      rating: 5,
      comment: "Super expérience ! Le compte Galaxy que j'ai acheté avait même plus de V-Bucks que prévu. Support réactif sur Discord quand j'ai eu une question. Je recommande vraiment",
      date: "Il y a 1 semaine",
      verified: true,
      purchase: "Compte Galaxy"
    },
    {
      name: "Elisa",
      username: "ElisaDzn",
      rating: 5,
      comment: "Franchement j'étais un peu méfiante au début mais tout s'est super bien passé. Le compte IKONIK est exactement comme sur les photos, livraison rapide et sécurisée via PayPal",
      date: "Il y a 1 semaine",
      verified: true,
      purchase: "Compte IKONIK"
    },
    {
      name: "Maxime",
      username: "Maxx_yt",
      rating: 5,
      comment: "Compte niveau 180 avec plein de skins rares, exactement ce que je cherchais ! Petit bug au début mais le support m'a aidé direct. Très pro comme service",
      date: "Il y a 2 semaines",
      verified: true,
      purchase: "Compte Niveau 180"
    },
    {
      name: "Jules",
      username: "jules.rn",
      rating: 5,
      comment: "Ghoul Trooper enfin dans ma collection ! Le compte avait aussi 8000 V-Bucks en bonus. Transaction sécurisé, j'ai reçu tous les détails par mail comme promis",
      date: "Il y a 2 semaines",
      verified: true,
      purchase: "Compte Ghoul Trooper"
    },
    {
      name: "Camille",
      username: "cam_33",
      rating: 5,
      comment: "Mon premier achat de compte et tout c'est bien passé. Le Chevalier Noir que je voulais depuis longtemps est enfin à moi ! Merci pour le service rapide et fiable",
      date: "Il y a 3 semaines",
      verified: true,
      purchase: "Compte Chevalier Noir"
    }
  ];

  return (
    <section id="avis" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ce que disent nos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              GAMERS
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Plus de 847 gamers nous font confiance à travers la France
          </p>
          
          {/* Overall Rating */}
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl px-8 py-4">
            <div className="flex text-yellow-400 text-2xl">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-current" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-3xl font-black text-white">4.9/5</div>
              <div className="text-yellow-400 font-semibold">247 avis vérifiés</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-purple-500/30 flex items-center justify-center">
                    <UserCircle className="h-8 w-8 text-gray-300" />
                  </div>
                  {testimonial.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        VÉRIFIÉ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{testimonial.username}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">• {testimonial.purchase}</span>
              </div>
              
              {/* Comment */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{testimonial.date}</span>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Avis vérifié</span>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Rejoignez nos gamers satisfaits !
            </h3>
            <p className="text-xl text-gray-300">
              Plus de 847 comptes vendus, 0 problème signalé
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">847+</div>
              <div className="text-blue-300 font-semibold">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">4.9/5</div>
              <div className="text-purple-300 font-semibold">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">100%</div>
              <div className="text-pink-300 font-semibold">Sécurisé</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">5min</div>
              <div className="text-green-300 font-semibold">Livraison</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="#comptes"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Star className="h-6 w-6" />
              <span>REJOINDRE LA COMMUNAUTÉ</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;