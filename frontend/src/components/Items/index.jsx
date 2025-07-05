import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Items = () => {
    const [item, setItem] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
    });
    const [items, setItems] = useState([]); // Initialize as an empty array
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded =  jwtDecode(token);
            setUser(decoded);
        }
        fetchItems();
    }, []);

    // const fetchItems = async () => {
    //     try {
    //         const url = `${process.env.REACT_APP_API_URL}/api/items`;
    //         const { data } = await axios.get(url);
    //         if (Array.isArray(data)) {
    //             setItems(data); // Ensure data is an array
    //         } else {
    //             console.error("Fetched data is not an array:", data);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching items:", error);
    //     }
    // };
    const fetchItems = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/items`;
            const { data } = await axios.get(url);
            setItems(data);
            extractCategories(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    const extractCategories = (items) => {
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((cat) => cat !== category)
                : [...prevCategories, category]
        );
    };

    const filteredItems = items.filter((item) => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        return matchesSearchTerm && matchesCategory;
    });
    const handleItemClick = (id) => {
        navigate(`/items/${id}`);
    };

    const handleChange = ({ currentTarget: input }) => {
        setItem({ ...item, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            const itemData = {
                ...item,
                sellerID: user._id,
            };

            const url = `${process.env.REACT_APP_API_URL}/api/items/add`;
            const { data: res } = await axios.post(url, itemData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setMessage(res.message);
            setItem({ name: "", price: "", description: "", category: "" });
            fetchItems(); // Refresh the items list
        } catch (error) {
            console.error("Error adding item:", error);
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setMessage(error.response.data.message);
            }
        }
    };

    // const handleAddToCart = async (item) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const url = `${process.env.REACT_APP_API_URL}/api/cart/add-to-cart`;
    //         const { data: res } = await axios.post(url, { itemID: item._id }, {
    //             headers: { 
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //         });
    //         setMessage(res.message);
    //         console.log("Add to cart:", res.message);
    //     } catch (error) {
    //         console.error("Error adding to cart:", error);
    //     }
    // };

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
            <div className={styles.form_container}>
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                        value={item.name}
                        required
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                        value={item.price}
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                        value={item.description}
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        onChange={handleChange}
                        value={item.category}
                        required
                        className={styles.input}
                    />
                    {message && <div className={styles.message}>{message}</div>}
                    <button type="submit" className={styles.green_btn}>
                        Add Item
                    </button>
                </form>
            </div>
            <div className={styles.search_bar}>
                <input
                    type="text"
                    placeholder="Search for items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.search_input}
                />
            </div>
            <div className={styles.filters}>
                <h2>Filter by Categories</h2>
                {categories.map((category) => (
                    <label key={category} className={styles.filter_label}>
                        <input
                            type="checkbox"
                            value={category}
                            onChange={handleCategoryChange}
                            className={styles.filter_checkbox}
                        />
                        {category}
                    </label>
                ))}
            </div>
           
            <div className={styles.items_container}>
                <h2>Available Items</h2>
                <div className={styles.items_list}>
                {filteredItems.map((item) => (
                        <div key={item._id} className={styles.item_card} onClick={() => handleItemClick(item._id)}>
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        <p>Category: {item.category}</p>
                        {/* <p>Vendor: {item.vendor}</p> */}
                        {/* <button onClick={() => handleAddToCart(item)} className={styles.green_btn}>
                            Add to Cart
                        </button> */}
                    </div>
                ))}
            </div>
            </div>
            {/* {message && <div className={styles.message}>{message}</div>} */}

        </div>
    );
};

export default Items;