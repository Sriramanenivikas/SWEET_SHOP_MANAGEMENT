import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Award, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  GoldPaisley, GoldDiya, Sparkle, GoldFrame, 
  FallingSweetsAnimation, GoldFlower, GoldCorner, FloatingDecorations 
} from '../components/GoldSVGs';

// External Anand Sweets style decorations
const AnandFlowerDecor = ({ className = "" }) => (
  <img 
    src="https://www.anandsweets.in/cdn/shop/files/pick_flower.svg?v=1709636209" 
    alt="" 
    className={className}
    onError={(e) => { e.target.style.display = 'none'; }}
  />
);

const Landing = () => {
  const features = [
    { icon: Truck, title: 'Pan India Delivery', desc: 'Fresh sweets at your doorstep in 3-5 days' },
    { icon: Clock, title: '15 Days Shelf Life', desc: 'Made fresh with natural preservatives' },
    { icon: Shield, title: 'No Preservatives', desc: '100% pure ingredients, no artificial colors' },
    { icon: Award, title: 'Since 1985', desc: 'Four generations of sweet-making excellence' },
  ];

  const categories = [
    { name: 'Barfi', image: '/images/barfi.jpg', count: 7 },
    { name: 'Ladoo', image: '/images/ladoo.jpg', count: 5 },
    { name: 'Halwa', image: '/images/halwa.jpg', count: 4 },
    { name: 'Traditional', image: '/images/traditional.jpg', count: 9 },
    { name: 'Namkeen', image: '/images/namkeen.jpg', count: 5 },
  ];

  const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', text: 'The Kaju Katli reminded me of my grandmother\'s recipe. Absolutely divine!', rating: 5 },
    { name: 'Rajesh Gupta', location: 'Delhi', text: 'Best motichoor ladoos I\'ve ever tasted outside of Rajasthan. Will order again!', rating: 5 },
    { name: 'Anita Patel', location: 'Bangalore', text: 'Fresh, authentic, and delivered on time. Perfect for our Diwali celebrations.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      {/* Falling Sweets Animation */}
      <FallingSweetsAnimation />

      {/* Floating Gold Decorations */}
      <FloatingDecorations />

      {/* Gold Corner Decorations */}
      <div className="fixed top-0 left-0 pointer-events-none z-10">
        <GoldCorner size={100} className="opacity-30" />
      </div>
      <div className="fixed top-0 right-0 pointer-events-none z-10 transform scale-x-[-1]">
        <GoldCorner size={100} className="opacity-30" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A02F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative swirl with Anand Sweets flower */}
              <div className="flex items-center gap-3 mb-6">
                <AnandFlowerDecor className="w-8 h-8 opacity-80" />
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Authentic Indian Sweets
                </span>
                <AnandFlowerDecor className="w-8 h-8 opacity-80" />
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Taste the
                <span className="block text-brand-gold">Tradition</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Experience the authentic flavors of India with our handcrafted sweets, 
                made with pure ghee, premium dry fruits, and recipes passed down 
                through four generations.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-full transition-all shadow-xl shadow-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/40"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white font-bold rounded-full transition-all"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-brand-gold/20">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-brand-gold">39+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-brand-gold">50K+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-brand-gold">100+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Varieties</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Gold decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-brand-gold/20 scale-110" />
                <div className="absolute inset-0 rounded-full border border-brand-gold/10 scale-125" />
                
                {/* Floating sparkles around the image */}
                <motion.div 
                  className="absolute -top-8 left-1/4"
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkle size={20} />
                </motion.div>
                <motion.div 
                  className="absolute top-1/4 -right-8"
                  animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkle size={16} />
                </motion.div>
                <motion.div 
                  className="absolute bottom-1/4 -left-8"
                  animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Sparkle size={18} />
                </motion.div>
                
                {/* Main image container */}
                <div className="relative rounded-full overflow-hidden aspect-square bg-gradient-to-br from-brand-pink via-brand-cream to-brand-pink shadow-2xl">
                  <img
                    src="/images/tasty-indian-dessert-plate-top-view.jpg"
                    alt="Premium Indian Sweets"
                    className="w-full h-full object-cover scale-120 hover:scale-110 transition-transform duration-700"

                    // className="w-full  object-cover"
                    style={{ objectPosition: "100% 0% "}}
                  />
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <GoldDiya size={40} />
                  <p className="text-xs font-bold text-brand-navy mt-1">Festival<br/>Special</p>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-brand-navy mt-1">4.9 Rating</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y border-brand-gold/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <h3 className="font-bold text-brand-navy mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <GoldFrame className="w-24 h-4" />
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Our Collection</span>
              <GoldFrame className="w-24 h-4 transform scale-x-[-1]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy">
              What We Offer
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.name.toUpperCase()}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-square"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-sm text-white/70">{cat.count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative overflow-hidden" id="about">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 opacity-10">
          <GoldCorner size={150} />
        </div>
        <div className="absolute bottom-0 right-0 opacity-10 transform rotate-180">
          <GoldCorner size={150} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src='/images/trad1.jpg'
                  alt="Traditional sweet making"
                  className="rounded-2xl shadow-lg"
                />
                <img
                  src="/images/premium.jpg"
                  alt="Premium sweets"
                  className="rounded-2xl shadow-lg mt-8"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/10 rounded-full -z-10" />
              <motion.div 
                className="absolute -top-4 -left-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <GoldFlower size={50} className="opacity-40" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <GoldPaisley size={24} className="opacity-80" />
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Our Story</span>
              </div>
              
              <h2 className="text-4xl font-serif font-bold text-brand-navy mb-6">
                Four Generations of Sweet Excellence
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since 1985, Mithai has been crafting authentic Indian sweets using time-honored 
                recipes and the finest ingredients. What started as a small family kitchen has 
                grown into a beloved brand, trusted by thousands across India.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Every sweet we make carries the love and expertise of four generations. We use 
                pure A2 ghee, premium dry fruits, and never compromise on quality. Our commitment 
                is simple: to bring the authentic taste of traditional Indian sweets to your home.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-brand-gold font-bold hover:text-brand-gold-dark transition-colors"
              >
                Explore Our Sweets
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <GoldFrame className="w-24 h-4" />
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Testimonials</span>
              <GoldFrame className="w-24 h-4 transform scale-x-[-1]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-brand-navy">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        {/* Gold accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GoldDiya size={60} className="mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Experience Authentic Flavors?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of happy customers who trust Mithai for their sweet cravings.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-10 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold rounded-full transition-all shadow-xl"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-4 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white font-bold rounded-full transition-all"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
