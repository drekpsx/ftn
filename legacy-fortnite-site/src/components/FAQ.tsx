import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Livraison & Paiement",
      questions: [
        {
          question: "Comment fonctionne la livraison ?",
          answer: "Après votre paiement PayPal, vous recevrez automatiquement un email avec tous les identifiants du compte (email, mot de passe, instructions) en moins de 5 minutes. C'est entièrement automatisé !"
        },
        {
          question: "Pourquoi seulement PayPal ?",
          answer: "PayPal offre la meilleure protection pour vous et nous. Vous bénéficiez de la protection acheteur PayPal, et nous pouvons garantir des transactions 100% sécurisées. C'est un gage de confiance mutuelle."
        },
        {
          question: "Y a-t-il des frais cachés ?",
          answer: "Absolument aucun ! Le prix affiché (149€) est le prix final. Aucun frais supplémentaire ne sera ajouté lors du paiement. Ce que vous voyez, c'est ce que vous payez."
        }
      ]
    },
    {
      category: "Sécurité & Garanties",
      questions: [
        {
          question: "Le compte est-il vraiment sécurisé ?",
          answer: "Oui, 100% ! Tous nos comptes sont légitimes et créés légalement. Nous fournissons l'email d'origine et le mot de passe, vous pouvez donc changer toutes les informations. Garantie 30 jours incluse pour votre tranquillité d'esprit."
        },
        {
          question: "Que se passe-t-il si j'ai un problème ?",
          answer: "Nous offrons une garantie complète de 30 jours. Si vous rencontrez le moindre problème, contactez-nous immédiatement sur Discord (xth3o.dev). Notre équipe support est disponible 24/7 pour résoudre tout problème rapidement."
        },
        {
          question: "Puis-je changer les informations du compte ?",
          answer: "Absolument ! Vous recevez l'accès complet avec l'email d'origine. Vous pouvez changer l'email, le mot de passe, et toutes les informations personnelles du compte. C'est votre compte à 100%."
        }
      ]
    },
    {
      category: "Contenu & Utilisation",
      questions: [
        {
          question: "Les skins sont-ils permanents ?",
          answer: "Oui, tous les 252 skins présents sur le compte vous appartiennent définitivement ! Cela inclut IKONIK, le Chevalier Noir, Renegade Raider, et tous les autres skins ultra-rares listés. Ils ne disparaîtront jamais."
        },
        {
          question: "Combien de temps puis-je utiliser le compte ?",
          answer: "Le compte vous appartient définitivement ! Il n'y a aucune limite de temps, vous pouvez l'utiliser aussi longtemps que vous le souhaitez. C'est votre compte pour la vie."
        },
        {
          question: "Le compte a-t-il vraiment 252 skins ?",
          answer: "Oui, exactement 252 skins vérifiés ! Nous fournissons une liste complète avec screenshots. Le compte inclut tous les skins rares : IKONIK, Chevalier Noir, Renegade Raider, Ghoul Trooper, Galaxy, et bien d'autres exclusivités."
        }
      ]
    },
    {
      category: "Support & Contact",
      questions: [
        {
          question: "Comment vous contacter en cas de problème ?",
          answer: "Plusieurs moyens de nous contacter : Discord (xth3o.dev) pour un support instantané 24/7, ou par email (t2219552@gmail.com). Nous répondons généralement en moins de 30 minutes sur Discord."
        },
        {
          question: "Proposez-vous d'autres comptes ?",
          answer: "Actuellement, nous nous concentrons sur ce compte premium exceptionnel pour garantir la meilleure qualité. Mais nous préparons d'autres comptes ultra-rares ! Suivez-nous sur Discord pour être informé en premier."
        }
      ]
    }
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">TOUTES VOS QUESTIONS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Questions
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              FRÉQUENTES
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Tout ce que vous devez savoir avant votre achat
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 10 + questionIndex;
                  return (
                    <div
                      key={questionIndex}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                      >
                        <span className="text-lg font-bold text-white pr-4">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {openIndex === globalIndex ? (
                            <ChevronUp className="h-6 w-6 text-purple-400" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      {openIndex === globalIndex && (
                        <div className="px-6 pb-5 border-t border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous avez d'autres questions ?
            </h3>
            <p className="text-gray-300 mb-6">
              Notre équipe support est disponible 24/7 pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.com/users/xth3o.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span>💬</span>
                <span>Discord: xth3o.dev</span>
              </a>
              <a
                href="mailto:t2219552@gmail.com"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span>📧</span>
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;