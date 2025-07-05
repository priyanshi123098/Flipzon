import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Items from "./components/Items";
import ItemDetail from "./components/ItemDetail"; // Import the ItemDetail component
import Cart from "./components/Cart";
import OrderHistory from "./components/OrderHistory";
import DeliverItem from "./components/DeliverItem";
import Support from "./components/Support";
import EditProfile from "./components/EditProfile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    // const user = localStorage.getItem("token");

    return (
        <Routes>
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route 
				path="/"
                element={
                    <PrivateRoute>
                        <Main />
                    </PrivateRoute>
                }
            />
            <Route
                path="/items"
                element={
                    <PrivateRoute>
                        <Items />
                    </PrivateRoute>
                }
            />
            <Route
                path="/items/:id"
                element={
                    <PrivateRoute>
                        <ItemDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/cart"
                element={
                    <PrivateRoute>
                        <Cart />
                    </PrivateRoute>
                }
            />
            <Route
                path="/order-history"
                element={
                    <PrivateRoute>
                        <OrderHistory />
                    </PrivateRoute>
                }
            />
            <Route
                path="/deliver-item"
                element={
                    <PrivateRoute>
                        <DeliverItem />
                    </PrivateRoute>
                }
            />
            <Route
                path="/support"
                element={
                    <PrivateRoute>
                        <Support />
                    </PrivateRoute>
                }
            />
			<Route
                path="/edit-profile"
                element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
    );
}

export default App;