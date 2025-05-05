import AllJewellery from "../Components/AllJewellery";
import Announcement from "../Components/Announcement";
import Categories from "../Components/Categories";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Newsletter from "../Components/Newsletter";
import Slider from "../Components/Slider";

const Home = () => {
	return (
		<div>
			<Announcement />
			<Navbar />
			<Slider />
			<Categories />
			<AllJewellery />
			<Newsletter />
			<Footer />
		</div>
	);
};
export default Home;
