import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../style.css'
import './shop.css'

const products = [
  { id: 'cleanser', name: 'Gentle Cleanser', price: 8000, type: 'cleanser', image: '/products/gentle-cleanser.jpg', detail: 'Soft, daily cleanse' },
  { id: 'exfoliator', name: 'Chemical Exfoliator', price: 15000, type: 'treatment', image: '/products/chemical-exfoliator.jpg', detail: 'A smoother-looking glow' },
  { id: 'toner', name: 'Hydrating Toner', price: 10000, type: 'toner', image: '/products/hydrating-toner.jpg', detail: 'A refreshing moisture layer' },
  { id: 'vitamin-c', name: 'Vitamin C Serum', price: 6000, type: 'serum-c', image: '/products/vitamin-c-serum.jpg', detail: 'Brighten your daily ritual' },
  { id: 'niacinamide', name: 'Niacinamide Serum', price: 12000, type: 'serum-n', image: '/products/niacinamide-serum.jpg', detail: 'Comforting, balanced care' },
]

const formatPrice = (price) => `₦${price.toLocaleString('en-NG')}`

function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 42 20" aria-hidden="true"><path d="M16 3.5 8.6 14a5.2 5.2 0 0 1-8.4-6.2l3-4.1a5.2 5.2 0 0 1 8.4 6.2l-2 2.8M26 16.5 33.4 6a5.2 5.2 0 0 1 8.4 6.2l-3 4.1a5.2 5.2 0 0 1-8.4-6.2l2-2.8M12 16.5 23.3 3.5" /></svg>
}

function CartIcon({ count }) {
  return <a className="cart-link" href="#shop" aria-label={`Shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2h11.8L21 8H6" /><circle cx="9" cy="19" r="1" /><circle cx="17" cy="19" r="1" /></svg>
    <span className="cart-count" aria-live="polite">{count}</span>
  </a>
}

function Header({ count }) {
  return <header className="site-header">
    <nav className="primary-nav" aria-label="Main navigation"><a href="#home">Home</a><a href="#shop">Shop</a><a href="#journal">Blog</a><a href="#about">About</a></nav>
    <a className="wordmark" href="#home" aria-label="Carefair home"><BrandMark /><span>Carefair</span></a>
    <div className="header-actions" aria-label="Shop tools"><a href="#shop" aria-label="Search products"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg></a><CartIcon count={count} /><a href="#about" aria-label="About Carefair"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2" /><path d="M9.5 13.4a3.2 3.2 0 0 0 5 0M9.3 9h.1m5.2 0h.1" /></svg></a></div>
  </header>
}

function Hero() {
  return <main id="home" className="hero">
    <section className="hero-copy" aria-labelledby="hero-title">
      <h1 id="hero-title">Beauty <svg className="bottle-icon" viewBox="0 0 42 54" aria-hidden="true"><path d="M16 4h10v7l5 4v4h2a3 3 0 0 1 3 3v25H6V22a3 3 0 0 1 3-3h2v-4l5-4V4Zm-5 15h20M16 4h10M11 43h20M18 26c-3 1-4 4-3 6 1 2 4 2 6 0 2 2 5 2 6 0 1-2 0-5-3-6l-3 2-3-2Zm3 7v5m10-17h4m-26 0h4" /></svg><br />blooms with<br />Skincare</h1>
      <p>Carefair is healthcare that feels like self-care. Carefair is healthcare that feels like self-care. Carefair is healthcare that feels like self-care</p>
      <div className="hero-actions"><a className="shop-button" href="#shop">Shop now</a><a className="scroll-button" href="#shop" aria-label="Scroll to shop"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 2v23m-7-7 7 7 7-7" /></svg></a></div>
    </section>
    <div className="hero-image" role="img" aria-label="Woman smiling as she applies skincare cream" />
  </main>
}

function ProductCard({ product, onAdd, added }) {
  return <article className="product-card group">
    <div className={`product-art art-${product.type}`}><span className="product-number">0{products.indexOf(product) + 1}</span><img className="product-image" src={product.image} alt={`${product.name} Carefair skincare packaging`} loading="lazy" decoding="async" /></div>
    <div className="product-info"><div><p className="product-detail">{product.detail}</p><h3>{product.name}</h3></div><p className="product-price">{formatPrice(product.price)}</p></div>
    <button className={`add-button transition-colors duration-200 ${added ? 'is-added' : ''}`} type="button" onClick={() => onAdd(product.id)} aria-label={`${added ? 'Added' : 'Add'} ${product.name} to cart`}>{added ? 'Added to Cart' : 'Add to Cart'}<span aria-hidden="true">{added ? '✓' : '+'}</span></button>
  </article>
}

function ProductGrid({ onAdd, lastAdded }) {
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} added={lastAdded === product.id} />)}</div>
}

function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carefair-cart') || '{}') } catch { return {} }
  })
  const [lastAdded, setLastAdded] = useState(null)
  const count = useMemo(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart])

  useEffect(() => { localStorage.setItem('carefair-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => {
    if (!lastAdded) return undefined
    const timer = window.setTimeout(() => setLastAdded(null), 1600)
    return () => window.clearTimeout(timer)
  }, [lastAdded])

  function addToCart(id) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
    setLastAdded(id)
  }

  return <><Header count={count} /><Hero />
    <section className="shop-section" id="shop" aria-labelledby="shop-title">
      <div className="shop-heading"><p className="eyebrow">THE CAREFAIR RITUAL</p><h2 id="shop-title">Your skin, your care.</h2><p className="section-intro">Thoughtful essentials for the little moments that make you feel like yourself.</p></div>
      <ProductGrid onAdd={addToCart} lastAdded={lastAdded} />
    </section>
    <footer className="site-footer" id="about"><a className="footer-brand" href="#home"><BrandMark /><span>Carefair</span></a><p>Healthcare that feels like self-care.</p><span className="footer-note">Made for your everyday ritual.</span></footer>
  </>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
