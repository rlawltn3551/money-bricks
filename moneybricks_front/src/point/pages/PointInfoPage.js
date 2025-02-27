import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import PointInfoComponent from "../components/PointInfoComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import React from "react";
import FooterComponent from "../../common/components/FooterComponent";

const PointInfoPage = () => {
	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />
				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					<PointInfoComponent />
				</div>
			</div>
			<FooterComponent />
		</>
	);
};
export default PointInfoPage;