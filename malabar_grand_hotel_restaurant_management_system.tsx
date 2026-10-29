import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  Utensils,
  ShoppingBag,
  Truck,
  ChefHat,
  Search,
  Plus,
  Minus,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Users,
  PackageCheck,
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowRight,
  Trash2,
  DollarSign,
  Bike,
  Store,
  Calendar,
  X,
  Filter,
  Check,
  Navigation,
  Receipt,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

// ==========================================
// FIREBASE INITIALIZATION (MANDATORY PATTERN)
// ==========================================
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'malabar-grand-hotel-app';

// ==========================================
// INITIAL SEED DATA (KERALA / MALABAR CUISINE)
// ==========================================
const INITIAL_MENU_ITEMS = [
  {
    id: 'dish-1',
    name: 'Malabar Chicken Dum Biryani',
    category: 'Biryani & Rice',
    price: 220,
    prepTime: '15-20 mins',
    isVeg: false,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Medium',
    description: 'Traditional Thalassery kaima rice slow-cooked with tender marinated chicken, caramelized onions, and roasted cashews.',
    emoji: '🍛'
  },
  {
    id: 'dish-2',
    name: 'Quarter Alfaham Kuzhimandhi',
    category: 'Biryani & Rice',
    price: 260,
    prepTime: '15 mins',
    isVeg: false,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Spicy',
    description: 'Charcoal-grilled Arabian spiced chicken served over fragrant smoked Mandhi rice with garlic mayo and tomato chutney.',
    emoji: '🍗'
  },
  {
    id: 'dish-3',
    name: 'Nadan Beef Pepper Roast',
    category: 'Malabar Specials',
    price: 240,
    prepTime: '20 mins',
    isVeg: false,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Hot',
    description: 'Slow-roasted tender beef cubes tossed with crushed black pepper, curry leaves, coconut slivers, and Malabar spices.',
    emoji: '🥩'
  },
  {
    id: 'dish-4',
    name: 'Karimeen Pollichathu (Pearl Spot)',
    category: 'Malabar Specials',
    price: 340,
    prepTime: '25 mins',
    isVeg: false,
    inStock: true,
    bestseller: false,
    spicyLevel: 'Spicy',
    description: 'Fresh pearl spot fish marinated in tangy red masala, wrapped in banana leaf and pan-seared to perfection.',
    emoji: '🐟'
  },
  {
    id: 'dish-5',
    name: 'Lebanese Jumbo Chicken Shawarma Roll',
    category: 'Grill & Shawarma',
    price: 140,
    prepTime: '10 mins',
    isVeg: false,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Medium',
    description: 'Loaded spit-roasted chicken strips wrapped in rumali roti with toum garlic sauce, pickled veggies, and fries.',
    emoji: '🌯'
  },
  {
    id: 'dish-6',
    name: 'Peri-Peri Charcoal Half Grill Chicken',
    category: 'Grill & Shawarma',
    price: 290,
    prepTime: '20 mins',
    isVeg: false,
    inStock: true,
    bestseller: false,
    spicyLevel: 'Hot',
    description: 'Juicy half chicken basted in fiery peri-peri marinade, served with 2 kuboos, garlic dip, and fresh salad.',
    emoji: '🔥'
  },
  {
    id: 'dish-7',
    name: 'Flaky Kerala Coin Parotta (Set of 3)',
    category: 'Breads & Curries',
    price: 60,
    prepTime: '10 mins',
    isVeg: true,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Mild',
    description: 'Golden, multi-layered crispy and soft Malabar parottas beaten by hand on a hot griddle.',
    emoji: '🫓'
  },
  {
    id: 'dish-8',
    name: 'Paneer Butter Masala',
    category: 'Breads & Curries',
    price: 190,
    prepTime: '15 mins',
    isVeg: true,
    inStock: true,
    bestseller: false,
    spicyLevel: 'Mild',
    description: 'Soft cottage cheese cubes simmered in a rich, creamy tomato and cashew gravy finished with kasuri methi.',
    emoji: '🧀'
  },
  {
    id: 'dish-9',
    name: 'Mint Ginger Fresh Lime Cooler',
    category: 'Beverages',
    price: 50,
    prepTime: '5 mins',
    isVeg: true,
    inStock: true,
    bestseller: true,
    spicyLevel: 'Mild',
    description: 'Refreshing freshly squeezed lime blended with crushed mint leaves, zesty ginger, and chilled soda or water.',
    emoji: '🍹'
  },
  {
    id: 'dish-10',
    name: 'Malabar Sulaimani & Pazhampori Combo',
    category: 'Beverages',
    price: 85,
    prepTime: '10 mins',
    isVeg: true,
    inStock: true,
    bestseller: false,
    spicyLevel: 'Mild',
    description: 'Spiced cardamom-clove black tea paired with two crispy golden ripe banana fritters.',
    emoji: '☕'
  }
];

const INITIAL_DELIVERY_STAFF = [
  {
    id: 'staff-1',
    name: 'Riyas K.',
    phone: '9847011223',
    vehicle: 'Honda Activa • KL-11-AB-4412',
    type: 'Temporary / Peak Rush',
    active: true,
    joinedAt: Date.now() - 86400000
  },
  {
    id: 'staff-2',
    name: 'Vishnu Prasad',
    phone: '9447233445',
    vehicle: 'TVS Apache • KL-10-CD-8890',
    type: 'Part-Time Evening',
    active: true,
    joinedAt: Date.now() - 72000000
  },
  {
    id: 'staff-3',
    name: 'Shafeeq M.',
    phone: '9995466778',
    vehicle: 'Ather 450X EV • KL-58-EF-1029',
    type: 'Full-Time Fleet',
    active: true,
    joinedAt: Date.now() - 120000000
  }
];

