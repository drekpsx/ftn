import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, Clock, AlertCircle, Crown, Zap } from 'lucide-react';

const PaymentSection = () => {
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulation d'un traitement puis redirection vers PayPal
    setTimeout(() => {
      setIsProcessing(false);
      // Redirection vers le lien PayPal fourni
      window.open('https://paypal.me/xth3oD?country.x=FR&locale.x=fr_FR', '_blank');
    }, 2000);
  };

  return (
    <section id="paiement" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-full px-6 py-2 mb-6">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm font-bold text-green-400">PAIEMENT 100% SÉCURISÉ</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Commandez
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              MAINTENANT
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Paiement sécurisé via PayPal - Livraison instantanée garantie
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Résumé de commande */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Crown className="h-7 w-7 text-yellow-400 mr-3" />
                Résumé de commande
              </h3>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Compte Fortnite Premium</h4>
                    <p className="text-purple-300">252 skins + IKONIK + Chevalier Noir</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">(247 avis)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 border-t border-purple-500/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prix du compte</span>
                    <span className="text-white font-semibold">149€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Frais de service</span>
                    <span className="text-green-400 font-semibold">Gratuit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Garantie 30 jours</span>
                    <span className="text-green-400 font-semibold">Incluse</span>
                  </div>
                  <div className="border-t border-purple-500/30 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">149€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Garanties */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Vos garanties :</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Garantie satisfait ou remboursé 30 jours</span>
                  </div>
                  <div className="flex items-center space-x-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Livraison instantanée (moins de 5 minutes)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Support client 24/7 via Discord</span>
                  </div>
                  <div className="flex items-center space-x-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Compte 100% légal et sécurisé</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de paiement */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <CreditCard className="h-7 w-7 text-blue-400 mr-3" />
                Informations de livraison
              </h3>
              
              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Email de livraison *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="votre@email.com"
                  />
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Les identifiants du compte seront envoyés à cette adresse
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-300 font-bold mb-1">Information importante</p>
                      <p className="text-sm text-blue-200">
                        Après votre paiement PayPal, vous recevrez automatiquement un email avec :
                      </p>
                      <ul className="text-xs text-blue-200 mt-2 space-y-1 ml-4">
                        <li>• Email du compte Fortnite</li>
                        <li>• Mot de passe du compte</li>
                        <li>• Instructions de connexion</li>
                        <li>• Informations de support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    J'accepte les{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">
                      politique de confidentialité
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!email || !agreeTerms || isProcessing}
                  className="group relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isProcessing ? (
                    <>
                      <Clock className="h-6 w-6 animate-spin relative z-10" />
                      <span className="relative z-10">REDIRECTION VERS PAYPAL...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 relative z-10" />
                      <span className="relative z-10">PAYER AVEC PAYPAL - 149€</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
              </form>

              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-green-400" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Paiement 100% sécurisé</p>
                    <p className="text-xs text-gray-400">Cryptage SSL 256 bits</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">PayPal</p>
                    <p className="text-xs text-gray-400">Protection acheteur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;