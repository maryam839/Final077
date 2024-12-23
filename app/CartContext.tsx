import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: number;
  name: string;
  condition: number;
  price: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number; 
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => string;
  getTotalPrice: () => number;
  promoDiscount: number; 
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  applyPromoCode: () => '',
  getTotalPrice: () => 0,
  promoDiscount: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoDiscount, setPromoDiscount] = useState(0); 

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        const savedCode = await AsyncStorage.getItem('promoCode');
        if (storedCart) setCartItems(JSON.parse(storedCart));
        if (savedCode) applyPromoCode(savedCode);
      } catch (error) {
        console.error('Error loading cart or promo code:', error);
      }
    };
    loadCartData();
  }, []);

  // Add to Cart
  const addToCart = async (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Remove from Cart
  const removeFromCart = async (product: Product) => {
    const updatedCart = cartItems.filter(item => item.id !== product.id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Update Quantity
  const updateQuantity = async (product: Product, quantity: number) => {
    if (quantity <= 0) return; // Prevent invalid quantities
    const updatedCart = cartItems.map(item =>
      item.id === product.id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Clear Cart
  const clearCart = async () => {
    setCartItems([]);
    saveCart([]);
  };

  // Apply Promo Code
  const applyPromoCode = (code: string): string => {
    const promoCodes: Record<string, number> = {
      SAVE10: 10, // 10% discount
      SAVE20: 20, // 20% discount
    };

    if (promoCodes[code] !== undefined) {
      setPromoDiscount(promoCodes[code]);
      AsyncStorage.setItem('promoCode', code);
      return 'Promo code applied successfully!';
    }
    return 'Invalid promo code.';
  };

  // Calculate Total Price
  const getTotalPrice = (): number => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total - (total * promoDiscount) / 100; // Apply discount
  };

  // Save cart to AsyncStorage
  const saveCart = async (cart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        getTotalPrice,
        promoDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
