import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, MapPin, Phone, ArrowRight, Menu, X } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#properties', label: 'Nos biens' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-900" />
              <span className="text-xl md:text-2xl font-bold text-blue-900">BabSouss.immo</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-600 hover:text-blue-900"
                >
                  {link.label}
                </a>
              ))}
              <Button 
                type="primary"
                onClick={() => navigate('/login')}
                className="ml-4"
              >
                Accéder à la plateforme
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        closeIcon={<X className="w-6 h-6" />}
        width="100%"
        className="md:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4">
            <div className="space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-lg text-gray-600 hover:text-blue-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={() => navigate('/login')}
            >
              Accéder à la plateforme
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 pt-24 md:pt-32 pb-16 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6">
              Gestion immobilière simplifiée
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Une solution complète pour gérer vos biens, locataires et propriétaires en toute simplicité
            </p>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/login')}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full md:w-auto"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">400+</div>
              <div className="text-sm md:text-base text-gray-600">transactions en 2022</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">25</div>
              <div className="text-sm md:text-base text-gray-600">ans d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">4,9/5</div>
              <div className="text-sm md:text-base text-gray-600">satisfaction client</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">5000+</div>
              <div className="text-sm md:text-base text-gray-600">clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div id="properties" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Biens à la Une
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Découvrez nos meilleures opportunités
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Property Cards */}
            {[
              {
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
                tag: { text: "Nouveau", color: "bg-blue-900" },
                title: "Appartement de luxe - 16ème",
                description: "Magnifique 4 pièces avec vue panoramique",
                price: "1 250 000 €",
                details: { surface: "150m²", rooms: "4 pièces" }
              },
              {
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                tag: { text: "Exclusivité", color: "bg-green-600" },
                title: "Maison contemporaine - Neuilly",
                description: "Villa d'architecte avec jardin privatif",
                price: "2 890 000 €",
                details: { surface: "280m²", rooms: "6 pièces" }
              },
              {
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
                tag: { text: "Coup de cœur", color: "bg-amber-500" },
                title: "Loft design - Marais",
                description: "Espace atypique entièrement rénové",
                price: "1 890 000 €",
                details: { surface: "200m²", rooms: "5 pièces" }
              }
            ].map((property, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                <div className="relative h-48 md:h-64">
                  <img 
                    src={`${property.image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80`}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`${property.tag.color} text-white px-3 py-1 rounded-full text-sm`}>
                      {property.tag.text}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl md:text-2xl font-bold text-blue-900">{property.price}</span>
                    <div className="flex items-center gap-4 text-sm md:text-base text-gray-600">
                      <span>{property.details.surface}</span>
                      <span>{property.details.rooms}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button type="primary" size="large" className="w-full md:w-auto">
              Voir tous nos biens
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 backdrop-blur-sm rounded-xl mb-6">
                <Mail className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                Parlons de votre projet immobilier
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
                Notre équipe d'experts est à votre écoute pour vous accompagner
              </p>
              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: <MapPin className="w-5 h-5 md:w-6 md:h-6" />, title: "Notre agence", content: "123 Avenue des Champs-Élysées, 75008 Paris" },
                  { icon: <Phone className="w-5 h-5 md:w-6 md:h-6" />, title: "Téléphone", content: "+33 1 23 45 67 89", href: "tel:+33123456789" },
                  { icon: <Mail className="w-5 h-5 md:w-6 md:h-6" />, title: "Email", content: "contact@babsouss.immo", href: "mailto:contact@babsouss.immo" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-300 text-sm md:text-base">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 md:p-8 rounded-2xl mt-8 md:mt-0">
              <form className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {['Nom', 'Prénom'].map((label) => (
                    <div key={label}>
                      <label className="block text-sm font-medium mb-2">{label}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder={`Votre ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                {[
                  { label: 'Email', type: 'email', placeholder: 'votre@email.com' },
                  { label: 'Téléphone', type: 'tel', placeholder: 'Votre numéro' }
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Votre message..."
                  />
                </div>
                <Button type="primary" size="large" block className="h-12">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-lg md:text-xl font-bold text-white">BabSouss.immo</span>
            </div>
            <div className="text-sm text-center md:text-right">
              © 2024 BabSouss.immo. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;