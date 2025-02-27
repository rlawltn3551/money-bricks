import AccountDetailsComponent from "../components/AccountDetailsComponent";
import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const AccountDetailsPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<AccountDetailsComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default AccountDetailsPage;