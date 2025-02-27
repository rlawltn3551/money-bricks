import React from "react";
import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";
import MypageOrdersHistoryComponent from "../components/MypageOrdersHistoryComponent";

const NotificationPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />

				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<MypageOrdersHistoryComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default NotificationPage;