import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import { mobile } from "../responsive";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
const Container = styled.div``;
const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
`;
const ShowCategory = () => {
	const location = useLocation();
	const categoryName = location.pathname.split("/")[2];
	const [allData, setAllData] = useState([]);
	useEffect(() => {
		GetAllData();
	}, []);
	const GetAllData = async () => {
		const res = await axios.get(
			`http://localhost:8085/api/v1/catejewellery/${categoryName}`
		);
		if (res.data.status === "success") {
			setAllData(res.data.data);
		}
	};
	return (
		<Container>
			<Navbar />
			<Wrapper>
				<div className="jewellery">
					<div className="row">
						{allData.map((j) => {
							return (
								<div className="col-md-3">
									<div className="card" style={{ width: "18rem" }}>
										<img
											src={`http://localhost:8085/${j.jewellery_image}`}
											className="card-img-top"
											alt="..."
										/>
										<div className="card-body">
											<h5 className="card-title" style={{ fontWeight: 600 }}>
												{j.jewellery_name}
											</h5>
											<Link
												style={{ marginTop: "20px" }}
												to={`/product/${j.jewellery_id}`}
												class="btn btn-dark"
											>
												EXPLORE
											</Link>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Wrapper>
			<Newsletter />
			<Footer />
		</Container>
	);
};

export default ShowCategory;
