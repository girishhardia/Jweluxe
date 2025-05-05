import styled from "styled-components";
import CategoryItem from "./CategoryItem";
import { mobile } from "../responsive";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
const Container = styled.div`
	display: flex;
	padding: 20px;
	justify-content: space-between;
	${mobile({ padding: "0px", flexDirection: "column" })}
`;

const Categories = () => {
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		getAllCats();
	}, []);
	const getAllCats = async () => {
		const res = await axios.get("http://localhost:8085/api/v1/category");
		if (res.data.status === "success") {
			setCategories(res.data.data);
		} else {
			toast.error("Something went wrong!!");
		}
	};
	return (
		<Container>
			{categories.map((item) => (
				<CategoryItem item={item} key={item.category_id} />
			))}
		</Container>
	);
};

export default Categories;
