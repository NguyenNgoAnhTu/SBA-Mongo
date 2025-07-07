import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

// Tạo Context
const CartContext = createContext();

// Tạo Provider
export const CartProvider = ({ children }) => {
    // State để lưu các sản phẩm trong giỏ hàng
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart data from localStorage", error);
            return [];
        }
    });

    // Lưu vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
                toast.success(`Updated ${product.name} quantity`);
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ
                toast.success(`${product.name} added to cart!`);
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        toast.error("Item removed from cart");
    };

    // Hàm cập nhật số lượng
    const updateQuantity = (productId, amount) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean); // Lọc bỏ các item có quantity <= 0
        });
    };
    
    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để sử dụng CartContext dễ dàng hơn
export const useCart = () => {
    return useContext(CartContext);
};