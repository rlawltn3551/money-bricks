import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import CurrentDepositHistoryListComponent from "../components/CurrentDepositHistoryListComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const CurrentDepositHistoryListPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<CurrentDepositHistoryListComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default CurrentDepositHistoryListPage;