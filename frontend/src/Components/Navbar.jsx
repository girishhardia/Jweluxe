import { Search, ShoppingCartOutlined } from "@mui/icons-material";
import styled from "styled-components";
import Badge from "@mui/material/Badge";
import { mobile } from "../responsive";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/userRedux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getTotals } from "../redux/cartRedux";

const Container = styled.div`
	height: 60px;
	${mobile({ height: "50px" })}
`;
const Wrapper = styled.div`
	padding: 10px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	${mobile({ padding: "10px 0px" })}
`;
const Left = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
`;
const Language = styled.span`
	font-style: 14px;
	cursor: pointer;
	${mobile({ display: "none" })}
`;
// const SearchContainer = styled.div`
// 	border: 1px solid lightgray;
// 	display: flex;
// 	align-items: center;
// 	margin-left: 25px;
// 	padding: 5px;
// `;
// const Input = styled.input`
// 	border: none;
// 	${mobile({ width: "50px" })}
// `;
const Logo = styled.h1`
	font-weight: bold;
	${mobile({ fontSize: "24px" })}
`;
const Center = styled.div`
	flex: 1;
	text-align: center;
`;
const Right = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	${mobile({ flex: 2, justifyContent: "center" })}
`;
const MenuItem = styled.div`
	font-size: 14px;
	cursor: pointer;
	margin-left: 25px;
	${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;
const Navbar = () => {
	const cartTotalQuantity = useSelector(
		(state) => state.cart.cartTotalQuantity
	);
	const [qty, setQty] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state) => state.cart);
	const { loginState, currentUser } = useSelector((state) => state.user);
	const handleClick = () => {
		dispatch(signOut());
		navigate("/");
	};
	useEffect(() => {
		getQty();
		dispatch(getTotals());
	}, [cart, dispatch, qty]);
	const getQty = async () => {
		if (loginState === false) {
		} else {
			const res = await axios.get(
				`http://localhost:8085/api/v1/cart/getqty/${currentUser.customer_id}`
			);
			setQty(res.data.data);
		}
	};
	const finalQty = qty.reduce((prev, curr) => {
		return prev + curr.qty;
	}, 0);
	return (
		<Container>
			<Wrapper>
				<Left>
					<Language>EN</Language>
					{/* <SearchContainer>
						<Input placeholder="Search" />
						<Search style={{ color: "gray", fontSize: 16 }} />
					</SearchContainer> */}
				</Left>
				<Center>
					<Logo>
						<Link className="logo-link" to="/">
							JSMS.
						</Link>
					</Logo>
				</Center>
				<Right>
					{loginState === false ? (
						<>
							<>
								<Link className="link-link" to="/register">
									<MenuItem>REGISTER</MenuItem>
								</Link>
								<Link className="link-link" to="/login">
									<MenuItem>LOGIN</MenuItem>
								</Link>
							</>
						</>
					) : (
						<>
							<Link
								to="/profile"
								style={{ textDecoration: "none", color: "black" }}
							>
								<MenuItem>{currentUser.name}</MenuItem>
							</Link>
							<Link to="/orders" style={{ textDecoration: "none" }}>
								<MenuItem style={{ color: "black" }}>MY ORDERS</MenuItem>
							</Link>
							<MenuItem style={{ cursor: "pointer" }} onClick={handleClick}>
								LOGOUT
							</MenuItem>
						</>
					)}
					<Link to="/cart">
						<MenuItem>
							<Badge badgeContent={cartTotalQuantity}>
								<ShoppingCartOutlined />
							</Badge>
						</MenuItem>
					</Link>
				</Right>
			</Wrapper>
		</Container>
	);
};

export default Navbar;
