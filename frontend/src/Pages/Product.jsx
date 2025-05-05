import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import Banner from "../Components/Banner";
import {
	Add,
	DiamondOutlined,
	LocalShippingOutlined,
	Remove,
	SyncAltOutlined
} from "@mui/icons-material";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { addProduct, getTotals } from "../redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div``;
const Wrapper = styled.div`
	padding: 50px;
	display: flex;
	${mobile({ padding: "10px", flexDirection: "column" })}
`;
const ImgContainer = styled.div`
	flex: 1;
`;
const Image = styled.img`
	width: 100%;
	height: 80vh;
	object-fit: cover;
	${mobile({ height: "40vh" })}
`;
const InfoContainer = styled.div`
	flex: 1;
	padding: 0px 50px;
	margin-left: 60px;
	${mobile({ padding: "10px" })}
`;
const Title = styled.h1`
	font-weight: 200;
`;
const Desc = styled.p`
	margin: 20px 0px;
`;
const Price = styled.span`
	font-weight: 500;
	font-size: 40px;
`;
const AddContainer = styled.div`
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	${mobile({ width: "100%" })}
`;
const AmountContainer = styled.div`
	display: flex;
	align-items: center;
	font-weight: 700;
`;
const Amount = styled.span`
	width: 30px;
	height: 30px;
	border-radius: 10px;
	border: 1px solid teal;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0px 5px;
	font-weight: bolder;
`;
const Button = styled.button`
	padding: 15px;
	border: 2px solid teal;
	background-color: white;
	cursor: pointer;
	font-weight: 500;
	&:hover {
		background-color: #f8f4f4;
	}
`;
const Info = styled.div`
	margin-top: 50px;
`;
const InfoPara = styled.p`
	font-weight: 600;
`;

const Product = () => {
	const { currentUser, loginState } = useSelector((state) => state.user);
	const cartTotalQuantity = useSelector((state) => state.user.cartQuantity);
	const location = useLocation();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const id = location.pathname.split("/")[2];
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);
	useEffect(() => {
		getProd();
		dispatch(getTotals());
	}, [cart, dispatch]);
	const getProd = async () => {
		const res = await axios.get(`http://localhost:8085/api/v1/jewellery/${id}`);
		if (res.data.status === "success") {
			setProduct(res.data.data[0]);
		} else {
			toast.error("Something went wrong!!!");
		}
	};
	const handleQuantity = (type) => {
		if (type === "dec") {
			if (quantity > 1) {
				setQuantity(quantity - 1);
			}
		} else {
			if (quantity < product.stock_qty) {
				setQuantity(quantity + 1);
			} else {
				toast.error("Only 5 items are there in the stock");
			}
		}
	};
	const handleClick = async () => {
		const b = cart.products.filter((data) => data.jewellery_id !== id);
		if (loginState === false) {
			if (b[0] && b[0].cartQuantity + 1 > product.stock_qty) {
				toast.error(`Only ${product.stock_qty} items are there in the cart`);
			} else {
				dispatch(
					addProduct({
						...product,
						cartTotalQuantity: quantity,
						price: product.jewellery_price * quantity
					})
				);
			}
		} else {
			if (b[0] && b[0].cartQuantity + 1 > product.stock_qty) {
				toast.error(`Only ${product.stock_qty} items are there in the cart`);
			} else {
				dispatch(
					addProduct({
						...product,
						quantity,
						price: product.jewellery_price * quantity
					})
				);
			}
			const data = {
				customer_id: currentUser.customer_id,
				jewellery_id: product.jewellery_id,
				qty: quantity,
				price: product.jewellery_price * quantity
			};
			await axios.post("http://localhost:8085/api/v1/cart/add", data);
		}
	};
	return (
		<Container>
			<Navbar />
			<Wrapper>
				<ImgContainer>
					<Image src={`http://localhost:8085/${product.jewellery_image}`} />
				</ImgContainer>
				<InfoContainer>
					<Title>{product.jewellery_name}</Title>
					<Desc>{product.jewellery_description}</Desc>
					<Price>₹ {product.jewellery_price}</Price>
					<AddContainer>
						{/* <AmountContainer>
							<Remove
								style={{ cursor: "pointer" }}
								onClick={() => handleQuantity("dec")}
							/>
							<Amount>{quantity}</Amount>
							<Add
								style={{ cursor: "pointer" }}
								onClick={() => handleQuantity("inc")}
							/>
						</AmountContainer> */}
						<Button style={{ marginTop: "15px" }} onClick={handleClick}>
							ADD TO CART
						</Button>
					</AddContainer>
					<Info>
						<hr style={{ width: "60%", border: "1px solid brown" }} />
						<InfoPara>
							<DiamondOutlined /> Purity Guaranteed.
						</InfoPara>
						<InfoPara>
							<SyncAltOutlined /> Exchange across all stores.
						</InfoPara>
						<InfoPara>
							<LocalShippingOutlined /> Free Shipping all across India
						</InfoPara>
						<hr style={{ width: "60%", border: "1px solid brown" }} />
					</Info>
				</InfoContainer>
			</Wrapper>
			<Banner />
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default Product;
