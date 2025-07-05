import React, { useEffect, useState } from 'react';
import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const Main = () => {
	const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
            fetchReviews(decoded._id); // Call fetchReviews after setting the user
        } else {
            navigate.push('/login'); // Redirect to login page if no token is found
        }
    }, [navigate]);
    const fetchReviews = async (userID) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/users/reviews/${userID}`;
            const { data } = await axios.get(url);
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setMessage("Error fetching reviews");
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
			<div className={styles.content}>
                {user ? (
                    <div>
                        <h2>Welcome, {user.firstName} {user.lastName} <br></br>
							Your details are as follows:
						</h2>
						<p>First Name: {user.firstName}</p>
						<p>Last Name: {user.lastName}</p>
                        <p>Email: {user.email}</p>
                        <p>Age: {user.age}</p>
                        <p>Contact Number: {user.contactNumber}</p>
						<p>Seller Reviews: </p>
                        {message && <p>{message}</p>}
                        {reviews.length === 0 ? (
                            <p>No reviews found</p>
                        ) : (
                            <ul>
                                {reviews.map((review, index) => (
                                    <li key={index}>{review}</li>
                                ))}
                            </ul>
                        )}
                        <button className={styles.white_btn} onClick={() => navigate('/edit-profile')}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <p>Loading user information...</p>
                )}
            </div>
        </div>
	);
};

export default Main;
