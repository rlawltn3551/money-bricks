import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import AccountCancelComponent from "../components/AccountCancelComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const AccountCancelPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<AccountCancelComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default AccountCancelPage;