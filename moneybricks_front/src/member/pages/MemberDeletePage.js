import PasswordConfirmationComponent from "../components/PasswordConfirmationComponent";
import React, { useState } from "react";
import MemberDeleteComponent from "../components/MemberDeleteComponent";
import MyPageSideBarComponent from "../../mypage/components/MyPageSideBarComponent";
import "../../mypage/styles/Mypage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";

const MemberDeletePage = () => {
	const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 확인 여부

	const handlePasswordSuccess = () => {
		setIsPasswordVerified(true); // 비밀번호 확인 성공 시 상태 변경
	};

	return (
		<>
			<BasicMenu />
			<div className="mypage-container">
				<MyPageSideBarComponent />

				{/* 콘텐츠 영역 */}
				<div className="mypage-content">
					{!isPasswordVerified ? (
						<PasswordConfirmationComponent onSuccess={handlePasswordSuccess} /> // 비밀번호 확인
					) : (
						<MemberDeleteComponent /> // 회원 탈퇴 컴포넌트
					)}
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default MemberDeletePage;
