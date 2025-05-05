import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import styled from "styled-components";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import axios from "axios";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
	font-weight: 300;
	text-align: center;
`;

const Bottom = styled.div`
	display: flex;
	justify-content: space-between;
	${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
	flex: 3;
`;

const Product = styled.div`
	display: flex;
	justify-content: space-between;
	${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
	flex: 2;
	display: flex;
`;

const Image = styled.img`
	width: 200px;
`;

const Details = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const ProductName = styled.span``;
const ProductQty = styled.span``;

const PriceDetail = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ProductAmountContainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	margin-top: 10px;
`;

const ProductAmount = styled.div`
	font-size: 15px;
	margin: 5px;
	${mobile({ margin: "5px 15px" })}
`;
const OrderDate = styled.div`
	font-size: 15px;
	margin: 5px;
	${mobile({ margin: "5px 15px" })}
`;
const ProductPrice = styled.div`
	font-size: 30px;
	font-weight: 200;
	${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
	background-color: #eee;
	border: none;
	height: 1px;
`;
const TopButton = styled.button`
	padding: 10px;
	font-weight: 600;
	cursor: pointer;
	border: ${(props) => props.type === "filled" && "none"};
	background-color: ${(props) =>
		props.type === "filled" ? "black" : "transparent"};
	color: ${(props) => props.type === "filled" && "white"};
`;
const Orders = () => {
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	const { currentUser } = useSelector((state) => state.user);
	useEffect(() => {
		getAllOrders();
	}, []);
	const getAllOrders = async () => {
		const res = await axios.get(
			`http://localhost:8085/api/v1/order/${currentUser.customer_id}`
		);
		if (res.data.status === "success") {
			setData(res.data.data);
		}
	};
	const goToHomePage = () => {
		navigate("/");
	};
	return (
		<Container>
			<Navbar />
			<Wrapper>
				<TopButton type="filled" onClick={goToHomePage}>
					CONTINUE SHOPPING
				</TopButton>
				<Title>YOUR ORDERS</Title>
				<Bottom>
					<Info>
						{data.map((data) => (
							<Product>
								<ProductDetail>
									<Image
										src={`http://localhost:8085/${data.jewellery_image}`}
									/>
									<Details>
										<ProductName>
											<b>Product:</b> {data.jewellery_name}
										</ProductName>
										<ProductQty>
											<b>Quantity: </b>
											{data.qty}
										</ProductQty>
									</Details>
								</ProductDetail>
								<PriceDetail>
									<ProductPrice>
										<b>Total :</b> ₹ {data.order_total}
									</ProductPrice>
									<ProductAmountContainer>
										<ProductAmount>
											<b>ORDER DATE :</b> {data.order_date.slice(0, 10)}
										</ProductAmount>
									</ProductAmountContainer>
									<OrderDate>
										<b>ESTIMATED SHIPPING DATE :</b>{" "}
										{data.shipping_date.slice(0, 10)}
									</OrderDate>
								</PriceDetail>
							</Product>
						))}
						<Hr />
					</Info>
				</Bottom>
			</Wrapper>
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default Orders;
