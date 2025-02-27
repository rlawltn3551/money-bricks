import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import AccountHistoryListComponent from "../components/AccountHistoryListComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const AccounyHistoryListPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />

				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<AccountHistoryListComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};


export default AccounyHistoryListPage;