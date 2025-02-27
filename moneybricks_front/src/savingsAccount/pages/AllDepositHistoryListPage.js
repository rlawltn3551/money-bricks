import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import AllDepositHistoryListComponent from "../components/AllDepositHistoryListComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const AllDepositHistoryListPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<AllDepositHistoryListComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default AllDepositHistoryListPage;