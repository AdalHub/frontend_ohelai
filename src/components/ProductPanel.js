import '../styles/ProductPanel.css';
import React, { useState } from 'react';

function ProductPanel({ products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
  
    return (
        <div className="product-panel" style={{ height: 'calc(100vh - 100px)' }}>
        {products.map((product, index) => (
          <div key={index} className="product-icon" onClick={() => setSelectedProduct(product)}>
            <img src={product.image || 'https://placehold.it/150'} alt="Product" className="w-full h-auto" />
            <h3 className="mt-0.5 mb-0.5 text-center">{product.title}</h3>
            <p className="mt-0.5 mb-0.5 text-center">${product.price}</p>
          </div>
        ))}
        {selectedProduct && (
          
            <div className="product-details-overlay">
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.description}</p>
              <p>${selectedProduct.price}</p>
              <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">View More</a>
              <button onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          
        )}
      </div>
    );
  }
  
  export default ProductPanel;
  