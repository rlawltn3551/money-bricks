import React, { useEffect, useState } from "react";
import { getSavingsAccount } from "../api/accountApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import "../styles/AccountDetailsComponent.scss";

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

// 계좌 상태 변환 함수
const getStatusText = (status) => {
	switch (status) {
		case "ACTIVE":
			return "사용 중";
		case "COMPLETED":
			return "만기 해지";
		case "CANCELED":
			return "중도 해지";
		default:
			return "알 수 없음";
	}
};

// 계좌 번호 포맷 함수
const formatAccountNumber = (accountNumber) => {
	return accountNumber.replace(/(\d{8})(\d{6})(\d{4})/, "$1-$2-$3");
};

// 날짜 포맷 함수 (년 월 일로 변경)
const formatDate = (date) => {
	if (!date) return "-";
	const options = { year: "numeric", month: "numeric", day: "numeric" };
	return new Date(date).toLocaleDateString("ko-KR", options);  // "ko-KR"로 한국 날짜 형식
};

// 기본 금리 & 매일 추가 금리
const BASE_INTEREST_RATE = 1.5;
const DAILY_BONUS_RATE = 0.1;

// 보너스 이자율 계산 함수
const calculateBonusInterest = (depositCount) => {
	let bonusRate = 0;
	if (depositCount >= 30) bonusRate = 2.5;
	else if (depositCount >= 25) bonusRate = 1.5;
	else if (depositCount >= 20) bonusRate = 1.0;
	else if (depositCount >= 15) bonusRate = 0.7;
	else if (depositCount >= 10) bonusRate = 0.4;
	else if (depositCount >= 5) bonusRate = 0.2;

	return bonusRate;
};

const calculateMaturityAmount = (account) => {
	// 1. 총 예치 기간 계산 (일수)
	const startDate = new Date(account.startDate);
	const endDate = new Date(account.endDate);
	const depositPeriod = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1을 해서 시작일도 포함

	// 2. 연 이자율을 일일 이자율로 변환
	const annualRate = account.interestRate / 100; // 백분율을 소수로 변환
	const dailyRate = annualRate / 365; // 연 이자율을 일일 이자율로 변환

	// 3. 원금에 이자 적용
	const interest = account.totalAmount * dailyRate * depositPeriod;
	const maturityAmount = account.totalAmount + interest;

	return Math.round(maturityAmount); // 소수점 이하 반올림
};

const AccountDetailsComponent = () => {
	const [account, setAccount] = useState(initState);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
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

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	// 중도 해지 버튼 클릭 시 이동
	const handleCancelClick = () => {
		navigate("/mypage/account/cancel");
	};

	// 갱신 버튼 클릭 시 이동
	const handleRenewClick = () => {
		navigate("/mypage/account/renew");
	};

	return (
		<div>
			{account && (
				<div className="account-info">
					<table className="account-table">
						<tbody>
						{/* 계좌 정보 */}
						<tr>
							<th>계좌 번호</th>
							<td>{formatAccountNumber(account.accountNumber)}</td>
						</tr>

						{/* 이자율 정보 */}
						<tr>
							<th>기본 금리</th>
							<td>{BASE_INTEREST_RATE.toFixed(2)} %P</td>
						</tr>
						<tr>
							<th>매일 우대금리</th>
							<td>+{(account.depositCount * DAILY_BONUS_RATE).toFixed(2)} %P
							</td>
						</tr>
						<tr>
							<th>보너스 우대금리</th>
							<td>+{calculateBonusInterest(account.depositCount).toFixed(2)} %P
							</td>
						</tr>
						<tr className="total-interest">
							<th>적용 금리</th>
							<td>{account.interestRate.toFixed(2)} %P
								{account.status === "CANCELED" && (
									<span className="explanation">(중도 해지로 인해 적용 금리가 50%로 감소하였습니다.)</span>
								)}
								<span className="explanation"> (기본 + 매일 + 보너스)</span>
							</td>
						</tr>

						{/* 날짜 정보 */}
						<tr>
							<th>기간</th>
							<td>{formatDate(account.startDate)} ~ {formatDate(account.endDate)}</td>
						</tr>

						{/* 계좌 상태 및 입금 정보 */}
						<tr>
							<th>총 입금 포인트</th>
							<td>{account.totalAmount.toLocaleString()} P</td>
						</tr>
						<tr>
							<th>만기 예상 지급 포인트</th>
							<td>{calculateMaturityAmount(account).toLocaleString()} P</td>
						</tr>
						<tr>
							<th>입금 횟수</th>
							<td>{account.depositCount} 회</td>
						</tr>
						<tr>
							<th>계좌 상태</th>
							<td className={`status ${account.status.toLowerCase()}`}>
								{getStatusText(account.status)}
							</td>
						</tr>
						</tbody>
					</table>

					<div className="account-description">
						<strong>포인트 적금 안내</strong><br />
						1. 회원가입 시, 자동으로 포인트 적금 계좌가 생성되며, 10,000 포인트가 지급됩니다.<br />
						포인트는 일정 최소 사용 기간(7일)을 거친 후 포인트샵에서 이용할 수 있습니다.<br />
						2. 최대 <span className="rate-number">연 5.50%p</span>의 금리를 제공하며, 매일 우대금리로 최대 <span
						className="rate-number">연 3.00%p</span>를 추가로 제공합니다.<br />
						3. <span className="bonus-rate">매일 우대금리</span>: 매 입금 시마다 <span
						className="rate-percentage">+연 0.10%p</span> 금리가 더해집니다.<br />
						4. <span className="bonus-rate">보너스 우대금리</span>: 최대 <span
						className="rate-percentage">연 2.50%p</span> 제공되며, 입금 횟수에 따라 누적됩니다:<br />
						<ul>
							<li>- <span className="rate-number">5회</span> 입금 시: +<span className="highlight">연 0.20%p</span></li>
							<li>- <span className="rate-number">10회</span> 입금 시: +연 0.20%p (누적 <span className="highlight">연 0.40%p)</span></li>
							<li>- <span className="rate-number">15회</span> 입금 시: +연 0.30%p (누적 <span className="highlight">연 0.70%p)</span></li>
							<li>- <span className="rate-number">20회</span> 입금 시: +연 0.30%p (누적 <span className="highlight">연 1.00%p)</span></li>
							<li>- <span className="rate-number">25회</span> 입금 시: +연 0.50%p (누적 <span className="highlight">연 1.50%p)</span></li>
							<li>- <span className="rate-number">30회</span> 입금 시: +연 1.00%p (누적 <span className="highlight">연 2.50%p)</span></li>
						</ul>
						5. 만약 계좌가 중도 해지된 경우, 적용 금리가 <span className="rate-percentage">50%로 감소</span>되며 이자 지급액이 줄어들 수
						있습니다.<br />
						이자율은 매일 계산되어 적용됩니다.<br />
					</div>

					{/* 버튼 */}
					<div className="button-group">
						{account.status === "ACTIVE" && (
							<button className="terminate-button" onClick={handleCancelClick}>중도 해지</button>
						)}
						{account.status !== "ACTIVE" && (
							<button className="renew-button" onClick={handleRenewClick}>계좌 갱신하기</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountDetailsComponent;
