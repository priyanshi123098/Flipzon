import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from "./styles.module.css";
import { jwtDecode } from "jwt-decode";

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [message, setMessage] = useState("");
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/items/${id}`;
            const { data } = await axios.get(url);
            setItem(data);
            fetchSellerReviews(data.sellerID);
        } catch (error) {
            console.error("Error fetching item details:", error);
        }
    };
    const fetchSellerReviews = async (sellerID) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/users/reviews/${sellerID}`;
            const { data } = await axios.get(url);
            setReviews(data);
        } catch (error) {
            console.error("Error fetching seller reviews:", error);
        }
    };
    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found");
                return;
            }
            const decoded = jwtDecode(token);
            const userId = decoded._id; // Get the user ID from the decoded token

            // Check if the sellerID is the same as the user ID
            if (item.sellerID === userId) {
                setMessage("You cannot add your own item to the cart.");
                return; // Exit the function if the sellerID matches the user ID
            }
            const url = `${process.env.REACT_APP_API_URL}/api/cart/add-to-cart`;
            const { data: res } = await axios.post(url, { itemID: item._id }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setMessage(res.message);
            console.log("Add to cart:", res.message);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    const handleBack = () => {
        navigate("/items"); // Navigate back to the items page using navigate
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.item_detail_container}>
            <button onClick={handleBack} className={styles.green_btn}>Back to Items</button> {/* Back Button */}
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
            <p>Description: {item.description}</p>
            <button onClick={handleAddToCart} className={styles.green_btn}>
                Add to Cart
            </button>
            <p>Seller ID: {item.sellerID}</p>
            <div className={styles.reviews_container}>
                <p>Seller Reviews</p>
                {reviews.length === 0 ? (
                            <p>No reviews found</p>
                        ) : (
                            <ul>
                                {reviews.map((review, index) => (
                                    <li key={index}>{review}</li>
                                ))}
                            </ul>
                        )}
            </div>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
};

export default ItemDetail;