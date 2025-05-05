import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";
import { mobile } from "../responsive";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
const Container = styled.div``;
const Wrapper = styled.div`
	margin-bottom: 100px;
	margin-top: 50px;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	${mobile({ padding: "10px", flexDirection: "column" })}
`;
const Wrapper1 = styled.div`
	text-align: center;
	margin-top: 20px;
`;
const Wrapper2 = styled.div``;
const MyProfile = () => {
	const { loginState, currentUser } = useSelector((state) => state.user);
	const [profile, setProfile] = useState([]);
	useEffect(() => {
		getUser();
	}, []);
	const getUser = async () => {
		if (loginState === false) {
		} else {
			const res = await axios.get(
				`http://localhost:8085/api/v1/customer/${currentUser.customer_id}`
			);
			if (res.data.status === "success") {
				setProfile(res.data.data);
			}
		}
	};
	return (
		<Container>
			<Navbar />
			<Wrapper>
				<Wrapper1>
					<div className="profile">
						<img
							className="img-profile"
							src={
								profile.profile == null
									? `http://localhost:8085/user.jpg`
									: `http://localhost:8085/${profile.profile}`
							}
							alt="profile"
						/>
					</div>
					<Link to="/edit-profile">
						<button className="btn-profile">Edit Profile</button>
					</Link>
				</Wrapper1>
				<Wrapper2>
					<div className="label1">
						<b className="label-label">Name:</b>
						<h3>{profile.name}</h3>
					</div>
					<div className="label1">
						<b className="label-label">Email:</b>
						<h3>{profile.email}</h3>
					</div>
					<div className="label1">
						<b className="label-label">Mobile Number:</b>
						<h3>{profile.mobile}</h3>
					</div>
				</Wrapper2>
			</Wrapper>
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default MyProfile;
