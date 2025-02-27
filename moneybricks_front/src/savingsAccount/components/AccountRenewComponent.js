import React, { useEffect, useState } from "react";
import { getSavingsAccount, renewSavingsAccount } from "../api/accountApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import CustomModal from "../../common/components/CustomModal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/AccountRenewComponent.scss";
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

const AccountRenewComponent = () => {
	const [account, setAccount] = useState(initState);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [renewalPeriod, setRenewalPeriod] = useState(7); // 기본값 7일
	const [newStartDate, setNewStartDate] = useState(""); // 갱신 시작일
	const [newEndDate, setNewEndDate] = useState(""); // 갱신 만기일
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRenewing, setIsRenewing] = useState(false);
	const navigate = useNavigate();

	// 계좌 정보 불러오기
	useEffect(() => {
		const fetchAccount = async () => {
			try {
				const data = await getSavingsAccount();
				setAccount(data);
				setNewStartDate(new Date().toLocaleDateString()); // 오늘 날짜로 시작일 설정
				setNewEndDate(calculateNewEndDate(7)); // 기본값 7일로 계산
			} catch (error) {
				setError("계좌 정보를 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAccount();
	}, []);

	// 새로운 만기일 계산 함수
	const calculateNewEndDate = (days) => {
		const startDate = new Date(); // 오늘 날짜부터 시작
		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + days - 1); // 선택한 일수에서 1을 뺀 날짜
		return endDate.toLocaleDateString();
	};

	// 기간을 강조하는 스타일 적용
	const tileClassName = ({ date }) => {
		const startDate = new Date(newStartDate);
		const endDate = new Date(newEndDate);

		// 날짜가 기간 내에 포함되면 색칠
		if (date >= startDate && date <= endDate) {
			return "highlight-period";
		}
		return "";
	};

	// 갱신 요청
	const handleRenewal = async () => {
		setIsRenewing(true);
		try {
			await renewSavingsAccount(renewalPeriod);
			setIsModalOpen(true); // 모달 열기
		} catch (error) {
			alert("갱신에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setIsRenewing(false);
		}
	};

	// 모달 닫기
	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate("/mypage/account");
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div>
			<h2>갱신 기간 선택</h2>
			<div className="renewal-container">
				<div className="renewal-options">
					{[7, 14, 21, 30].map((days) => (
						<label key={days}>
							<input
								type="radio"
								value={days}
								checked={renewalPeriod === days}
								onChange={() => {
									setRenewalPeriod(days);
									setNewEndDate(calculateNewEndDate(days)); // 새로운 만기일 갱신
								}}
							/>
							{days}일
						</label>
					))}
				</div>

				{/* 캘린더 */}
				<div className="calendar-container">
					<p>이체 기간: <strong>{newStartDate} ~ {newEndDate}</strong></p>

					{/* 기간 강조 표시된 달력 */}
					<Calendar
						tileClassName={tileClassName} // 기간에 해당하는 날짜 색칠
						value={new Date()} // 기본값 오늘 날짜
					/>
				</div>
			</div>

			<div className="account-renew-description">
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
					<li>- <span className="rate-number">10회</span> 입금 시: +연 0.20%p (누적 <span
						className="highlight">연 0.40%p)</span></li>
					<li>- <span className="rate-number">15회</span> 입금 시: +연 0.30%p (누적 <span
						className="highlight">연 0.70%p)</span></li>
					<li>- <span className="rate-number">20회</span> 입금 시: +연 0.30%p (누적 <span
						className="highlight">연 1.00%p)</span></li>
					<li>- <span className="rate-number">25회</span> 입금 시: +연 0.50%p (누적 <span
						className="highlight">연 1.50%p)</span></li>
					<li>- <span className="rate-number">30회</span> 입금 시: +연 1.00%p (누적 <span
						className="highlight">연 2.50%p)</span></li>
				</ul>
				5. 만약 계좌가 중도 해지된 경우, 적용 금리가 <span className="rate-percentage">50%로 감소</span>되며 이자 지급액이 줄어들 수
				있습니다.<br />
				이자율은 매일 계산되어 적용됩니다.<br />
			</div>

			<button className="renew-button" onClick={handleRenewal} disabled={isRenewing}>
				{isRenewing ? "갱신 중..." : "갱신하기"}
			</button>


			{/* 갱신 성공 모달 */}
			<CustomModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title="계좌 갱신 성공"
				buttons={(
					<button className="confirm-btn" onClick={handleCloseModal}>확인</button>
				)}
			>
				<p>계좌 갱신이 완료되었습니다!<br />새 시작일은 {newStartDate}, 만기일은 {newEndDate}입니다.</p>
			</CustomModal>
		</div>
	);
};

export default AccountRenewComponent;
