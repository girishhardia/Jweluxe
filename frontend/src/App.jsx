import Product from "./Pages//Product";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProductList from "./Pages/ProductList";
import Cart from "./Pages/Cart";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Success from "./Pages/Success";
import Orders from "./Pages/Orders";
import ShowCategory from "./Components/ShowCategory";
import MyProfile from "./Pages/MyProfile";
import EditProfile from "./Pages/EditProfile";
import { useSelector } from "react-redux";
function App() {
	const currentUser = useSelector((state) => state.user.currentUser);
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/orders"
					element={currentUser === null ? <Navigate to="/" /> : <Orders />}
				/>
				<Route
					path="/category-products/:category_name"
					element={<ShowCategory />}
				/>
				<Route path="/products/:category" element={<ProductList />} />
				<Route path="/product/:id" element={<Product />} />
				<Route
					path="/login"
					element={currentUser === null ? <Login /> : <Navigate to="/" />}
				/>
				<Route
					path="/register"
					element={currentUser === null ? <Register /> : <Navigate to="/" />}
				/>
				{/* <Route path="/login" element={<Login />} /> */}
				{/* <Route path="/orders" element={<Orders />} /> */}
				{/* <Route path="/register" element={<Register />} /> */}
				{/* <Route path="/profile" element={<MyProfile />} /> */}
				{/* <Route path="/edit-profile" element={<EditProfile />} /> */}
				<Route
					path="/edit-profile"
					element={currentUser === null ? <Navigate to="/" /> : <EditProfile />}
				/>
				{/* <Route
					path="/register"
					element={currentUser === null ? <Navigate to="/" /> : <Register />}
				/> */}
				<Route
					path="/profile"
					element={currentUser === null ? <Navigate to="/" /> : <MyProfile />}
				/>
				<Route path="/cart" element={<Cart />} />
				<Route path="/success" element={<Success />} />
			</Routes>
			<ToastContainer theme="dark" />
		</div>
	);
}

export default App;
