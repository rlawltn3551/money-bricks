import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import PointHistoryListComponent from "../components/PointHistoryListComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const PointHistoryListPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<PointHistoryListComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default PointHistoryListPage;