import '../styles/ProductPanel.css';
import React, { useState } from 'react';

function ProductPanel({ products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div className="product-panel" style={{ height: 'calc(100vh - 100px)' }}>
        {products.map((product, index) => (
          <div key={index} className={`product-icon ${!product.image ? 'no-image' : ''}`} onClick={() => setSelectedProduct(product)}>
            {product.image && <img src={product.image} alt="Product" />}
            <div><p className="icon-text">{product.title}</p></div>
            <div><p className="icon-price">${product.price}</p></div>
          </div>

        ))}
        {selectedProduct && (
          
            <div className="product-details-overlay">
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.description}</p>
              <p>${selectedProduct.price}</p>
              <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer" className="icon-text">View Page</a>
              <div>
                <button onClick={() => setSelectedProduct(null)}>Close</button>
              </div>
              
            </div>
          
        )}
      </div>
    );
  }
  
  export default ProductPanel;
