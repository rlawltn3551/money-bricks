import React, { useEffect, useState } from "react";
import "../styles/MainPage.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavDictionaryComponent from "./NavDictionaryComponent";
import useCustomLogin from "../hooks/useCustomLogin";
import CustomModal from "./CustomModal";
import useAdminOnly from "../hooks/useAdminOnly";
import { getUnreadNotificationCount } from "../../notification/api/notificationApi";
import NotificationDropdown from "../../notification/components/NotificationDropdown";

// logo 이미지
const logoSrc =
	`${process.env.PUBLIC_URL}/images/moneybricks_logo.png`;

const BasicMenu = () => {
	const categories = [
		{ id: 1, title: "모의 주식", path: "/stock" },
		{ id: 2, title: "예적금 비교", path: "/product/list" },
		{ id: 3, title: "퀴즈" , path: "/quiz"},
		{ id: 4, title: "금융 사전", path: "/dictionary" },
		{ id: 5, title: "머니 뉴스", path: "/moneynews" },
		{ id: 6, title: "커뮤니티", path: "/community" },
		{ id: 7, title: "포인트 샵", path: "/mall" },
	];

	const { isLogin, moveToLogin, doLogout, moveToPath } = useCustomLogin();
	const { isAdmin } = useAdminOnly();
	const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0); // 알림 갯수 상태
	const [activeCategory, setActiveCategory] = useState(null); // 클릭된 카테고리 상태
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// 로그인 후 알림 개수 조회
		if (isLogin) {
			const fetchUnreadCount = async () => {
				try {
					const count = await getUnreadNotificationCount();
					setUnreadCount(count); // 알림 개수 상태 갱신
				} catch (error) {
					console.error("알림 갯수 조회 오류:", error);
				}
			};
			fetchUnreadCount();
		}
	}, [isLogin]);

	const handleLogout = () => {
		doLogout();
		alert("로그아웃되었습니다.");
		moveToPath("/");
	};

	const handleCloseModal = () => {
		setIsLoginPromptOpen(false);
	};

	const handleGoToLogin = () => {
		setIsLoginPromptOpen(false);
		moveToLogin();
	};

	// 관리자 또는 마이페이지 이동
	const handlePageClick = () => {
		if (isLogin) {
			navigate(isAdmin ? "/admin" : "/mypage/account");
		} else {
			setIsLoginPromptOpen(true);
		}
	};

	const handleGoToQna = () => {
		navigate("/board");
	}

	const handleCategoryClick = (path, id) => {
		if ((path === "/stock" || path === "/quiz") && !isLogin) {
			setIsLoginPromptOpen(true); // 로그인 모달 띄우기
		} else {
			navigate(path); // 정상 이동
			setActiveCategory(id); // 클릭된 메뉴 설정
		}
	};

	return (
		<div className="main-page">
			<header className="header">
				<div className="header-content">
					<div className="logo">
						<Link to="/">
							<img src={logoSrc} alt="Logo" />
						</Link>
					</div>
					<div className="header-right">
						{/* 알림 갯수 표시 */}
						{isLogin && (
							<NotificationDropdown
								unreadCount={unreadCount}
								setUnreadCount={setUnreadCount}
							/>
						)}
						<button className="btn" onClick={handlePageClick}>
							{isAdmin ? "관리자 페이지" : "마이 페이지"}
						</button>
						<button className="btn" onClick={handleGoToQna}>고객센터</button>
						{isLogin ? (
							<button className="btn" onClick={handleLogout}>
								<span>로그아웃</span>
							</button>
						) : (
							<button className="btn" onClick={moveToLogin}>
								<span>로그인</span>
							</button>

						)}
					</div>
				</div>
			</header>

			<div className="search-container">
				<div className="search-box">
					<NavDictionaryComponent />
					<button className="search-button">
					</button>
				</div>
			</div>

			<nav className="category-menu">
				{categories.map((category) => (
					<div
						key={category.id}
						className={`category-item ${location.pathname === category.path ? 'active' : ''}`}
						onClick={() => handleCategoryClick(category.path, category.id)}
					>
						{category.title}
					</div>
				))}
			</nav>


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
					<div className="modal-body">
						접근하려면 먼저 로그인 해주세요!
					</div>
				</CustomModal>
			)}
		</div>
	);
};


export default BasicMenu;