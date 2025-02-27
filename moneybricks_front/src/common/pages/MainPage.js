import React, { useEffect, useState } from "react";
import "../styles/MainPage.scss";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import useCustomLogin from "../hooks/useCustomLogin";
import CustomModal from "../components/CustomModal";
import NavComponent from "../components/NavComponent";
import BasicMenu from "../components/BasicMenu";
import { checkMaturityAndProcess, getSavingsAccount } from "../../savingsAccount/api/accountApi";
import { checkFirstLoginFlag, updateFirstLoginFlag } from "../../member/api/memberApi";
import ChatbotComponent from "../../chatbot/components/ChatbotComponent";
import useAdminOnly from "../hooks/useAdminOnly";
import { useSelector } from "react-redux";

// 기본 금리 & 매일 추가 금리
const BASE_INTEREST_RATE = 1.5;
const DAILY_BONUS_RATE = 0.1;

const initAccountState = {
	accountNumber: "",
	interestRate: 0,
	startDate: "",
	endDate: "",
	totalAmount: 0,
	status: "",
	depositCount: 0,
};

// 날짜 포맷 함수
const formatDate = (date) => {
	if (!date) return "-";
	const options = { year: "numeric", month: "numeric", day: "numeric" };
	return new Date(date).toLocaleDateString("ko-KR", options);
};

// 만기액 계산 함수
const calculateMaturityAmount = (account) => {
	const startDate = new Date(account.startDate);
	const endDate = new Date(account.endDate);
	const depositPeriod = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1을 해서 시작일 포함

	const annualRate = account.interestRate / 100;
	const dailyRate = annualRate / 365;

	const interest = account.totalAmount * dailyRate * depositPeriod;
	const maturityAmount = account.totalAmount + interest;

	return Math.round(maturityAmount);
};

const MainPage = () => {
	const { isLogin } = useCustomLogin();
	const { isAdmin } = useAdminOnly();
	const navigate = useNavigate();
	const userId = useSelector(state => state.loginSlice.id);
	const username = useSelector(state => state.loginSlice.name);

	const [isFirstLogin, setIsFirstLogin] = useState(false);
	const [isMatured, setIsMatured] = useState(false);
	const [accountInfo, setAccountInfo] = useState(initAccountState);
	const [isChatbotOpen, setIsChatbotOpen] = useState(false);

	useEffect(() => {
		const checkIsFirstLogin = async () => {
			if (isLogin) {
				try {
					const result = await checkFirstLoginFlag();
					if (result) {
						setIsFirstLogin(true);
						await updateFirstLoginFlag();
						const accountData = await getSavingsAccount();
						setAccountInfo(accountData);
					}
				} catch (error) {
					console.error("첫 로그인 확인 중 오류 발생", error);
				}
			}
		};

		checkIsFirstLogin();
	}, [isLogin]);

	useEffect(() => {

		const checkMaturity = async () => {
			if (isLogin) {
				try {
					const result = await checkMaturityAndProcess();
					if (result.isMatured) {
						setIsMatured(true);
						const accountData = await getSavingsAccount();
						setAccountInfo(accountData);
					}
				} catch (error) {
					console.error("만기 처리 중 오류가 발생했습니다.", error);
				}
			}
		};

		checkMaturity();
	}, [isLogin]);

	const handleCloseModal = () => {
		setIsFirstLogin(false);
		setIsMatured(false);
	};

	const handleGoToAccount = () => {
		navigate("/mypage/account");
		setIsFirstLogin(false);
	};

	return (
		<div className="main-page">
			<BasicMenu />
			<NavComponent />
			<FooterComponent />

			{/* 첫 로그인 모달 */}
			{!isAdmin && isFirstLogin && (
				<CustomModal
					isOpen={isFirstLogin}
					onClose={handleCloseModal}
					title="포인트 적금 개설 완료!"
					buttons={
						<button onClick={handleGoToAccount} className="confirm-btn">
							계좌 확인하기
						</button>
					}
				>
					<div className="modal-body">
						<p>포인트 적금 계좌가 개설되었습니다!</p>
						<table className="modal-account-table">
							<tbody>
							<tr>
								<th>기본 금리</th>
								<td>{BASE_INTEREST_RATE}%</td>
							</tr>
							<tr>
								<th>매일 우대금리</th>
								<td>매일 +{DAILY_BONUS_RATE}%P</td>
							</tr>
							<tr>
								<th>시작일</th>
								<td>{formatDate(accountInfo.startDate)}</td>
							</tr>
							<tr>
								<th>만기일</th>
								<td>{formatDate(accountInfo.endDate)}</td>
							</tr>
							</tbody>
						</table>
						<p className="notice">자세한 내용은 마이페이지에서 확인하실 수 있습니다.</p>
					</div>
				</CustomModal>
			)}

			{/* 만기 처리 모달 */}
			{!isAdmin && isMatured && (
				<CustomModal
					isOpen={isMatured}
					onClose={handleCloseModal}
					title="적금 만기 안내"
					buttons={
						<>
							<button onClick={handleGoToAccount} className="confirm-btn">
								계좌 갱신하기
							</button>
							<button onClick={handleCloseModal} className="cancel-btn">
								취소
							</button>
						</>
					}
				>
					<div className="modal-body">
						<p>축하합니다! 적금이 만기 해지되었습니다.</p>
						<table className="modal-account-table">
							<tbody>
							<tr>
								<th>총 입금액</th>
								<td>{accountInfo.totalAmount} P</td>
							</tr>
							<tr>
								<th>적용 금리</th>
								<td>{accountInfo.interestRate}%</td>
							</tr>
							<tr>
								<th>예상 지급액</th>
								<td>{calculateMaturityAmount(accountInfo)} P</td>
							</tr>
							<tr>
								<th>입금 횟수</th>
								<td>{accountInfo.depositCount}회</td>
							</tr>
							</tbody>
						</table>
						<p className="notice">포인트 적금 계좌를 갱신하겠습니까?</p>
						<p className="notice">즉시 갱신하지 않아도 마이 페이지에서 갱신 가능합니다.</p>
					</div>
				</CustomModal>
			)}

			{/* 챗봇 컴포넌트 */}
			<div className="chatbot-button-container">
				<button className="chatbot-toggle-btn" onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
					💬
				</button>
				{isChatbotOpen && <ChatbotComponent userId={userId} username={username} />}
			</div>

		</div>
	);
};

export default MainPage;
