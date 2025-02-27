import React, { useState } from "react";
import "../styles/NavComponent.scss";
import NavNewsComponent from "./NavNewsComponent";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import CustomModal from "./CustomModal";
import NavUserComponent from "./NavUserComponent";
import NavMallComponent from "./NavMallComponent";
import NavMaturityCalculatorComponent from "./NavMaturityCalculatorComponent";
import RankingBoard from "../../stock/components/RankingBoard";
import {useSelector} from "react-redux";

export const NavComponent = () => {
	const navigate = useNavigate();
	const { isLogin, moveToLogin } = useCustomLogin();
	const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
	const username = useSelector((state) => state.loginSlice.username);

	// 이미지 클릭 이벤트 (로그인 상태 체크 후 이동)
	const handleImageClick = (path) => {
		if (!isLogin) {
			setIsLoginPromptOpen(true); // 로그인 모달 표시
		} else {
			navigate(path); // 로그인 상태면 정상 이동
		}
	};

	// 모달 닫기
	const handleCloseModal = () => {
		setIsLoginPromptOpen(false);
	};

	// 로그인 페이지 이동
	const handleGoToLogin = () => {
		setIsLoginPromptOpen(false);
		moveToLogin();
	};

	return (
		<div className="nav-container">
			<div className="main-layout">
				<div className="main-layout-left">
					<div className="image1" onClick={() => handleImageClick("/stock")}>
						<img
							src="/images/moneyBricks_main banner.png"
							alt="Main Banner"
							className="responsive-image"
						/>
					</div>

					<div className="main-layout-bottom">
						<div className="mall-section">
							<NavMallComponent/>
						</div>
					</div>

					<div className="news">
						<NavNewsComponent/>
					</div>
				</div>
				<div className="main-layout-right">
					<div className="user-section">
						<NavUserComponent/>
					</div>
					<div className="image2" onClick={() => handleImageClick("/quiz")}>
						<img
							src="/images/moneyBricks_quiz banner.png"
							alt="Quiz Banner"
							className="responsive-image"
						/>
					</div>
					<div className="calculator-section">
						<NavMaturityCalculatorComponent />
					</div>
					<div className="ranking-section">
						<RankingBoard username={username}/>
					</div>
				</div>
			</div>

			{/* main-layout-bottom이 전체 너비를 차지하도록 변경 */}


			{/* 로그인 유도 모달 */}
			{isLoginPromptOpen && (
				<CustomModal
					isOpen={isLoginPromptOpen}
					onClose={handleCloseModal}
					title="로그인 필요"
					buttons={
						<>
							<button onClick={handleGoToLogin} className="confirm-btn">
								로그인
							</button>
							<button onClick={handleCloseModal} className="cancel-btn">
								취소
							</button>
						</>
					}
				>
					<div className="modal-body">접근하려면 먼저 로그인 해주세요!</div>
				</CustomModal>
			)}
		</div>
	);
};

export default NavComponent;
