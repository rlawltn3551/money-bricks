import React from "react";
import MallListComponent from "../component/MallListComponent";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";

const MallPage = () => {
	return (
		<div>
			<BasicMenu />
			<MallListComponent />
			<FooterComponent />
		</div>
	);
};

export default MallPage;