import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState("");
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        fetchCartItems();
    }, []);


    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found");
                return;
            }
            const url = `${process.env.REACT_APP_API_URL}/api/cart/usercart`;
            console.log("URL:", url);
            const { data } = await axios.get(url, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log("Fetched cart items:", data);
            setCartItems(data);
            calculateTotalCost(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setMessage("Error fetching cart items");
        }
    };

    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + item.price, 0);
        setTotalCost(total);
    };

    const handleRemoveFromCart = async (itemID) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_URL}/api/cart/remove-from-cart`;
            const { data: res } = await axios.post(url, { itemID }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setMessage(res.message);
            console.log("Remove from cart:", res.message);
            fetchCartItems(); // Refresh the cart items list
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };
    const handleFinalOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `${process.env.REACT_APP_API_URL}/api/cart/final-order`;
            const { data: res } = await axios.post(url, {}, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setMessage(res.message);
            console.log("Final order:", res.message);
            setCartItems([]); // Clear the cart items
            setTotalCost(0); // Reset the total cost
            alert(`Order placed successfully. Your OTP is: ${res.otp}`);
        } catch (error) {
            console.error("Error placing final order:", error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Flipzon</h1>
                <div className={styles.nav_links}>
                    <Link to="/" className={styles.nav_link}>Dashboard</Link>
                    <Link to="/items" className={styles.nav_link}>Items</Link>
                    <Link to="/cart" className={styles.nav_link}>My Cart</Link>
                    <Link to="/order-history" className={styles.nav_link}>Order History</Link>
                    <Link to="/deliver-item" className={styles.nav_link}>Deliver Item</Link>
                    <Link to="/support" className={styles.nav_link}>Support</Link>
                </div>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <div className={styles.cart_container}>
                <h2>My Cart</h2>
                {message && <p>{message}</p>}
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        <div className={styles.cart_list}>
                            {cartItems.map((cartItem) => (
                                <div key={cartItem._id} className={styles.cart_item}>
                                    <h3>{cartItem.name}</h3>
                                    <p>Price: ${cartItem.price}</p>
                                    <p>Description: {cartItem.description}</p>
                                    <p>Category: {cartItem.category}</p>
                                    <button onClick={() => handleRemoveFromCart(cartItem._id)} className={styles.red_btn}>
                                        Remove from Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.total_cost}>
                            <h3>Total Cost: ${totalCost}</h3>
                        </div>
                        <button onClick={handleFinalOrder} className={styles.green_btn}>
                            Final Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;