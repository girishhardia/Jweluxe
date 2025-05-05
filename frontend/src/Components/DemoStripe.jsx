import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
const DemoStripe = () => {
	const [stripeToken, setStripeToken] = useState(null);
	const onToken = (token) => {
		setStripeToken(token);
	};
	useEffect(() => {
		const makeRequest = async () => {
			try {
				const res = await axios.post(
					"http://localhost:8085/api/checkout/payment",
					{
						tokenId: stripeToken.id,
						amount: 2000
					}
				);
				console.log(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		makeRequest();
	}, [stripeToken]);
	return (
		<div>
			<StripeCheckout
				name="JSMS"
				billingAddress
				shippingAddress
				description="Your total is $20"
				amount={2000}
				token={onToken}
				stripeKey="pk_test_51NhAO2SCZGn9oSG6B7Tor52aynMGLbptdv9v2kNYaM9JS6vtbkE3JNFcnEdRfesyr2bo8Gjpaw3sMwQkVbGMPBRC0048LjDJuA"
			>
				<button>Pay Now</button>
			</StripeCheckout>
		</div>
	);
};

export default DemoStripe;
