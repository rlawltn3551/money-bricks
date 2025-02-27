import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import AccountRenewComponent from "../components/AccountRenewComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const AccountRenewPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />

				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<AccountRenewComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};


export default AccountRenewPage;