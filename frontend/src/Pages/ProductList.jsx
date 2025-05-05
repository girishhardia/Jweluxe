import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Products from "../Components/Products";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";
import { mobile } from "../responsive";
// import { useLocation } from "react-router-dom";
import { useState } from "react";

const Container = styled.div``;
const FilterContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;
const Title = styled.h1`
	margin: 20px;
`;
const Filter = styled.div`
	margin: 20px;
	${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;
const FilterText = styled.span`
	font-style: 20px;
	font-weight: 600;
	margin-right: 20px;
	${mobile({ marginRight: "0px" })}
`;
const Select = styled.select`
	padding: 10px;
	margin-right: 20px;
	${mobile({ margin: "10px 0px" })}
`;
const Option = styled.option``;
const ProductList = () => {
	// const location = useLocation();
	// const cate = location.pathname.split("/")[2];
	const [filter, setFilter] = useState("newest");
	return (
		<Container>
			<Navbar />
			<Title>Dresses</Title>
			<FilterContainer>
				<Filter>
					<FilterText>Sort Products:</FilterText>
					<Select onChange={(e) => setFilter(e.target.value)}>
						<Option defaultValue value="asc">
							Price (asc)
						</Option>
						<Option value="desc">Price (desc)</Option>
					</Select>
				</Filter>
			</FilterContainer>
			<Products filter={filter} />
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default ProductList;
