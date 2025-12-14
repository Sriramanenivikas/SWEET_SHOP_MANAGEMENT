import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const Terms = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: 'Terms of Service' }]} />
        
        <h1 className="text-4xl font-serif font-bold text-brand-navy mt-8 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="lead">
            Welcome to Mithai Sweets & Savouries. By accessing or using our services, you agree to these terms.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">1. General Terms</h2>
          <p>
            By placing an order with Mithai, you confirm that you are at least 18 years old and capable of entering 
            into a binding contract. All orders are subject to product availability and acceptance.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">2. Products & Pricing</h2>
          <p>
            All products are handcrafted and may vary slightly in appearance. Prices are in Indian Rupees (INR) 
            and include applicable taxes. We reserve the right to modify prices without prior notice.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">3. Orders & Delivery</h2>
          <p>
            Orders are processed within 24-48 hours. Delivery times vary based on location:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Metro cities: 3-5 business days</li>
            <li>Other locations: 5-7 business days</li>
            <li>Remote areas: 7-10 business days</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">4. Returns & Refunds</h2>
          <p>
            Due to the perishable nature of our products, we do not accept returns. However, if you receive 
            damaged or incorrect items, please contact us within 24 hours of delivery for a replacement or refund.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">5. Contact</h2>
          <p>
            For any questions regarding these terms, please contact us at:<br />
            Email: support@mithai.com<br />
            Phone: +91 98765 43210
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
