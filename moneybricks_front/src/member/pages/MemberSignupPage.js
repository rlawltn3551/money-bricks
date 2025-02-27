import MemberSignUpComponent from "../components/MemberSignUpComponent";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const MemberSignupPage = () => {
	return (
		<div>
			<BasicMenu />
			<MemberSignUpComponent />
			<FooterComponent />
		</div>
	);
};

export default MemberSignupPage;