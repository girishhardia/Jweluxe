import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Container = styled.div``;
const Wrapper = styled.div`
	margin-left: 30%;
	margin-top: 30px;
	width: 40%;
	padding: 20px;
	${mobile({ width: "75%" })}
`;
const Title = styled.h1`
	margin-top: 30px;
	text-align: center;
	font-size: 24px;
	font-weight: 300;
`;
const Form = styled.form`
	display: flex;
	flex-wrap: wrap;
`;
const Input = styled.input`
	flex: 1;
	min-width: 50%;
	margin: 20px 10px 0px 0px;
	padding: 10px;
`;

const Button = styled.button`
	margin: 20px;
	width: 40%;
	border: none;
	padding: 15px 20px;
	color: white;
	cursor: pointer;
	background-color: teal;
`;

const EditProfile = () => {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const [profile, setProfile] = useState("");
	const handleClick = async (e) => {
		e.preventDefault();
		if (email.length === "") {
			toast.error("Please enter email");
		} else if (password.length === "") {
			toast.error("Please enter password");
		} else if (confirmPassword.length === "") {
			toast.error("Please enter confirm password");
		} else if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else if (mobileNo.length === "") {
			toast.error("Please enter Mobile Number");
		} else {
			try {
				let formData = new FormData();
				formData.append("email", email);
				formData.append("password", password);
				formData.append("mobileNo", mobileNo);
				formData.append("profile", profile);
				const res = await axios.put(
					`http://localhost:8085/api/v1/customer/edit-profile/${currentUser.customer_id}`,
					formData
				);
				console.log(formData);
				if (res.data.status === "success") {
					toast.success("User Data Updated Successfully!! 😃");
					navigate("/profile");
				} else {
					toast.error("Something went wrong!! Try after some time");
				}
			} catch (err) {
				throw err;
			}
		}
	};
	return (
		<Container>
			<Navbar />
			<Title>EDIT PROFILE</Title>
			<Wrapper>
				<Form encType="multipart/form-data">
					<Input
						type="email"
						name="email"
						placeholder="email"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						required
					/>
					<Input
						type="password"
						name="password"
						placeholder="password"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						required
					/>
					<Input
						type="password"
						name="confirmPassword"
						placeholder="confirm password"
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
						required
					/>
					<Input
						type="tel"
						name="mobileNo"
						placeholder="Mobile Number"
						onChange={(e) => {
							setMobileNo(e.target.value);
						}}
						required
					/>
					<Input
						type="file"
						name="profile"
						placeholder="Change Profile Image"
						onChange={(e) => {
							setProfile(e.target.files[0]);
						}}
						required
					/>
					<Button onClick={handleClick} type="submit">
						EDIT
					</Button>
				</Form>
			</Wrapper>
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default EditProfile;
