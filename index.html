import React, { useState, useEffect } from 'react';
import { 
  Utensils, ShoppingBag, Clock, MapPin, Phone, CheckCircle2, 
  Truck, ChefHat, AlertCircle, Plus, Minus, Trash2, Shield, 
  Lock, ArrowRight, UserCheck, X, Check, Flame, Star
} from 'lucide-react';

// ==========================================
// 1. FIREBASE & APP CONFIGURATION
// ==========================================
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForAgencyDemo99",
  authDomain: "moon-captures-restaurant.firebaseapp.com",
  projectId: "moon-captures-restaurant",
  storageBucket: "moon-captures-restaurant.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = "moon-captures-demo-v1";

// ==========================================
// 2. INITIAL SEED DATA
// ==========================================
const INITIAL_MENU = [
  { id: '1', name: 'Malabar Chicken Biriyani', price: 160, category: 'Rice & Biriyani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80', description: 'Authentic Thalassery style kaima rice biriyani with succulent chicken.', available: true },
  { id: '2', name: 'Beef Porotta Combo', price: 210, category: 'Special Combos', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80', description: '2 Kerala Porottas served with spicy, slow-roasted Kerala beef fry.', available: true },
  { id: '3', name: 'Al Faham Mandi (Quarter)', price: 180, category: 'Mandi', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80', description: 'Smoky grilled Al Faham chicken served with long-grain mandi rice.', available: true },
  { id: '4', name: 'Ghee Rice & Butter Chicken', price: 230, category: 'Combos', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80', description: 'Rich aromatic ghee rice paired with creamy north Indian butter chicken.', available: true },
  { id: '5', name: 'Fresh Lime Mint Cooler', price: 40, category: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', description: 'Refreshing zesty lime spiked with crushed fresh mint leaves.', available: true }
];

const INITIAL_RIDERS = [
  { id: 'r1', name: 'Rahul M.', phone: '+91 98765 43210', status: 'Available' },
  { id: 'r2', name: 'Anshad K.', phone: '+91 91234 56789', status: 'Available' },
  { id: 'r3', name: 'Midhun Raj', phone: '+91 99443 22110', status: 'Busy' }
];

export default function App() {
  const [role, setRole] = useState('customer');
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);

  const [menu, setMenu] = useState(INITIAL_MENU);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState(INITIAL_RIDERS);

  // Customer State
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderType, setOrderType] = useState('Delivery');
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [activeOrderTracker, setActiveOrderTracker] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // URL Routing detection on load (?role=admin or ?role=rider)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r === 'admin' || r === 'rider') {
      setRole(r);
    }
  }, []);

  // Sync Firebase Data
  useEffect(() => {
    const ordersQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (fetched.length > 0) setOrders(fetched);
    }, (err) => console.log('Using local state fallback for orders'));

    const menuQuery = collection(db, 'artifacts', appId, 'public', 'data', 'menu');
    const unsubMenu = onSnapshot(menuQuery, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedMenu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenu(fetchedMenu);
      }
    }, (err) => console.log('Using local menu fallback'));

    return () => {
      unsubOrders();
      unsubMenu();
    };
  }, []);

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = orderType === 'Delivery' ? 30 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      customer: customerForm,
      items: cart,
      orderType,
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      status: 'Order Placed',
      rider: null,
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), newOrder);
      setActiveOrderTracker({ id: docRef.id, ...newOrder });
    } catch (err) {
      // Fallback local simulation if offline
      const mockId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      const localObj = { id: mockId, ...newOrder };
      setOrders(prev => [localObj, ...prev]);
      setActiveOrderTracker(localObj);
    }

    setCart([]);
    setIsCheckoutOpen(false);
    setCustomerForm({ name: '', phone: '', address: '', note: '' });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId), { status: newStatus });
    } catch(e) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const assignRiderToOrder = async (orderId, riderName) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId), { rider: riderName, status: 'Out for Delivery' });
    } catch(e) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rider: riderName, status: 'Out for Delivery' } : o));
    }
  };

  const toggleItemStock = async (itemId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'menu', itemId), { available: !currentStatus });
    } catch(e) {
      setMenu(prev => prev.map(m => m.id === itemId ? { ...m, available: !currentStatus } : m));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* AGENCY HEADER WATERMARK */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-2 shadow-inner">
        <span>🚀 Agency Demo Built by <strong>Moon Captures Digital Marketing</strong></span>
        <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">Client Pitch Mode</span>
      </div>

      {/* ==========================================
          PORTAL 1: CUSTOMER FRONT-END WEBSITE
         ========================================== */}
      {role === 'customer' && (
        <div className="flex-1 flex flex-col">
          {/* Restaurant Header */}
          <header className="bg-slate-800/90 backdrop-blur sticky top-0 z-40 border-b border-slate-700 px-4 py-3 shadow-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight flex items-center gap-1.5">
                  Malabar Grand Hotel <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-normal">Open</span>
                </h1>
                <p className="text-xs text-slate-400">Authentic Malabar Cuisine & Mandi</p>
              </div>
            </div>

            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="relative bg-orange-600 hover:bg-orange-500 transition px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </header>

          {/* Main Hero Banner */}
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800 px-4 py-8 text-center sm:text-left sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="max-w-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">⚡ Direct Fast Delivery</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-white">Hot & Spicy Delicacies Delivered To Your Door</h2>
              <p className="text-slate-400 text-sm mt-2">Prepared fresh with authentic Malabar spices. Order now for lightning-fast delivery or quick parcel pickup.</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl shadow-xl backdrop-blur text-left min-w-[240px]">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                <Clock className="w-4 h-4" /> <span>Estimated Delivery: 25-35 mins</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs">
                <MapPin className="w-4 h-4 text-orange-400" /> <span>Kurudimukk, Naduvannur</span>
              </div>
            </div>
          </div>

          {/* Menu Catalog */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Today's Special Menu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map((item) => (
                <div key={item.id} className={`bg-slate-800/60 border rounded-2xl overflow-hidden shadow-lg transition flex flex-col ${item.available ? 'border-slate-700 hover:border-orange-500/50' : 'border-slate-800 opacity-60'}`}>
                  <div className="relative h-48 overflow-hidden bg-slate-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-500/90 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg shadow">Sold Out Today</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-lg text-white">{item.name}</h4>
                        <span className="font-extrabold text-orange-400">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-700/60 flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 bg-slate-700/50 px-2 py-1 rounded">{item.category}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${item.available ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Order Tracker Widget if placed */}
            {activeOrderTracker && (
              <div className="mt-12 bg-gradient-to-r from-orange-950/50 to-slate-800 border border-orange-500/30 p-6 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Live Order Tracker</span>
                    <h4 className="text-xl font-bold text-white mt-0.5">Order #{activeOrderTracker.id.slice(-5)}</h4>
                  </div>
                  <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    {activeOrderTracker.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800 mb-4">
                  <div><span className="text-slate-500 block">Type:</span> {activeOrderTracker.orderType}</div>
                  <div><span className="text-slate-500 block">Total Amount:</span> ₹{activeOrderTracker.total}</div>
                  <div><span className="text-slate-500 block">Assigned Rider:</span> {activeOrderTracker.rider || 'Finding Rider...'}</div>
                  <div><span className="text-slate-500 block">Customer Phone:</span> {activeOrderTracker.customer.phone}</div>
                </div>
                <button onClick={() => setActiveOrderTracker(null)} className="text-xs text-orange-400 hover:underline">Dismiss Tracker</button>
              </div>
            )}
          </main>

          {/* Cart Drawer Modal */}
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
              <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-orange-500" /> Your Food Cart</h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-2 hover:bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Your cart is empty. Add some delicious food!</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {cart.map(item => (
                          <div key={item.id} className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                            <div>
                              <h5 className="font-semibold text-sm">{item.name}</h5>
                              <p className="text-xs text-orange-400 font-bold">₹{item.price} x {item.qty} = ₹{item.price * item.qty}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                              <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:text-orange-400"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:text-orange-400"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Type Selector */}
                      <div className="mt-6">
                        <label className="text-xs font-semibold text-slate-400 block mb-2">Order Fulfillment Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Delivery', 'Takeaway', 'Dine-In'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setOrderType(type)}
                              className={`py-2 rounded-xl text-xs font-bold border transition ${orderType === type ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Checkout Form */}
                      <form onSubmit={placeOrder} className="space-y-3 mt-4">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Your Full Name</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Muhammed Hathan" 
                            value={customerForm.name}
                            onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                          <input 
                            required 
                            type="tel" 
                            placeholder="+91 98765 43210" 
                            value={customerForm.phone}
                            onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                          />
                        </div>
                        {orderType === 'Delivery' && (
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Delivery Address & Landmark</label>
                            <textarea 
                              required 
                              rows="2"
                              placeholder="House name, street, nearby landmark" 
                              value={customerForm.address}
                              onChange={e => setCustomerForm({...customerForm, address: e.target.value})}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                            />
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 border-t border-slate-800 bg-slate-800/40">
                    <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                      <div className="flex justify-between"><span>Subtotal</span> <span className="text-slate-200">₹{cartTotal}</span></div>
                      <div className="flex justify-between"><span>Delivery Fee</span> <span className="text-slate-200">₹{deliveryFee}</span></div>
                      <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-700"><span>Grand Total</span> <span className="text-orange-400">₹{grandTotal}</span></div>
                    </div>
                    <button 
                      onClick={placeOrder}
                      className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                    >
                      <span>Place Order Now</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          PORTAL 2: ADMIN COUNTER DASHBOARD (?role=admin)
         ========================================== */}
      {role === 'admin' && (
        <div className="flex-1 flex flex-col">
          {!adminAuthed ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl text-center">
                <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Counter Admin Portal</h2>
                <p className="text-xs text-slate-400 mb-6">Enter your 4-digit manager PIN to access live orders & kitchen controls.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); if(adminPinInput === '1234' || adminPinInput === '2026') setAdminAuthed(true); else alert('Incorrect PIN! Try 1234'); }} className="space-y-4">
                  <input 
                    type="password" 
                    maxLength="4"
                    placeholder="Enter PIN (e.g. 1234)"
                    value={adminPinInput}
                    onChange={e => setAdminPinInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-mono focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-orange-600/30">
                    Unlock Manager Dashboard
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl w-full mx-auto">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">🟢 Admin Authenticated</span>
                  <h2 className="text-2xl font-bold mt-2">Live Kitchen & Order Manager</h2>
                </div>
                <button onClick={() => setAdminAuthed(false)} className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700">Lock Portal</button>
              </div>

              {/* Grid Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Orders Column */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ChefHat className="w-5 h-5 text-orange-500" /> Incoming Customer Orders ({orders.length})</h3>
                  
                  {orders.length === 0 ? (
                    <div className="bg-slate-800/40 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
                      No orders yet. Place a test order from the customer view!
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl shadow-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-orange-400 font-bold">#{order.id.slice(-6)} • {order.orderType}</span>
                            <h4 className="font-bold text-lg text-white mt-0.5">{order.customer.name} ({order.customer.phone})</h4>
                            {order.customer.address && <p className="text-xs text-slate-400 mt-0.5">📍 {order.customer.address}</p>}
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${order.status === 'Order Placed' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items list */}
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-slate-300">
                              <span>{it.qty}x {it.name}</span>
                              <span className="font-mono">₹{it.price * it.qty}</span>
                            </div>
                          ))}
                          <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                            <span>Total:</span>
                            <span className="text-orange-400">₹{order.total}</span>
                          </div>
                        </div>

                        {/* Admin Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Status:</span>
                            {['Order Placed', 'Preparing', 'Out for Delivery', 'Completed'].map(st => (
                              <button
                                key={st}
                                onClick={() => updateOrderStatus(order.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${order.status === st ? 'bg-orange-600 text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          {/* Rider Assignment dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Assign Rider:</span>
                            <select 
                              value={order.rider || ''}
                              onChange={(e) => assignRiderToOrder(order.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-2 py-1 text-slate-200 focus:outline-none"
                            >
                              <option value="">Select Rider</option>
                              {riders.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Menu Stock Control Panel */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500" /> Menu Stock Control</h3>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-slate-400 mb-2">Toggle dishes instantly to Sold Out if kitchen ingredients run out.</p>
                    {menu.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <div>
                          <h5 className="font-semibold text-sm">{item.name}</h5>
                          <p className="text-xs text-orange-400">₹{item.price}</p>
                        </div>
                        <button 
                          onClick={() => toggleItemStock(item.id, item.available)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${item.available ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                        >
                          {item.available ? 'In Stock' : 'Sold Out'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          PORTAL 3: RIDER MOBILE CONSOLE (?role=rider)
         ========================================== */}
      {role === 'rider' && (
        <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-2xl w-full mx-auto">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-500/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Delivery Partner Portal</span>
                <h2 className="text-xl font-bold">Rider Mobile Console</h2>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-500" /> Assigned Delivery Queue</h3>
          
          <div className="space-y-4 flex-1">
            {orders.filter(o => o.orderType === 'Delivery').length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
                No active delivery orders assigned right now.
              </div>
            ) : (
              orders.filter(o => o.orderType === 'Delivery').map(order => (
                <div key={order.id} className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl shadow-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-orange-400">Order #{order.id.slice(-5)}</span>
                      <h4 className="font-bold text-lg text-white">{order.customer.name}</h4>
                    </div>
                    <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2.5 py-1 rounded-full font-bold">
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <p className="text-slate-300 flex items-center gap-2">📍 <strong>Address:</strong> {order.customer.address || 'Takeaway / Counter delivery'}</p>
                    <p className="text-slate-300 flex items-center gap-2">📞 <strong>Phone:</strong> <a href={`tel:${order.customer.phone}`} className="text-orange-400 underline">{order.customer.phone}</a></p>
                    <p className="text-slate-300 flex items-center gap-2">💵 <strong>Amount to Collect:</strong> <span className="text-emerald-400 font-bold">₹{order.total} (Cash/UPI)</span></p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl text-xs font-bold transition"
                    >
                      Accept & Start
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Completed')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Mark Delivered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* AGENCY FOOTER ON ALL VIEWS */}
      <footer className="bg-slate-950 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 Malabar Grand Hotel • Powered by <strong>Moon Captures Digital Marketing Agency</strong></p>
        <div className="flex gap-4 text-slate-400 text-[11px]">
          <a href="?role=customer" className="hover:text-orange-400">Customer View</a>
          <span>•</span>
          <a href="?role=admin" className="hover:text-orange-400">Counter Admin Portal</a>
          <span>•</span>
          <a href="?role=rider" className="hover:text-orange-400">Rider App</a>
        </div>
      </footer>

    </div>
  );
}
