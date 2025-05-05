import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";
import { useEffect, useState } from "react";
import axios from "axios";

const Container = styled.div`
	padding: 20px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const Products = ({ filter }) => {
	const [products, setProducts] = useState([]);
	// const [filterdProducts,setFilterdProducts] = useState([])
	useEffect(() => {
		getAllProducts();
	}, []);
	// useEffect(() => {
	// 	if ((sort === "newest")) {
	// 		setFilterdProducts((prev) =>
	// 			[...prev].sort((a, b) => a.jewellery_price - b.jewellery_price)
	// 		);
	// 	} else {
	// 		setFilterdProducts((prev) => [...prev].sort((a, b) => b.jewellery_price - a.jewellery_price));
	// 	}
	// })
	const getAllProducts = async () => {
		try {
			const res = await axios.get("http://localhost:8085/api/v1/jewellery");
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Container>
			{popularProducts.map((item) => (
				<Product item={item} key={item.id} />
			))}
		</Container>
	);
};

export default Products;
