import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
        
        <h1 className="text-4xl font-serif font-bold text-brand-navy mt-8 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="lead">
            At Mithai, we are committed to protecting your privacy. This policy explains how we collect, 
            use, and safeguard your personal information.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Name and contact information</li>
            <li>Delivery address</li>
            <li>Order history</li>
            <li>Payment information (processed securely by third-party providers)</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Process and deliver your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Improve our products and services</li>
            <li>Send promotional offers (with your consent)</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. All transactions are 
            encrypted using SSL technology. We never store complete payment card details.
          </p>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-brand-navy mt-8 mb-4">Contact Us</h2>
          <p>
            For privacy-related inquiries:<br />
            Email: privacy@mithai.com<br />
            Phone: +91 98765 43210
          </p>

          <p className="mt-8 text-sm text-gray-500">
            Last updated: December 2024
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
