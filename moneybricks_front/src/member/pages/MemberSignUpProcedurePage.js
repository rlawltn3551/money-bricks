// src/pages/SignupProcedurePage.js
import React from "react";
import MemberSignUpProcedureComponent from "../components/MemberSignUpProcedureComponent";
import FooterComponent from "../../common/components/FooterComponent";
import BasicMenu from "../../common/components/BasicMenu";

const MemberSignupProcedurePage = () => {

	return (
		<div>
			<BasicMenu />
			<MemberSignUpProcedureComponent />
			<FooterComponent />
		</div>
	);
};

export default MemberSignupProcedurePage;
