import React, { useState } from 'react';
import { useCart } from './CartContext';
import Checkout from './Checkout';
import './App.css';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, clearCart, total } = useCart();
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <button
        className="cart-button"
        onClick={() => setOpen(!open)}
        title="Abrir carrito"
      >
        🛒 ({cartItems.length})
      </button>

      {open && (
        <div className="cart-panel">
          <div className="cart-header">
            <h3>Carrito de Compras</h3>
            <button className="close-cart" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="cart-body">
            {cartItems.length === 0 && <p>El carrito está vacío</p>}
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.sprites?.other?.['official-artwork']?.front_default} alt={item.name} />
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <p>Precio: ${item.price?.toFixed(2) ?? '0.00'}</p>
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">Total: <strong>${total.toFixed(2)}</strong></div>
            <div className="cart-actions">
              <button onClick={() => { clearCart(); }}>Vaciar</button>
              <button onClick={() => setCheckoutOpen(true)} disabled={cartItems.length===0}>Pagar</button>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <Checkout
          onClose={() => setCheckoutOpen(false)}
          onDone={() => { setCheckoutOpen(false); setOpen(false); }}
        />
      )}
    </>
  );
};

export default Cart;
