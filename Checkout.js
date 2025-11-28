import React, { useState } from 'react';
import { useCart } from './CartContext';

const Checkout = ({ onClose, onDone }) => {
  const { cartItems, clearCart, total } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const generateReceipt = () => {
    const lines = [];
    lines.push('--- Ticket de Compra - Mi Pokédex ---');
    lines.push(`Fecha: ${new Date().toLocaleString()}`);
    lines.push(`Cliente: ${name} <${email}>`);
    lines.push('');
    cartItems.forEach(item => {
      lines.push(`${item.name} x${item.qty} - $${(item.price||0).toFixed(2)}`);
    });
    lines.push('');
    lines.push(`Total: $${total.toFixed(2)}`);
    lines.push('Gracias por su compra!');
    return lines.join('\n');
  };

  const handlePay = async () => {
    if (!name || !email) {
      alert('Por favor ingresa nombre y email para el ticket');
      return;
    }
    setProcessing(true);
    // Simular pago
    await new Promise(res => setTimeout(res, 1200));
    setProcessing(false);
    setSuccess(true);

    const receipt = generateReceipt();

    // Preparar mailto con contenido del ticket (puede ser grande, pero para demo está bien)
    const subject = encodeURIComponent('Ticket de compra - Mi Pokédex');
    const body = encodeURIComponent(receipt);
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

    // Abrir cliente de correo del usuario
    window.location.href = mailto;

    // Además, ofrecer descarga del recibo
    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Limpiar carrito y cerrar
    clearCart();
    if (onDone) onDone();
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h3>Pagar</h3>
          <button className="close-checkout" onClick={onClose}>✕</button>
        </div>
        <div className="checkout-body">
          <p>Total a pagar: <strong>${total.toFixed(2)}</strong></p>
          <label>Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          <label>Email (se enviará el ticket)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <hr />
          <div className="checkout-actions">
            <button onClick={onClose} disabled={processing}>Cancelar</button>
            <button onClick={handlePay} disabled={processing}>{processing ? 'Procesando...' : 'Pagar (simulado)'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
