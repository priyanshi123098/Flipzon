import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { jwtDecode } from 'jwt-decode';

const EditProfile = () => {
    const [data, setData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        contactNumber: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setData({
                userId: decoded._id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                email: decoded.email,
                age: decoded.age,
                contactNumber: decoded.contactNumber
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/users/update-profile`;
            const { data: res } = await axios.put(url, data);
            localStorage.setItem('token', res.data); // Update token with new details
            navigate('/');
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className={styles.edit_profile_container}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>Edit Profile</h1>
                <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    onChange={handleChange}
                    value={data.firstName}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    onChange={handleChange}
                    value={data.lastName}
                    required
                    className={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    required
                    className={styles.input}
                />
                <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    onChange={handleChange}
                    value={data.age}
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    name="contactNumber"
                    onChange={handleChange}
                    value={data.contactNumber}
                    required
                    className={styles.input}
                />
                {error && <div className={styles.error_msg}>{error}</div>}
                <button type="submit" className={styles.green_btn}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;