import styled from "styled-components";
import { mobile } from "../responsive";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../redux/userRedux";

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.5)
		),
		url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
			center;
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const Wrapper = styled.div`
	border: 2px solid teal;
	width: 25%;
	padding: 20px;
	background-color: white;
	${mobile({ width: "75%" })}
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 300;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
`;

const Input = styled.input`
	flex: 1;
	min-width: 40%;
	margin: 10px 0;
	padding: 10px;
`;

const Button = styled.button`
	width: 40%;
	border: none;
	padding: 15px 20px;
	background-color: teal;
	color: white;
	cursor: pointer;
	margin-bottom: 10px;
	/* &:disabled {
		color: green;
		cursor: not-allowed;
	} */
`;

const Link1 = styled.a`
	margin: 5px 0px;
	font-size: 12px;
	text-decoration: underline;
	cursor: pointer;
	color: black;
`;

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state) => state.cart);
	const { currentUser } = useSelector((state) => state.user);
	useEffect(() => {
		addDataToDBFromCart();
	});
	const handleClick = async (e) => {
		dispatch(loginStart());
		e.preventDefault();
		if (email.length === "") {
			toast.error("Please Enter Email");
		} else if (password.length === "") {
			toast.error("Please Enter Password}");
		} else {
			const res = await axios.post(
				"http://localhost:8085/api/v1/customer/login",
				{ email, password }
			);
			if (res.data.status === "success") {
				const { token, name, email } = res.data.data;
				sessionStorage["token"] = token;
				sessionStorage["name"] = name;
				sessionStorage["email"] = email;
				dispatch(loginSuccess(res.data.data));
				toast.success(`Welcome ${name} to JSMS.`);
				navigate("/");
				addDataToDBFromCart();
			} else {
				toast.error("Invalid user name or password");
				dispatch(loginFailure());
			}
		}
	};
	const addDataToDBFromCart = () => {
		if (cart.products.length >= 0 && currentUser) {
			let arr = cart.products.map((data) => {
				let a = {
					customer_id: currentUser.customer_id,
					jewellery_id: data.jewellery_id,
					qty: data.cartQuantity,
					price: data.price
				};
				axios.post("http://localhost:8085/api/v1/cart/add", a);
			});
			Promise.allSettled(arr).then((data) => {});
		}
	};
	return (
		<Container>
			<Wrapper>
				<Title>SIGN IN</Title>
				<Form>
					<Input
						placeholder="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button onClick={handleClick}>LOGIN</Button>
					{/* <Link1>FORGOT PASSWORD?</Link1> */}
					<Link to="/register">
						<Link1>CREATE A NEW ACCOUNT!</Link1>
					</Link>
				</Form>
			</Wrapper>
		</Container>
	);
};

export default Login;