const INITIAL_SAMPLE_ORDERS = [
  {
    id: 'ord-sample-101',
    orderNumber: 'MG-1042',
    customerName: 'Anoop Menon',
    customerPhone: '9895123456',
    orderType: 'DELIVERY',
    addressOrTable: 'Flat 4B, Skyline Emerald Apartments, Bypass Road',
    paymentMethod: 'Cash on Delivery (COD)',
    items: [
      { id: 'dish-1', name: 'Malabar Chicken Dum Biryani', price: 220, qty: 2, emoji: '🍛' },
      { id: 'dish-5', name: 'Lebanese Jumbo Chicken Shawarma Roll', price: 140, qty: 1, emoji: '🌯' },
      { id: 'dish-9', name: 'Mint Ginger Fresh Lime Cooler', price: 50, qty: 2, emoji: '🍹' }
    ],
    subtotal: 680,
    deliveryFee: 30,
    totalAmount: 710,
    status: 'NEW', // NEW | PREPARING | OUT_FOR_DELIVERY | COMPLETED
    assignedStaffId: '',
    assignedStaffName: '',
    assignedStaffPhone: '',
    notes: 'Extra mayo and pickle please',
    createdAt: Date.now() - 1000 * 60 * 6
  },
  {
    id: 'ord-sample-102',
    orderNumber: 'MG-1041',
    customerName: 'Fathima Suhara',
    customerPhone: '9746987654',
    orderType: 'DELIVERY',
    addressOrTable: 'Green Villa, Near Civil Station Post Office, 2nd Cross',
    paymentMethod: 'UPI Paid',
    items: [
      { id: 'dish-2', name: 'Quarter Alfaham Kuzhimandhi', price: 260, qty: 2, emoji: '🍗' },
      { id: 'dish-3', name: 'Nadan Beef Pepper Roast', price: 240, qty: 1, emoji: '🥩' }
    ],
    subtotal: 760,
    deliveryFee: 30,
    totalAmount: 790,
    status: 'OUT_FOR_DELIVERY',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Riyas K.',
    assignedStaffPhone: '9847011223',
    notes: 'Call when reaching the gate',
    createdAt: Date.now() - 1000 * 60 * 22
  }
];

const CATEGORIES = [
  'All',
  'Biryani & Rice',
  'Malabar Specials',
  'Grill & Shawarma',
  'Breads & Curries',
  'Beverages'
];

