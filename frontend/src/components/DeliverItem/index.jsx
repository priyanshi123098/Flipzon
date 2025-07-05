import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const DeliverItem = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [otp, setOtp] = useState("");
    // const [selectedOrder, setSelectedOrder] = useState(null);
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found");
                return;
            }
            const url = `${process.env.REACT_APP_API_URL}/api/cart/seller-orders`;
            const { data } = await axios.get(url, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setMessage("Error fetching orders");
        }
    };
 const handleVerifyOtp = async (orderID) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/cart/verify-otp`;
            const { data: res } = await axios.post(url, { orderID, otp }, {
                headers: { 
                    'Content-Type': 'application/json'
                },
            });
            setMessage(res.message);
            console.log("Verify OTP:", res.message);
            fetchOrders(); // Refresh the orders list
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage("Error verifying OTP");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const pendingOrders = orders.filter(order => order.status === "Pending");

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
            <div className={styles.orders_container}>
                <h2>Deliver Items</h2>
                {message && <p>{message}</p>}
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <div className={styles.orders_list}>
                        {pendingOrders.map((order) => (
                            <div key={order._id} className={styles.order_item}>
                                <h3>Order ID: {order._id}</h3>
                                {/* <p>OTP: {order.otp}</p> */}
                                <p>Status: {order.status}</p>
                                <div className={styles.items_list}>
                                    {order.items.map((item) => (
                                        <div key={item.itemID._id} className={styles.item}>
                                            <h4>{item.name}</h4>
                                            <p>Price: ${item.price}</p>
                                            <p>Description: {item.description}</p>
                                            <p>Category: {item.category}</p>
                                        </div>
                                    ))}
                                </div>
                                {order.status === "Pending" && (
                                    <div className={styles.otp_container}>
                                        <input
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className={styles.input}
                                        />
                                        <button onClick={() => handleVerifyOtp(order._id)} className={styles.green_btn}>
                                            Verify OTP
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                )}
            </div>
        </div>
    );
};

export default DeliverItem;
