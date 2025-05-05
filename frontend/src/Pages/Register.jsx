import styled from "styled-components";
import { mobile } from "../responsive";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
	width: 40%;
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
	flex-wrap: wrap;
`;
const Input = styled.input`
	flex: 1;
	min-width: 40%;
	margin: 20px 10px 0px 0px;
	padding: 10px;
`;
const Agreement = styled.span`
	font-size: 12px;
	margin: 25px 0px 15px 0px;
`;
const Login = styled.span`
	font-size: 13px;
	margin: 25px 0px 15px 0px;
`;
const Button = styled.button`
	width: 40%;
	border: none;
	padding: 15px 20px;
	background-color: teal;
	color: white;
	cursor: pointer;
`;

const Register = () => {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const handleClick = async (e) => {
		e.preventDefault();
		if (firstName.length === "") {
			toast.error("Please Enter First Name");
		} else if (lastName.length === "") {
			toast.error("Please Enter Last Name");
		} else if (email.length === "") {
			toast.error("Please Enter Email");
		} else if (password.length === "") {
			toast.error("Please Enter Password");
		} else if (confirmPassword.length === "") {
			toast.error("Please Confirm Password");
		} else if (password !== confirmPassword) {
			toast.error("Password do not match");
		} else if (mobileNo.length === "") {
			toast.error("Please Enter Mobile Number");
		} else {
			const res = await axios.post(
				"http://localhost:8085/api/v1/customer/register",
				{
					firstName,
					lastName,
					email,
					password,
					mobileNo
				}
			);
			if (res.data.status === "success") {
				toast.success("Successfully registered a new user");
				navigate("/login");
			}
			//else {
			// 	toast.error("Error while registering a new user, please try again");
			// }
		}
	};
	return (
		<Container>
			<Wrapper>
				<Title>CREATE AN ACCOUNT</Title>
				<Form>
					<Input
						type="text"
						placeholder="First Name"
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<Input
						type="text"
						placeholder="Last Name"
						onChange={(e) => setLastName(e.target.value)}
					/>
					<Input
						type="email"
						placeholder="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="confirm password"
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<Input
						type="tel"
						placeholder="Mobile Number"
						onChange={(e) => setMobileNo(e.target.value)}
					/>
					<Agreement>
						By creating an account, I consent to the processing of my personal
						data in accordance with the <b>PRIVACY POLICY</b>
						<br />
						<Link to="/login" style={{ color: "black" }}>
							<Login>ALREADY HAVE AN ACCOUNT ?</Login>
						</Link>
					</Agreement>
					<Button onClick={handleClick}>CREATE</Button>
				</Form>
			</Wrapper>
		</Container>
	);
};

export default Register;
