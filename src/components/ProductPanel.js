import '../styles/ProductPanel.css';
import React, { useState } from 'react';


function ProductPanel({ products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
  
    return (
      <div className="product-panel">
        {products.map((product, index) => (
          <div key={index} className="product-icon" onClick={() => setSelectedProduct(product)}>
            <img src={product.image || 'https://placehold.it/150'} alt="Product" style={{ width: '100%', height: 'auto' }} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </div>
        ))}
        {selectedProduct && (
          <div className="product-details-overlay">
            <h2>{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>${selectedProduct.price}</p>
            <a href={selectedProduct.url} target="_blank">View More</a>
            <button onClick={() => setSelectedProduct(null)}>Close</button>
          </div>
        )}
      </div>
    );
  }
  export default ProductPanel;