export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePortal, setActivePortal] = useState('CUSTOMER'); // CUSTOMER | ADMIN | DELIVERY
  const [toast, setToast] = useState(null);

  // Firestore Collections State
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  // Customer Portal State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerTab, setCustomerTab] = useState('MENU'); // MENU | TRACKER
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'DELIVERY', // DELIVERY | TAKEAWAY | DINE_IN
    addressOrTable: '',
    paymentMethod: 'Cash on Delivery (COD)',
    notes: ''
  });
  const [recentOrderIds, setRecentOrderIds] = useState([]);
  const [trackerPhoneSearch, setTrackerPhoneSearch] = useState('');

  // Admin Portal State
  const [adminTab, setAdminTab] = useState('ORDERS'); // ORDERS | STAFF | MENU
  const [adminStatusFilter, setAdminStatusFilter] = useState('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    phone: '',
    vehicle: '',
    type: 'Temporary / Peak Rush'
  });
  const [newDishForm, setNewDishForm] = useState({
    name: '',
    category: 'Biryani & Rice',
    price: '',
    prepTime: '15 mins',
    isVeg: false,
    spicyLevel: 'Medium',
    description: '',
    emoji: '🍛'
  });
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  // Delivery Partner Portal State
  const [selectedRiderId, setSelectedRiderId] = useState('staff-1');
  const [riderFilter, setRiderFilter] = useState('ACTIVE'); // ACTIVE | COMPLETED

  const prevOrderCountRef = useRef(0);

  // Helper to show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Web Audio Synth for Kitchen Order Alert Bell
  const playKitchenBell = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) {
      // Ignore audio errors if browser blocks autoplay
    }
  };

  // ==========================================
  // 1. FIREBASE AUTHENTICATION (RULE 3)
  // ==========================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Authentication error:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // ==========================================
  // 2. FIRESTORE LISTENERS & SEEDING (RULE 1 & 2)
  // ==========================================
  useEffect(() => {
    if (!user) return;

    const menuCol = collection(db, 'artifacts', appId, 'public', 'data', 'menuItems');
    const ordersCol = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    const staffCol = collection(db, 'artifacts', appId, 'public', 'data', 'deliveryStaff');

    const unsubMenu = onSnapshot(
      menuCol,
      async (snapshot) => {
        if (snapshot.empty && !isSeeding) {
          setIsSeeding(true);
          try {
            for (const item of INITIAL_MENU_ITEMS) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'menuItems', item.id), item);
            }
          } catch (e) {
            console.error('Error seeding menu:', e);
          }
        } else {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setMenuItems(items);
        }
      },
      (error) => console.error('Menu listener error:', error)
    );

    const unsubStaff = onSnapshot(
      staffCol,
      async (snapshot) => {
        if (snapshot.empty && !isSeeding) {
          try {
            for (const staff of INITIAL_DELIVERY_STAFF) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'deliveryStaff', staff.id), staff);
            }
          } catch (e) {
            console.error('Error seeding staff:', e);
          }
        } else {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
          setDeliveryStaff(list);
          if (list.length > 0 && !list.some((s) => s.id === selectedRiderId)) {
            setSelectedRiderId(list[0].id);
          }
        }
      },
      (error) => console.error('Staff listener error:', error)
    );

    const unsubOrders = onSnapshot(
      ordersCol,
      async (snapshot) => {
        if (snapshot.empty && !isSeeding) {
          try {
            for (const ord of INITIAL_SAMPLE_ORDERS) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', ord.id), ord);
            }
          } catch (e) {
            console.error('Error seeding orders:', e);
          }
        } else {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          // Sort newest first in memory (Rule 2)
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          if (prevOrderCountRef.current > 0 && list.length > prevOrderCountRef.current) {
            playKitchenBell();
          }
          prevOrderCountRef.current = list.length;
          setOrders(list);
        }
      },
      (error) => console.error('Orders listener error:', error)
    );

    return () => {
      unsubMenu();
      unsubStaff();
      unsubOrders();
    };
  }, [user]);

  // ==========================================
  // CART & ORDERING FUNCTIONS
  // ==========================================
  const addToCart = (item) => {
    if (!item.inStock) {
      showToast(`${item.name} is currently sold out!`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: 1 }];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const cartSubtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const deliveryFee = orderForm.orderType === 'DELIVERY' && cartSubtotal > 0 ? (cartSubtotal >= 500 ? 0 : 30) : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const totalCartItems = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    if (!orderForm.customerName.trim() || !orderForm.customerPhone.trim() || !orderForm.addressOrTable.trim()) {
      showToast('Please fill in your name, phone number, and address/table details.', 'error');
      return;
    }

    const orderNum = `MG-${Math.floor(1050 + Math.random() * 8900)}`;
    const newOrder = {
      orderNumber: orderNum,
      customerName: orderForm.customerName.trim(),
      customerPhone: orderForm.customerPhone.trim(),
      orderType: orderForm.orderType,
      addressOrTable: orderForm.addressOrTable.trim(),
      paymentMethod: orderForm.paymentMethod,
      notes: orderForm.notes.trim(),
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      totalAmount: cartTotal,
      status: 'NEW',
      assignedStaffId: '',
      assignedStaffName: '',
      assignedStaffPhone: '',
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), newOrder);
      setRecentOrderIds((prev) => [docRef.id, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      setCustomerTab('TRACKER');
      showToast(`Order #${orderNum} placed! Kitchen has received your order.`);
    } catch (error) {
      console.error('Failed to place order:', error);
      showToast('Could not place order. Please try again.', 'error');
    }
  };

  // ==========================================
  // ADMIN & DELIVERY ACTIONS
  // ==========================================
  const updateOrderStatus = async (orderId, nextStatus) => {
    if (!user) return;
    try {
      const orderRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await updateDoc(orderRef, {
        status: nextStatus,
        updatedAt: Date.now()
      });
      showToast(`Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Error updating order status', 'error');
    }
  };

  const assignRiderToOrder = async (orderId, staffId) => {
    if (!user) return;
    const staffMember = deliveryStaff.find((s) => s.id === staffId);
    try {
      const orderRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
      await updateDoc(orderRef, {
        assignedStaffId: staffMember ? staffMember.id : '',
        assignedStaffName: staffMember ? staffMember.name : '',
        assignedStaffPhone: staffMember ? staffMember.phone : '',
        updatedAt: Date.now()
      });
      if (staffMember) {
        showToast(`Assigned ${staffMember.name} to delivery`);
      } else {
        showToast('Delivery partner unassigned');
      }
    } catch (err) {
      console.error('Error assigning rider:', err);
    }
  };

  const handleAddTemporaryStaff = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newStaffForm.name.trim() || !newStaffForm.phone.trim()) {
      showToast('Please enter staff name and mobile number', 'error');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'deliveryStaff'), {
        name: newStaffForm.name.trim(),
        phone: newStaffForm.phone.trim(),
        vehicle: newStaffForm.vehicle.trim() || 'Two-Wheeler',
        type: newStaffForm.type,
        active: true,
        joinedAt: Date.now()
      });
      setNewStaffForm({ name: '', phone: '', vehicle: '', type: 'Temporary / Peak Rush' });
      showToast('New temporary delivery partner added and ready for orders!');
    } catch (err) {
      console.error('Error adding staff:', err);
      showToast('Failed to add delivery staff', 'error');
    }
  };

  const toggleStaffActive = async (staff) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'deliveryStaff', staff.id), {
        active: !staff.active
      });
      showToast(`${staff.name} marked as ${!staff.active ? 'On-Duty' : 'Off-Duty'}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStaffMember = async (staffId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'deliveryStaff', staffId));
      showToast('Delivery staff removed');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMenuItemStock = async (item) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'menuItems', item.id), {
        inStock: !item.inStock
      });
      showToast(`${item.name} marked ${!item.inStock ? 'In Stock' : 'Sold Out'}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewDish = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newDishForm.name.trim() || !newDishForm.price) {
      showToast('Dish name and price are required', 'error');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'menuItems'), {
        name: newDishForm.name.trim(),
        category: newDishForm.category,
        price: Number(newDishForm.price),
        prepTime: newDishForm.prepTime || '15 mins',
        isVeg: Boolean(newDishForm.isVeg),
        inStock: true,
        bestseller: false,
        spicyLevel: newDishForm.spicyLevel,
        description: newDishForm.description.trim() || 'Freshly prepared chef special.',
        emoji: newDishForm.emoji || '🍲'
      });
      setShowAddDishModal(false);
      setNewDishForm({
        name: '',
        category: 'Biryani & Rice',
        price: '',
        prepTime: '15 mins',
        isVeg: false,
        spicyLevel: 'Medium',
        description: '',
        emoji: '🍛'
      });
      showToast('New dish added to live menu!');
    } catch (err) {
      console.error(err);
      showToast('Could not add dish', 'error');
    }
  };

  // ==========================================
  // COMPUTED DATA & FILTERS
  // ==========================================
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg;
      return matchesCat && matchesSearch && matchesVeg;
    });
  }, [menuItems, selectedCategory, searchQuery, vegOnly]);

  const activeOrderCounts = useMemo(() => {
    return {
      NEW: orders.filter((o) => o.status === 'NEW').length,
      PREPARING: orders.filter((o) => o.status === 'PREPARING').length,
      OUT_FOR_DELIVERY: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
      COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length
    };
  }, [orders]);

  const todayRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const customerTrackedOrders = useMemo(() => {
    if (trackerPhoneSearch.trim()) {
      return orders.filter(
        (o) =>
          o.customerPhone?.includes(trackerPhoneSearch.trim()) ||
          o.orderNumber?.toLowerCase().includes(trackerPhoneSearch.trim().toLowerCase())
      );
    }
    if (recentOrderIds.length > 0) {
      return orders.filter((o) => recentOrderIds.includes(o.id) || o.id.startsWith('ord-sample'));
    }
    return orders.slice(0, 4);
  }, [orders, recentOrderIds, trackerPhoneSearch]);

  const selectedRider = useMemo(
    () => deliveryStaff.find((s) => s.id === selectedRiderId) || deliveryStaff[0],
    [deliveryStaff, selectedRiderId]
  );

  const riderOrders = useMemo(() => {
    if (!selectedRider) return [];
    return orders.filter((o) => o.assignedStaffId === selectedRider.id);
  }, [orders, selectedRider]);

  // Format relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diffMins = Math.floor((Date.now() - timestamp) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ${diffMins % 60}m ago`;
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse mb-4">
          <Utensils className="w-7 h-7 text-amber-400" />
        </div>
        <p className="text-lg font-semibold text-amber-400">Connecting to Malabar Grand Kitchen Live Sync...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* ==========================================
          TOP UNIFIED ROLE SWITCHER BAR
      ========================================== */}
      <div className="bg-stone-900/95 border-b border-stone-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Utensils className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  MALABAR GRAND
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Cloud Sync
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Hotel, Kitchen & Express Delivery Management Suite
              </p>
            </div>
          </div>

          {/* 3-Portal Switcher Pills */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setActivePortal('CUSTOMER')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activePortal === 'CUSTOMER'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => setActivePortal('ADMIN')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activePortal === 'ADMIN'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Hotel Admin</span>
              {activeOrderCounts.NEW > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activePortal === 'ADMIN'
                      ? 'bg-stone-950 text-amber-400'
                      : 'bg-rose-500 text-white animate-bounce'
                  }`}
                >
                  {activeOrderCounts.NEW}
                </span>
              )}
            </button>

            <button
              onClick={() => setActivePortal('DELIVERY')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activePortal === 'DELIVERY'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Rider App</span>
              {activeOrderCounts.OUT_FOR_DELIVERY > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activePortal === 'DELIVERY'
                      ? 'bg-stone-950 text-amber-400'
                      : 'bg-emerald-500 text-stone-950'
                  }`}
                >
                  {activeOrderCounts.OUT_FOR_DELIVERY}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-stone-900 border border-amber-500/40 text-stone-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* =====================================================================
          PORTAL 1: CUSTOMER ORDERING & LIVE ORDER TRACKER
      ===================================================================== */}
      {activePortal === 'CUSTOMER' && (
        <div className="flex-1 flex flex-col">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border-b border-stone-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Authentic Malabar Kitchen • Hot Home Delivery in 30 Mins</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Fresh Dum Biryani, Smokey Alfaham & Hot Parottas
                </h2>
                <p className="text-stone-400 text-sm sm:text-base">
                  Order directly from our hotel kitchen for lightning-fast doorstep delivery, takeaway pickup, or instant table dining.
                </p>
              </div>

              {/* Customer Sub-navigation (Menu vs Live Order Tracker) */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setCustomerTab('MENU')}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                    customerTab === 'MENU'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Explore Menu</span>
                </button>

                <button
                  onClick={() => setCustomerTab('TRACKER')}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                    customerTab === 'TRACKER'
                      ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Track Live Order</span>
                  {orders.filter((o) => o.status !== 'COMPLETED').length > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-stone-950/40 font-bold">
                      {orders.filter((o) => o.status !== 'COMPLETED').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/30 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart ({totalCartItems})</span>
                  {cartSubtotal > 0 && <span className="text-white">• ₹{cartSubtotal}</span>}
                </button>
              </div>
            </div>
          </div>

          {customerTab === 'MENU' ? (
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
              {/* Search & Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Dum Biryani, Alfaham, Shawarma, Parotta..."
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 shrink-0 transition-all ${
                      vegOnly
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Pure Veg Only
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                        : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-24">
                {filteredMenu.map((item) => {
                  const inCartItem = cart.find((c) => c.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`bg-stone-900/90 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                        item.inStock
                          ? 'border-stone-800 hover:border-amber-500/40'
                          : 'border-stone-800/50 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-stone-800/90 border border-stone-700/60 flex items-center justify-center text-3xl shrink-0">
                            {item.emoji || '🍛'}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 justify-end">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                item.isVeg
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {item.isVeg ? '● Veg' : '▲ Non-Veg'}
                            </span>
                            {item.bestseller && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                ★ Bestseller
                              </span>
                            )}
                            {!item.inStock && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-800 text-stone-400">
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg text-white mb-1">{item.name}</h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-lg font-extrabold text-amber-400">₹{item.price}</span>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span>{item.prepTime}</span>
                            <span>•</span>
                            <span>{item.spicyLevel}</span>
                          </div>
                        </div>

                        {!item.inStock ? (
                          <button
                            disabled
                            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-500 text-xs font-bold cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        ) : inCartItem ? (
                          <div className="flex items-center gap-2 bg-amber-500 text-stone-950 rounded-xl px-2 py-1 font-bold">
                            <button
                              onClick={() => updateCartQty(item.id, -1)}
                              className="p-1 hover:bg-stone-950/10 rounded-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm min-w-[20px] text-center">{inCartItem.qty}</span>
                            <button
                              onClick={() => updateCartQty(item.id, 1)}
                              className="p-1 hover:bg-stone-950/10 rounded-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CUSTOMER LIVE ORDER TRACKER VIEW */
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-emerald-400" />
                      Real-Time Order Status Tracker
                    </h3>
                    <p className="text-xs text-stone-400">
                      Updates automatically as the kitchen prepares and dispatches your meal
                    </p>
                  </div>
                  <div className="relative sm:w-64">
                    <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trackerPhoneSearch}
                      onChange={(e) => setTrackerPhoneSearch(e.target.value)}
                      placeholder="Filter by phone or Order #..."
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {customerTrackedOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-stone-600" />
                      <p className="font-semibold">No matching orders found</p>
                      <p className="text-xs mt-1">Place a new order from the menu to watch live updates!</p>
                    </div>
                  ) : (
                    customerTrackedOrders.map((order) => {
                      const steps = ['NEW', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED'];
                      const currentStepIndex = steps.indexOf(order.status);

                      return (
                        <div
                          key={order.id}
                          className="bg-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-amber-400 text-base">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 font-medium">
                                  {order.orderType}
                                </span>
                                <span className="text-xs text-stone-500">
                                  {formatTimeAgo(order.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-stone-400 mt-0.5">
                                {order.customerName} • {order.addressOrTable}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-white">
                                ₹{order.totalAmount}
                              </span>
                              <p className="text-[11px] text-stone-400">{order.paymentMethod}</p>
                            </div>
                          </div>

                          {/* 4-Step Visual Progress Bar */}
                          <div className="grid grid-cols-4 gap-2 pt-1">
                            {[
                              { key: 'NEW', label: 'Order Placed', icon: Receipt },
                              { key: 'PREPARING', label: 'Preparing in Kitchen', icon: Flame },
                              {
                                key: 'OUT_FOR_DELIVERY',
                                label: order.orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
                                icon: Bike
                              },
                              { key: 'COMPLETED', label: 'Delivered / Served', icon: CheckCircle2 }
                            ].map((step, idx) => {
                              const Icon = step.icon;
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <div
                                  key={step.key}
                                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                                    isCurrent
                                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                                      : isCompleted
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                      : 'bg-stone-900/50 border-stone-800 text-stone-600'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="text-[11px] font-semibold leading-tight">
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Assigned Delivery Partner Banner */}
                          {order.assignedStaffName && (
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                  <Bike className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-emerald-300">
                                    Delivery Partner Assigned: {order.assignedStaffName}
                                  </p>
                                  <p className="text-[11px] text-stone-400">
                                    Contact Rider: {order.assignedStaffPhone}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={`tel:${order.assignedStaffPhone}`}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call Rider
                              </a>
                            </div>
                          )}

                          {/* Ordered Items Summary */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {order.items?.map((it, i) => (
                              <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300"
                              >
                                {it.emoji} {it.qty}x {it.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Mobile Bottom Cart Bar */}
          {cart.length > 0 && !isCartOpen && (
            <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-30">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 p-4 rounded-2xl shadow-2xl flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-950 text-amber-400 text-sm">
                    {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-base">₹{cartTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

          {/* SLIDE-OVER CART & CHECKOUT DRAWER */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
              <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col justify-between overflow-y-auto">
                <div className="p-5 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-lg text-white">Your Order Basket</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="p-10 text-center my-auto space-y-3">
                    <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
                    <p className="text-stone-300 font-semibold">Your cart is empty</p>
                    <p className="text-xs text-stone-500">
                      Add delicious Malabar biryanis, grills, or parottas to place an order.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="p-5 space-y-5 flex-1 overflow-y-auto">
                    {/* Cart Items */}
                    <div className="space-y-2.5">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                              <p className="text-sm font-semibold text-white">{item.name}</p>
                              <p className="text-xs text-amber-400 font-bold">
                                ₹{item.price * item.qty}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, -1)}
                              className="text-stone-300 hover:text-white p-0.5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 1)}
                              className="text-stone-300 hover:text-white p-0.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Mode Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Select Service Mode
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'DELIVERY', label: 'Home Delivery' },
                          { id: 'TAKEAWAY', label: 'Takeaway' },
                          { id: 'DINE_IN', label: 'Dine-In Table' }
                        ].map((mode) => (
                          <button
                            type="button"
                            key={mode.id}
                            onClick={() => setOrderForm({ ...orderForm, orderType: mode.id })}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                              orderForm.orderType === mode.id
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                : 'bg-stone-950 border-stone-800 text-stone-400'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={orderForm.customerName}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, customerName: e.target.value })
                          }
                          placeholder="e.g., Rahul Nair"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">
                          Mobile Number (for Live Tracking & Rider Call) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={orderForm.customerPhone}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, customerPhone: e.target.value })
                          }
                          placeholder="e.g., 9847012345"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">
                          {orderForm.orderType === 'DELIVERY'
                            ? 'Complete Delivery Address & Landmark *'
                            : orderForm.orderType === 'DINE_IN'
                            ? 'Table Number / Guest Count *'
                            : 'Pickup Time / Vehicle Note *'}
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={orderForm.addressOrTable}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, addressOrTable: e.target.value })
                          }
                          placeholder={
                            orderForm.orderType === 'DELIVERY'
                              ? 'House No, Street, Landmark...'
                              : orderForm.orderType === 'DINE_IN'
                              ? 'Table #4 (Family AC Section)'
                              : 'Picking up in 20 mins'
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-stone-400 mb-1">Payment Mode</label>
                          <select
                            value={orderForm.paymentMethod}
                            onChange={(e) =>
                              setOrderForm({ ...orderForm, paymentMethod: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Cash on Delivery (COD)">Cash on Delivery / Pay at Hotel</option>
                            <option value="UPI Paid">UPI Instant Pay (GPay/PhonePe)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-stone-400 mb-1">Cooking Note</label>
                          <input
                            type="text"
                            value={orderForm.notes}
                            onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                            placeholder="Less spicy, extra mayo..."
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-stone-400">
                        <span>Items Subtotal</span>
                        <span>₹{cartSubtotal}</span>
                      </div>
                      {orderForm.orderType === 'DELIVERY' && (
                        <div className="flex justify-between text-stone-400">
                          <span>Delivery Partner Fee (Free above ₹500)</span>
                          <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                        </div>
                      )}
                      <div className="border-t border-stone-800 pt-2 flex justify-between text-sm font-extrabold text-white">
                        <span>Total Payable</span>
                        <span className="text-amber-400">₹{cartTotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all"
                    >
                      Confirm & Send Order to Kitchen (₹{cartTotal})
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PORTAL 2: HOTEL ADMIN, KITCHEN & TEMPORARY STAFF MANAGER
      ===================================================================== */}
      {activePortal === 'ADMIN' && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
          {/* Top KPI & Sub-Nav Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400">New Kitchen Orders</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-extrabold text-rose-400">{activeOrderCounts.NEW}</span>
                <Flame className="w-6 h-6 text-rose-400" />
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400">Out for Delivery</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-extrabold text-amber-400">
                  {activeOrderCounts.OUT_FOR_DELIVERY}
                </span>
                <Bike className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400">Active Delivery Staff</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {deliveryStaff.filter((s) => s.active).length} / {deliveryStaff.length}
                </span>
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400">Total Live Order Volume</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-extrabold text-white">₹{todayRevenue}</span>
                <Receipt className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Admin Section Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAdminTab('ORDERS')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  adminTab === 'ORDERS'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Live Order Dispatch Board ({orders.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('STAFF')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  adminTab === 'STAFF'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Temporary Delivery Staff Manager ({deliveryStaff.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('MENU')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  adminTab === 'MENU'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Menu & Rush-Hour Stock Control</span>
              </button>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Kitchen Bell On' : 'Muted'}</span>
            </button>
          </div>

          {/* TAB 1: LIVE ORDER DISPATCH BOARD */}
          {adminTab === 'ORDERS' && (
            <div className="space-y-4">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { key: 'ALL', label: `All Orders (${orders.length})` },
                  { key: 'NEW', label: `New (${activeOrderCounts.NEW})` },
                  { key: 'PREPARING', label: `Preparing (${activeOrderCounts.PREPARING})` },
                  {
                    key: 'OUT_FOR_DELIVERY',
                    label: `Out for Delivery (${activeOrderCounts.OUT_FOR_DELIVERY})`
                  },
                  { key: 'COMPLETED', label: `Completed (${activeOrderCounts.COMPLETED})` }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setAdminStatusFilter(st.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                      adminStatusFilter === st.key
                        ? 'bg-stone-100 text-stone-950'
                        : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders
                  .filter((o) => adminStatusFilter === 'ALL' || o.status === adminStatusFilter)
                  .map((order) => (
                    <div
                      key={order.id}
                      className={`bg-stone-900 rounded-2xl p-4 border flex flex-col justify-between gap-4 ${
                        order.status === 'NEW'
                          ? 'border-rose-500/60 shadow-lg shadow-rose-500/5'
                          : order.status === 'PREPARING'
                          ? 'border-amber-500/50'
                          : order.status === 'OUT_FOR_DELIVERY'
                          ? 'border-sky-500/50'
                          : 'border-stone-800 opacity-80'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-extrabold text-white">
                                #{order.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  order.status === 'NEW'
                                    ? 'bg-rose-500 text-white'
                                    : order.status === 'PREPARING'
                                    ? 'bg-amber-500 text-stone-950'
                                    : order.status === 'OUT_FOR_DELIVERY'
                                    ? 'bg-sky-500 text-stone-950'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}
                              >
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 mt-0.5">
                              {formatTimeAgo(order.createdAt)} •{' '}
                              <span className="text-amber-300 font-semibold">{order.orderType}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-amber-400">
                              ₹{order.totalAmount}
                            </span>
                            <p className="text-[10px] text-stone-400">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs space-y-1">
                          <div className="flex items-center justify-between font-semibold text-white">
                            <span>{order.customerName}</span>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {order.customerPhone}
                            </a>
                          </div>
                          <p className="text-stone-400 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                            <span>{order.addressOrTable}</span>
                          </p>
                          {order.notes && (
                            <p className="text-amber-300/90 italic pt-1">Note: "{order.notes}"</p>
                          )}
                        </div>

                        {/* Item List */}
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1 border-b border-stone-800/60 last:border-0"
                            >
                              <span className="text-stone-200 font-medium">
                                {item.emoji} <strong className="text-amber-400">{item.qty}x</strong>{' '}
                                {item.name}
                              </span>
                              <span className="text-stone-400">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Staff Assignment + Status Action */}
                      <div className="space-y-2.5 pt-2 border-t border-stone-800">
                        {order.orderType === 'DELIVERY' && (
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              Assign Delivery Partner (Regular or Temp Staff):
                            </label>
                            <select
                              value={order.assignedStaffId || ''}
                              onChange={(e) => assignRiderToOrder(order.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="">-- Unassigned (Select Rider) --</option>
                              {deliveryStaff
                                .filter((s) => s.active)
                                .map((rider) => (
                                  <option key={rider.id} value={rider.id}>
                                    {rider.name} ({rider.type}) • {rider.phone}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}

                        {/* Quick One-Click Progression Buttons */}
                        <div className="flex items-center gap-2">
                          {order.status === 'NEW' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5"
                            >
                              <Flame className="w-4 h-4" />
                              Accept & Start Preparing
                            </button>
                          )}

                          {order.status === 'PREPARING' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5"
                            >
                              <Bike className="w-4 h-4" />
                              {order.orderType === 'DELIVERY'
                                ? 'Dispatch Out for Delivery'
                                : 'Mark Ready for Pickup/Table'}
                            </button>
                          )}

                          {order.status === 'OUT_FOR_DELIVERY' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Mark Delivered & Completed
                            </button>
                          )}

                          {order.status === 'COMPLETED' && (
                            <div className="w-full py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl">
                              ✓ Order Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: TEMPORARY DELIVERY STAFF MANAGER */}
          {adminTab === 'STAFF' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Onboarding Form for Rush-Hour Temporary Delivery Boys */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 h-fit">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Add Temporary Delivery Staff
                    </h3>
                    <p className="text-xs text-stone-400">
                      Onboard part-time or rush-hour riders in 10 seconds
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddTemporaryStaff} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Rider Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      placeholder="e.g., Salman Faris"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                      placeholder="e.g., 9847099887"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      Vehicle / Bike Number
                    </label>
                    <input
                      type="text"
                      value={newStaffForm.vehicle}
                      onChange={(e) =>
                        setNewStaffForm({ ...newStaffForm, vehicle: e.target.value })
                      }
                      placeholder="e.g., Bajaj Pulsar • KL-11-Z-9012"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Shift / Staff Type</label>
                    <select
                      value={newStaffForm.type}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Temporary / Peak Rush">Temporary / Peak Rush</option>
                      <option value="Part-Time Evening">Part-Time Evening Shift</option>
                      <option value="Weekend Extra Rider">Weekend Extra Rider</option>
                      <option value="Full-Time Fleet">Full-Time Hotel Staff</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm transition-all"
                  >
                    + Register & Activate Rider Now
                  </button>
                </form>
              </div>

              {/* Active & Temporary Riders Roster */}
              <div className="lg:col-span-2 space-y-3">
                {deliveryStaff.map((staff) => {
                  const staffOrders = orders.filter((o) => o.assignedStaffId === staff.id);
                  const activeCount = staffOrders.filter((o) => o.status !== 'COMPLETED').length;
                  const completedCount = staffOrders.filter((o) => o.status === 'COMPLETED').length;
                  const cashCollected = staffOrders
                    .filter((o) => o.status === 'COMPLETED')
                    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

                  return (
                    <div
                      key={staff.id}
                      className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{staff.name}</span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                            {staff.type}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              staff.active
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-stone-800 text-stone-500'
                            }`}
                          >
                            {staff.active ? 'On-Duty' : 'Off-Duty'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Phone: <strong className="text-stone-200">{staff.phone}</strong> •{' '}
                          {staff.vehicle}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <span className="text-sky-400 font-semibold">
                            Active Deliveries: {activeCount}
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            Completed Today: {completedCount}
                          </span>
                          <span className="text-amber-400 font-semibold">
                            Order Value Handled: ₹{cashCollected}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleStaffActive(staff)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                            staff.active
                              ? 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                              : 'bg-emerald-500 text-stone-950 border-emerald-500'
                          }`}
                        >
                          {staff.active ? 'Mark Off-Duty' : 'Set On-Duty'}
                        </button>
                        <button
                          onClick={() => deleteStaffMember(staff.id)}
                          className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-500 hover:text-rose-400"
                          title="Remove Staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MENU & RUSH-HOUR STOCK CONTROL */}
          {adminTab === 'MENU' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Live Menu Availability Control
                  </h3>
                  <p className="text-xs text-stone-400">
                    Instantly mark dishes Sold Out or In Stock during peak dining hours
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="font-bold text-sm text-white">{item.name}</p>
                        <p className="text-xs text-stone-400">
                          {item.category} • <strong className="text-amber-400">₹{item.price}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMenuItemStock(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        item.inStock
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal to Add New Dish */}
          {showAddDishModal && (
            <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">Add Dish to Live Menu</h3>
                  <button
                    onClick={() => setShowAddDishModal(false)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddNewDish} className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Dish Name *</label>
                    <input
                      type="text"
                      required
                      value={newDishForm.name}
                      onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                      placeholder="e.g., Thalassery Mutton Dum Biryani"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Category</label>
                      <select
                        value={newDishForm.category}
                        onChange={(e) =>
                          setNewDishForm({ ...newDishForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white"
                      >
                        {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={newDishForm.price}
                        onChange={(e) => setNewDishForm({ ...newDishForm, price: e.target.value })}
                        placeholder="280"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Food Icon Emoji</label>
                      <input
                        type="text"
                        value={newDishForm.emoji}
                        onChange={(e) => setNewDishForm({ ...newDishForm, emoji: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white"
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newDishForm.isVeg}
                          onChange={(e) =>
                            setNewDishForm({ ...newDishForm, isVeg: e.target.checked })
                          }
                          className="rounded"
                        />
                        Pure Vegetarian Dish
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={newDishForm.description}
                      onChange={(e) =>
                        setNewDishForm({ ...newDishForm, description: e.target.value })
                      }
                      placeholder="Describe key ingredients & serving style..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-sm"
                  >
                    Save & Publish Dish
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PORTAL 3: DELIVERY PARTNER MOBILE PORTAL (FOR REGULAR & TEMP RIDERS)
      ===================================================================== */}
      {activePortal === 'DELIVERY' && (
        <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1 space-y-5">
          {/* Rider Identity Selector Header */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Delivery Partner Mobile Console
                  </span>
                  <h2 className="text-lg font-extrabold text-white">
                    {selectedRider ? selectedRider.name : 'Select Your Rider Profile'}
                  </h2>
                  {selectedRider && (
                    <p className="text-xs text-stone-400">
                      {selectedRider.type} • {selectedRider.vehicle}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  Switch Logged-in Rider:
                </label>
                <select
                  value={selectedRider?.id || ''}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                >
                  {deliveryStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rider Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800">
              <button
                onClick={() => setRiderFilter('ACTIVE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  riderFilter === 'ACTIVE'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <span className="text-xs block">Assigned Active Tasks</span>
                <span className="text-2xl font-extrabold text-white">
                  {riderOrders.filter((o) => o.status !== 'COMPLETED').length}
                </span>
              </button>

              <button
                onClick={() => setRiderFilter('COMPLETED')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  riderFilter === 'COMPLETED'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <span className="text-xs block">Completed Deliveries</span>
                <span className="text-2xl font-extrabold text-white">
                  {riderOrders.filter((o) => o.status === 'COMPLETED').length}
                </span>
              </button>
            </div>
          </div>

          {/* Rider Assigned Order Cards */}
          <div className="space-y-4">
            {riderOrders.filter((o) =>
              riderFilter === 'ACTIVE' ? o.status !== 'COMPLETED' : o.status === 'COMPLETED'
            ).length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <PackageCheck className="w-10 h-10 text-stone-600 mx-auto" />
                <p className="font-bold text-stone-300">
                  {riderFilter === 'ACTIVE'
                    ? 'No active deliveries assigned to you right now'
                    : 'No completed deliveries yet'}
                </p>
                <p className="text-xs text-stone-500">
                  When the Hotel Admin assigns an order to {selectedRider?.name}, it will appear here immediately with sound/live sync.
                </p>
              </div>
            ) : (
              riderOrders
                .filter((o) =>
                  riderFilter === 'ACTIVE' ? o.status !== 'COMPLETED' : o.status === 'COMPLETED'
                )
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Order #{order.orderNumber}
                        </span>
                        <h3 className="text-lg font-extrabold text-white mt-1">
                          {order.customerName}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-emerald-400">
                          ₹{order.totalAmount}
                        </span>
                        <span className="block text-[11px] font-bold text-amber-300">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Address & Direct Call Action */}
                    <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] uppercase font-bold text-stone-500 block">
                            Drop-off Address
                          </span>
                          <p className="text-sm font-semibold text-white">
                            {order.addressOrTable}
                          </p>
                        </div>
                      </div>

                      {order.notes && (
                        <p className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg">
                          Customer Note: "{order.notes}"
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>Call Customer ({order.customerPhone})</span>
                        </a>
                      </div>
                    </div>

                    {/* Package Items Check */}
                    <div className="text-xs text-stone-400 space-y-1">
                      <span className="font-bold text-stone-300 block">
                        Collect Package Items from Kitchen:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {order.items?.map((it, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-200"
                          >
                            {it.qty}x {it.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rider Single-Tap Big Action Button */}
                    {order.status !== 'COMPLETED' && (
                      <div className="pt-2">
                        {order.status !== 'OUT_FOR_DELIVERY' ? (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                          >
                            <Bike className="w-5 h-5" />
                            <span>Picked Up Package • Start Delivery</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Mark Order Delivered ({order.paymentMethod})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}