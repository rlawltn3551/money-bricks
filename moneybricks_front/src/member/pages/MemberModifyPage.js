import MemberModifyComponent from "../components/MemberModifyComponent";
import PasswordConfirmationComponent from "../components/PasswordConfirmationComponent";
import React, { useState } from "react";
import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";

const MemberModifyPage = () => {
	const [isPasswordVerified, setIsPasswordVerified] = useState(false);

	const handlePasswordSuccess = () => {
		setIsPasswordVerified(true);
	};

	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />

				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					{!isPasswordVerified ? (
						<PasswordConfirmationComponent onSuccess={handlePasswordSuccess} />
					) : (
						<MemberModifyComponent />
					)}
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default MemberModifyPage;