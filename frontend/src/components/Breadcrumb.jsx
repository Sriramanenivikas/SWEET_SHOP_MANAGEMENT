import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-gray-500 hover:text-brand-gold transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.link ? (
            <Link 
              to={item.link}
              className="text-gray-500 hover:text-brand-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-navy font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
