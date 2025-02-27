import React, { useEffect, useState } from "react";
import { cancelSavingsAccount, getSavingsAccount } from "../api/accountApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import CustomModal from "../../common/components/CustomModal";
import "../styles/AccountCancelComponent.scss";
import { useNavigate } from "react-router-dom";

const initState = {
	id: null,
	memberId: null,
	accountNumber: "",
	interestRate: 0,
	startDate: "",
	endDate: "",
	totalAmount: 0,
	status: "",
	depositCount: 0,
};

// 계좌 번호 포맷 함수
const formatAccountNumber = (accountNumber) => {
	return accountNumber.replace(/(\d{8})(\d{6})(\d{4})/, "$1-$2-$3");
};

// 만기 예상 지급 포인트 계산 함수
const calculateMaturityAmount = (account) => {
	// 1. 총 예치 기간 계산 (일수)
	const startDate = new Date(account.startDate);
	const endDate = new Date(); // 중도 해지이므로 오늘 날짜를 endDate로 설정
	const depositPeriod = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1을 해서 시작일도 포함

	// 2. 연 이자율을 일일 이자율로 변환
	const annualRate = account.interestRate / 100; // 백분율을 소수로 변환
	const dailyRate = annualRate / 365; // 연 이자율을 일일 이자율로 변환

	// 3. 원금에 이자 적용
	// 중도 해지 시 이자율을 반영: 50%만 적용
	const earlyWithdrawalDailyRate = dailyRate / 2; // 중도 해지 시 이자율 50% 반영
	const interest = account.totalAmount * earlyWithdrawalDailyRate * depositPeriod;
	const maturityAmount = account.totalAmount + interest;

	return Math.round(maturityAmount); // 소수점 이하 반올림
};

const AccountCancelComponent = () => {
	const [account, setAccount] = useState(initState);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isCanceling, setIsCanceling] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // 중도 해지 성공 모달
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAccount = async () => {
			try {
				const data = await getSavingsAccount();
				setAccount(data);
			} catch (error) {
				setError("계좌 정보를 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAccount();
	}, []);

	const handleCancel = async () => {
		setIsCanceling(true);
		try {
			await cancelSavingsAccount();
			setIsModalOpen(false);  // 확인 모달 닫기
			setIsSuccessModalOpen(true); // 중도 해지 성공 모달 열기
		} catch (error) {
			alert("중도 해지에 실패했습니다.");
		} finally {
			setIsCanceling(false);
		}
	};

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	const handleCloseSuccessModal = () => {
		setIsSuccessModalOpen(false);
		navigate("/mypage/account"); // 중도 해지 후 마이페이지로 이동
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	// 중도 해지 시 적용되는 50% 이자율
	const earlyWithdrawalInterestRate = account.interestRate * 0.5;
	// 지급될 포인트 계산 (총 입금 포인트 + 적용된 50% 이자)
	const expectedPayout = calculateMaturityAmount(account);

	return (
		<div>
			<div className="account-details-table">
				<table>
					<tbody>
					<tr>
						<th>계좌 번호</th>
						<td>{formatAccountNumber(account.accountNumber)}</td>
					</tr>
					<tr>
						<th>총 입금 포인트</th>
						<td>{account.totalAmount.toLocaleString()} P</td>
					</tr>
					<tr>
						<th>현재 적용 금리</th>
						<td>{account.interestRate.toFixed(2)} %P</td>
					</tr>
					<tr>
						<th>중도 해지 시 적용 금리</th>
						<td className="emphasized-text">{earlyWithdrawalInterestRate.toFixed(2)} %P</td>
					</tr>
					<tr>
						<th>예상 지급 포인트</th>
						<td className="emphasized-text">{expectedPayout.toLocaleString()} P</td>
					</tr>
					</tbody>
				</table>
			</div>

			<div className="cancel-info">
				<p>중도 해지 시 금리는 **50%만 반영**됩니다. 즉, 예시와 같이 계산된 금리의 절반만 적용됩니다.</p>
			</div>

			<div className="button-container">
				<button className="cancel-button" onClick={handleOpenModal} disabled={isCanceling}>
					{isCanceling ? "처리 중..." : "중도 해지하기"}
				</button>
			</div>

			{/* 중도 해지 확인 모달 */}
			<CustomModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title="중도 해지 확인"
				buttons={
					<>
						<button className="confirm-btn" onClick={handleCancel}>확인</button>
						<button className="cancel-btn" onClick={handleCloseModal}>취소</button>
					</>
				}
			>
				<p>정말 중도 해지하시겠습니까? <br />중도 해지 시 이자의 50%만 받을 수 있습니다.</p>
			</CustomModal>

			{/* 중도 해지 성공 모달 */}
			<CustomModal
				isOpen={isSuccessModalOpen}
				onClose={handleCloseSuccessModal}
				title="계좌 중도 해지 성공"
				buttons={
					<button className="confirm-btn" onClick={handleCloseSuccessModal}>확인</button>
				}
			>
				<p>계좌가 중도 해지되었습니다.</p>
			</CustomModal>
		</div>
	);
};

export default AccountCancelComponent;
