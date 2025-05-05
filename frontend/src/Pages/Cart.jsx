import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import { Add, DeleteOutlined, Remove } from "@mui/icons-material";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
	addProduct,
	decreaseCart,
	removeProduct,
	getTotals,
	emptyCart
} from "../redux/cartRedux";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
const Container = styled.div``;
const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
	font-weight: 300;
	text-align: center;
`;

const Top = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
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

const TopTexts = styled.div`
	${mobile({ display: "none" })}
`;
const TopText = styled.span`
	text-decoration: underline;
	cursor: pointer;
	margin: 0px 10px;
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

const ProductId = styled.span``;

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
`;

const ProductAmount = styled.div`
	font-size: 24px;
	margin: 15px;
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

const Summary = styled.div`
	flex: 1;
	border: 0.5px solid lightgray;
	border-radius: 10px;
	padding: 20px;
	height: 50vh;
`;

const SummaryTitle = styled.h1`
	font-weight: 200;
`;

const SummaryItem = styled.div`
	margin: 30px 0px;
	display: flex;
	justify-content: space-between;
	font-weight: ${(props) => props.type === "total" && "500"};
	font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
	width: 100%;
	padding: 10px;
	background-color: black;
	color: white;
	font-weight: 600;
`;
const Cart = () => {
	const dispatch = useDispatch();
	const [disable, setDisable] = useState(false);
	const [data, setData] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const cart = useSelector((state) => state.cart);
	const { currentUser, loginState } = useSelector((state) => state.user);
	useEffect(() => {
		getAll();
		TotalPrice();
		dispatch(getTotals());
	}, [totalPrice, cart, dispatch]);
	const getAll = async () => {
		if (loginState === false) {
		} else {
			const res = await axios.get(
				`http://localhost:8085/api/v1/cart/${currentUser.customer_id}`
			);
			if (res.data.status === "success") {
				setData(res.data.data);
			}
			console.log(data);
		}
	};
	const deleteFromCart = (product) => {
		dispatch(decreaseCart(product));
		deleteCartDataToDb(product);
	};
	const increaseFromCart = (product) => {
		if (product.cartQuantity >= product.stock_qty) {
			setDisable(true);
			toast.error(`Only ${product.stock_qty} items are there in the stock`);
		} else {
			dispatch(addProduct(product));
			addCartDataToDb(product);
		}
	};
	const addCartDataToDb = async (product) => {
		const a = {
			qty: product.cartQuantity + 1,
			price: product.price * (product.cartQuantity + 1)
		};
		await axios.put(
			`http://localhost:8085/api/v1/cart/increase-qty-price/${product.jewellery_id}`,
			a
		);
	};
	const deleteCartDataToDb = async (product) => {
		const a = {
			qty: product.cartQuantity - 1,
			price: product.price * (product.cartQuantity - 1)
		};
		if (a.qty === 0 && a.price === 0) {
			handleClick(product);
		}
		await axios.put(
			`http://localhost:8085/api/v1/cart/increase-qty-price/${product.jewellery_id}`,
			a
		);
	};
	const handleClick1 = (cartItem) => {
		setQuantity(quantity - 1);
		dispatch(removeProduct(cartItem));
		handleClick(cartItem);
	};
	const handleClick = async (cartItem) => {
		if (cartItem) {
			const removeFromCart = await axios.delete(
				`http://localhost:8085/api/v1/cart/delete/${cartItem.jewellery_id}`
			);
			// dispatch(removeProduct(cartItem));
			if (removeFromCart.data.status === "success") {
				toast.success("Product removed from cart");
				window.location.reload();
			} else {
				toast.error("Something went wrong!!");
			}
		}
	};
	const TotalPrice = async () => {
		if (loginState === false) {
		} else {
			const res = await axios.get(
				`http://localhost:8085/api/v1/cart/totalprice/${currentUser.customer_id}`
			);
			if (res.data.data.length === 0) {
			} else {
				setTotalPrice(res.data.data[0].sum);
			}
		}
	};
	//for payment integration
	const makePayment = async () => {
		const dataToBeSent = data.map((d) => ({
			jewellery_id: d.jewellery_id,
			order_total: d.price,
			qty: d.qty
		}));
		if (loginState === false) {
			toast.error("Please First Login or Register");
		} else {
			if (cart.products.length === 0) {
				toast.error("Your cart is empty!!!");
			} else {
				const orderResponse = await axios.post(
					`http://localhost:8085/api/v1/order/add-multiple/${currentUser.customer_id}`,
					dataToBeSent
				);
				if (orderResponse.data.status === "success") {
					const stripe = await loadStripe(
						"pk_test_51NhAO2SCZGn9oSG6B7Tor52aynMGLbptdv9v2kNYaM9JS6vtbkE3JNFcnEdRfesyr2bo8Gjpaw3sMwQkVbGMPBRC0048LjDJuA"
					);
					const body = {
						products: data
					};
					const headers = {
						"Content-Type": "application/json"
					};
					const res = await fetch(
						"http://localhost:8085/api/v1/checkout/payment",
						{
							method: "POST",
							headers: headers,
							body: JSON.stringify(body)
						}
					);
					const session = await res.json();
					const result = stripe.redirectToCheckout({
						sessionId: session.id
					});
					if (result.error) {
						throw result.error;
					}
				}
			}
		}
		if (data.length !== 0) {
			await axios.delete(
				`http://localhost:8085/api/v1/cart/empty-cart/${currentUser.customer_id}`
			);
			dispatch(emptyCart());
		} else {
		}
	};
	return (
		<Container>
			<Navbar />
			<Wrapper>
				<Title>YOUR BAG</Title>
				<Top>
					<Link to="/">
						<TopButton>CONTINUE SHOPPING</TopButton>
					</Link>
					{loginState ? (
						<TopTexts>
							<TopText>Shopping Bag({data.length})</TopText>
						</TopTexts>
					) : (
						<TopTexts>
							<TopText>Shopping Bag({cart.products.length})</TopText>
						</TopTexts>
					)}
					<TopButton type="filled" onClick={makePayment}>
						CHECKOUT NOW
					</TopButton>
				</Top>
				<Bottom>
					<Info>
						{cart.products.map((product) => (
							<Product>
								<ProductDetail>
									<Image
										src={`http://localhost:8085/${product.jewellery_image}`}
									/>
									<Details>
										<ProductName>
											<b>Product:</b> {product.jewellery_name}
										</ProductName>
										<ProductId>
											<b>ID:</b> {product.jewellery_id}
										</ProductId>
									</Details>
								</ProductDetail>
								<PriceDetail>
									<ProductAmountContainer>
										<Add
											disabled={disable}
											style={{ cursor: "pointer" }}
											onClick={() => increaseFromCart(product)}
										/>
										<ProductAmount>{product.cartQuantity}</ProductAmount>
										<Remove
											style={{ cursor: "pointer" }}
											onClick={() => deleteFromCart(product)}
										/>
										<DeleteOutlined
											style={{
												cursor: "pointer",
												color: "red",
												marginLeft: "15px"
											}}
											onClick={() => handleClick1(product)}
										/>
									</ProductAmountContainer>
									<ProductPrice>
										₹ {product.jewellery_price * product.cartQuantity}
									</ProductPrice>
								</PriceDetail>
							</Product>
						))}
						<Hr />
					</Info>
					{loginState ? (
						<Summary>
							<SummaryTitle>ORDER SUMMARY</SummaryTitle>
							<SummaryItem>
								<SummaryItemText>Subtotal</SummaryItemText>
								<SummaryItemPrice>₹ {totalPrice}</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem>
								<SummaryItemText>Estimated Shipping</SummaryItemText>
								<SummaryItemPrice>₹ 100.90</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem>
								<SummaryItemText>Shipping Discount</SummaryItemText>
								<SummaryItemPrice>₹ -100.90</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem type="total">
								<SummaryItemText>Total</SummaryItemText>
								<SummaryItemPrice>₹ {totalPrice}</SummaryItemPrice>
							</SummaryItem>
							<Button onClick={makePayment}>CHECKOUT NOW</Button>
						</Summary>
					) : (
						<Summary>
							<SummaryTitle>ORDER SUMMARY</SummaryTitle>
							<SummaryItem>
								<SummaryItemText>Subtotal</SummaryItemText>
								<SummaryItemPrice>₹ {cart.cartTotalAmount}</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem>
								<SummaryItemText>Estimated Shipping</SummaryItemText>
								<SummaryItemPrice>₹ 100.90</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem>
								<SummaryItemText>Shipping Discount</SummaryItemText>
								<SummaryItemPrice>₹ -100.90</SummaryItemPrice>
							</SummaryItem>
							<SummaryItem type="total">
								<SummaryItemText>Total</SummaryItemText>
								<SummaryItemPrice>₹{cart.cartTotalAmount}</SummaryItemPrice>
							</SummaryItem>
							<Button onClick={makePayment}>CHECKOUT NOW</Button>
						</Summary>
					)}
				</Bottom>
			</Wrapper>
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default Cart;
