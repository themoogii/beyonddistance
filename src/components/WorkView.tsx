import React, { useState, useEffect } from "react";
import { AnimatedCopy } from "./AnimatedCopy";
import { playHoverSound, playSuccessSound } from "../utils/sfx";
import { ParticleButton } from "./ParticleButton";

interface Product {
  id: string;
  name: string;
  priceMnt: number;
  priceUsd: number;
  image: string;
  category: string;
  desc: string;
  sizes: string[];
}

const MERCH_PRODUCTS: Product[] = [
  {
    id: "m-01",
    name: "BEYOND DISTANCE PRO SINGLET",
    priceMnt: 85000,
    priceUsd: 25,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    category: "SPEED GEAR",
    desc: "Ultra-lightweight hyper-aerated race singlet engineered to dissipate heat during intense speed segments. Heat-sealed seams to eliminate friction.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "m-02",
    name: "7K CLUB WINDBREAKER V2",
    priceMnt: 180000,
    priceUsd: 53,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
    category: "ELEMENT SHELL",
    desc: "Wind & water repelling athletic jacket built specifically for early morning high-altitude training runs across the cold Mongolian steppes.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m-03",
    name: "RFID GRID RACE CAP",
    priceMnt: 45000,
    priceUsd: 13,
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=600&auto=format&fit=crop&q=80",
    category: "ACCESSORIES",
    desc: "Curved laser-perforated running cap featuring a sleek rear compartment sleeve for timing chips and reflective trim for evening visibility.",
    sizes: ["FREE SIZE"],
  },
  {
    id: "m-04",
    name: "7K COMPRESSION SPEED SOCKS",
    priceMnt: 30000,
    priceUsd: 9,
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&auto=format&fit=crop&q=80",
    category: "SUPPORT CORE",
    desc: "Graduated elastic compressive support designed to stabilize calf muscles during sudden start-acceleration bursts on the starting grid.",
    sizes: ["S/M", "L/XL"],
  },
];

interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export function WorkView({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  
  // Checkout Form
  const [shippingMethod, setShippingMethod] = useState("Square Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (product: Product, size: string) => {
    try { playSuccessSound(); } catch {}
    
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const cloned = [...prev];
        cloned[existingIdx].quantity += 1;
        return cloned;
      } else {
        return [...prev, { product, selectedSize: size, quantity: 1 }];
      }
    });

    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    try { playHoverSound(); } catch {}
    setCart((prev) => prev.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    ));
  };

  const calculateTotal = () => {
    const totalMnt = cart.reduce((acc, item) => acc + item.product.priceMnt * item.quantity, 0);
    const totalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);
    return { mnt: totalMnt, usd: totalUsd };
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNo || (shippingMethod === "Door Delivery" && !deliveryAddress)) {
      alert("Please provide courier phone contacts and home addresses.");
      return;
    }

    try { playSuccessSound(); } catch {}
    setOrderNo(`7K-ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  const totals = calculateTotal();

  return (
    <div className="bg-[#080808] min-h-screen text-white safe-page-wrapper pb-16 font-sans">
      
      {/* Title Header Section */}
      <div className="container mx-auto px-6 max-w-7xl pt-12 md:pt-16 select-none">
        <div className="border-b border-zinc-900 pb-12 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-[#FF0099] font-bold block mb-2 uppercase">EQUIPMENT LAB</span>
            <AnimatedCopy
              variant="diffuse"
              onScroll={false}
              delay={0.1}
              tag="h1"
              className="text-4xl md:text-7xl font-sans font-black uppercase text-white leading-none tracking-tighter"
            >
              7K CLUB ATHLETE SHOP
            </AnimatedCopy>
          </div>

          {/* Cart Icon trigger */}
          <ParticleButton
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-3 border border-zinc-800 bg-zinc-950 text-white font-mono text-xs uppercase tracking-widest hover:border-[#FF0099] transition-all flex items-center gap-3 cursor-pointer rounded-none"
            glowColor="#FF0099"
          >
            <ion-icon name="cart-sharp" style={{ fontSize: "1.2rem", verticalAlign: "middle" }}></ion-icon>
            <span>CART ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
          </ParticleButton>
        </div>

        {/* Success Checkout modal overlay if finalized */}
        {isCheckoutSuccess && (
          <div className="my-8 p-8 bg-[#FF0099] text-black border border-black relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] font-bold text-black/60 bg-black/10">
              SECURE VOUCHER
            </div>
            <div className="border-b border-black/20 pb-4 mb-4">
              <h3 className="text-2xl font-black uppercase">ORDER RECEIVED</h3>
              <p className="text-xs font-mono text-black/80 mt-1 uppercase">ORDER NUMBER: {orderNo}</p>
            </div>
            <p className="text-sm font-semibold max-w-xl">
              Thank you for supporting the 7K Club and Beyond Distance 2026. Your item reservation is locked. Our dispatch courier will phone you at <strong>{phoneNo}</strong> to arrange fulfillment in Ulaanbaatar.
            </p>
            <ParticleButton
              onClick={() => {
                setIsCheckoutSuccess(false);
                setPhoneNo("");
                setDeliveryAddress("");
              }}
              className="mt-6 px-6 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all rounded-none border-none cursor-pointer"
              glowColor="#FF0099"
            >
              STORE
            </ParticleButton>
          </div>
        )}

        {/* Pro Merch Product listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {MERCH_PRODUCTS.map((prod) => {
            return (
              <ProductCard
                key={prod.id}
                product={prod}
                onAdd={handleAddToCart}
              />
            );
          })}
        </div>

        {/* Info Column banner */}
        <div className="mt-20 border border-zinc-900 p-8 bg-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-white font-sans font-black text-lg uppercase tracking-tight">NATIONAL PARK MERCHANDISE DESK</h4>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
              All listed Beyond Distance athletic items will also be available for immediate pickup on race day (August 29, 2026) at our main park pavilion. Bring your order confirmation voucher to claim!
            </p>
          </div>
          <div className="font-mono text-xs text-zinc-400 border border-zinc-800 p-3 bg-[#080808]">
            SUPPORT: <span className="text-[#FF0099]">SHOP@7KCLUB.MN</span>
          </div>
        </div>
      </div>

      {/* Slide-out Shopping Cart panel */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[20000] flex justify-end">
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-900 h-full p-8 flex flex-col justify-between overflow-y-auto">
            
            {/* Cart Header */}
            <div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <h3 className="font-mono text-xs font-bold tracking-[0.25em] text-[#FF0099] uppercase">YOUR BAG</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="type-mono text-[10px] uppercase text-zinc-500 hover:text-white"
                >
                  [ CLOSE ]
                </button>
              </div>

              {/* Cart List */}
              <div className="space-y-6 mt-6 max-h-[45vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-zinc-600 font-mono text-xs text-center py-12 uppercase">YOUR CART IS COMPLETELY VACANT</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b border-zinc-900 pb-4 font-mono text-xs text-zinc-400">
                      <img src={item.product.image} className="w-16 h-16 object-cover bg-zinc-900" alt="" />
                      <div className="flex-grow">
                        <div className="font-bold text-white uppercase">{item.product.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 uppercase">SIZE: {item.selectedSize}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 uppercase">QTY: {item.quantity}</div>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id, item.selectedSize)}
                          className="text-[#FF0099] hover:underline text-[9px] mt-2 block uppercase font-bold"
                        >
                          Delete Slot
                        </button>
                      </div>
                      <div className="text-right whitespace-nowrap text-white font-bold">
                        ₮{(item.product.priceMnt * item.quantity).toLocaleString()} <span className="text-[10px] text-zinc-500 block">${item.product.priceUsd * item.quantity} USD</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart checkout details */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-900 pt-6 space-y-6">
                
                {/* Total row */}
                <div className="flex justify-between items-end font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">EST. TOTAL</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">₮{totals.mnt.toLocaleString()}</span>
                    <span className="text-xs text-[#FF0099] block font-bold">${totals.usd} USD</span>
                  </div>
                </div>

                {/* Delivery Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-3 font-mono">
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Pick / Ship Plan</label>
                    <select
                      className="w-full bg-[#080808] border border-zinc-800 text-white p-2 text-xs rounded-none outline-none uppercase"
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      <option value="Square Pickup">Sukhbaatar Square Pickup (Free)</option>
                      <option value="National Park Pickup">Race Day National Park Desk (Free)</option>
                      <option value="Door Delivery">Ulaanbaatar Courier Delivery (+ ₮10,000)</option>
                    </select>
                  </div>

                  {shippingMethod === "Door Delivery" && (
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Fulfillment Address</label>
                      <textarea
                        rows={2}
                        className="w-full bg-[#080808] border border-zinc-800 text-white p-2 text-xs rounded-none outline-none font-mono"
                        placeholder="e.g. Khoroo 11, Khan-Uul District, Ulaanbaatar, MN"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Courier Contact Phone Number</label>
                    <input
                      type="text"
                      className="w-full bg-[#080808] border border-zinc-800 text-white p-2 text-xs rounded-none outline-none font-mono"
                      placeholder="e.g. 9911-XXXX"
                      required
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </div>

                  <ParticleButton
                    type="submit"
                    className="w-full py-3 bg-[#FF0099] text-black font-semibold uppercase tracking-widest text-xs font-mono hover:bg-white transition-all mt-4 border-none cursor-pointer rounded-none"
                    glowColor="#FF0099"
                  >
                    CHECKOUT
                  </ParticleButton>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inner Component for Product elements
interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAdd: (product: Product, size: string) => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <div className="bg-zinc-950 border border-zinc-900 group hover:border-[#FF0099]/55 transition-all flex flex-col justify-between">
      <div>
        {/* Banner/Image */}
        <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF0099] text-black font-mono text-[9px] font-bold uppercase">
            {product.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-5 space-y-2">
          <h4 className="text-white font-sans font-black text-md uppercase tracking-tight leading-tight">
            {product.name}
          </h4>
          <p className="text-zinc-500 text-xs font-sans leading-relaxed">
            {product.desc}
          </p>
        </div>
      </div>

      <div className="p-5 border-t border-zinc-900 space-y-4">
        {/* Sizes row */}
        {product.sizes.length > 1 && (
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">SELECT SIZE</span>
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 py-1 text-[10px] font-mono border transition-all ${
                    selectedSize === s
                      ? "border-white text-white bg-zinc-900 font-bold"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add item call */}
        <div className="flex justify-between items-center gap-2 pt-2">
          <div className="font-mono text-sm font-bold text-white">
            ₮{product.priceMnt.toLocaleString()}
            <span className="text-[10px] text-zinc-500 block font-normal">${product.priceUsd} USD</span>
          </div>

          <ParticleButton
            onClick={() => onAdd(product, selectedSize)}
            className="px-4 py-2 bg-[#FF0099] hover:bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest transition-all rounded-none border-none cursor-pointer"
            glowColor="#FF0099"
          >
            ADD
          </ParticleButton>
        </div>
      </div>
    </div>
  );
}

export default WorkView;
