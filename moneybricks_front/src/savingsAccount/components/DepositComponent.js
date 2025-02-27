import React, { useEffect, useRef, useState } from "react";
import { getPointsInfo } from "../../point/api/pointApi";
import { deposit, checkDepositStatus, getSavingsAccount } from "../api/accountApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import "../styles/DepositComponent.scss";
import CustomModal from "../../common/components/CustomModal";

const calculateBonusInterest = (depositCount) => {
	let bonusRate = 0;
	if (depositCount === 30) bonusRate = 2.50;
	else if (depositCount === 25) bonusRate = 1.50;
	else if (depositCount === 20) bonusRate = 1.00;
	else if (depositCount === 15) bonusRate = 0.70;
	else if (depositCount === 10) bonusRate = 0.40;
	else if (depositCount === 5) bonusRate = 0.20;

	return bonusRate;
};

const MAX_DEPOSIT = 10000;
const MIN_DEPOSIT = 100;
const formattedMaxDeposit = new Intl.NumberFormat().format(MAX_DEPOSIT);
const formattedMinDeposit = new Intl.NumberFormat().format(MIN_DEPOSIT);

const DepositComponent = () => {
	const [availablePoints, setAvailablePoints] = useState(0);
	const [depositAmount, setDepositAmount] = useState("");
	const [canDeposit, setCanDeposit] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [modal, setModal] = useState({
		isOpen: false,
		title: "",
		message: "",
		onClose: null,
		type: "" // 모달 타입 추가 ('deposit' 또는 'bonus')
	});
	const [account, setAccount] = useState(null);

	const depositInputRef = useRef(null);

	const fetchData = async () => {
		try {
			const [pointsData, depositStatus] = await Promise.all([
				getPointsInfo(),
				checkDepositStatus(),
			]);

			setAvailablePoints(pointsData.availablePoints);
			setCanDeposit(depositStatus.canDeposit);
		} catch (error) {
			setError("데이터를 불러오는 데 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		if (depositInputRef.current) {
			depositInputRef.current.focus();
		}
	}, []);

	const applyMaxDeposit = () => {
		const maxPossibleDeposit = Math.min(availablePoints, MAX_DEPOSIT);
		setDepositAmount(maxPossibleDeposit);
	};

	const showModal = (title, message, onClose = null, type = 'deposit') => {
		setModal({ isOpen: true, title, message, onClose, type });
	};

	const handleModalClose = () => {
		const currentModal = modal;
		setModal({ ...modal, isOpen: false });

		// 현재 모달이 입금 완료 모달이고, 보너스 이자율이 있는 경우
		if (currentModal.type === 'deposit' && currentModal.onClose) {
			setTimeout(() => {
				currentModal.onClose();
			}, 300); // 모달 닫힘 애니메이션을 위한 지연
		}
	};

	const handleDeposit = async () => {
		if (!canDeposit) {
			showModal("입금 제한", "오늘은 이미 입금하셨습니다.\n내일 다시 시도해주세요.");
			return;
		}

		const amount = parseInt(depositAmount);
		if (isNaN(amount) || amount <= 0) {
			showModal("입금 오류", "올바른 입금 금액을 입력하세요.");
			return;
		}

		if (amount < MIN_DEPOSIT) {
			showModal("입금 제한", `입금 금액은 최소 ${formattedMinDeposit} 포인트 이상이어야 합니다.`);
			return;
		}

		if (amount > availablePoints) {
			showModal("입금 제한", "사용 가능한 포인트를 초과하여 입금할 수 없습니다.");
			return;
		}

		if (amount > MAX_DEPOSIT) {
			showModal("입금 제한", `한 번에 최대 ${MAX_DEPOSIT} 포인트까지만 입금할 수 있습니다.`);
			return;
		}

		try {
			await deposit({ depositAmount: amount });
			setAvailablePoints((prev) => prev - amount);
			setDepositAmount("");
			setCanDeposit(false);

			// ✅ 입금 후 최신 계좌 정보 가져오기
			const updatedAccount = await getSavingsAccount();
			setAccount(updatedAccount);

			const { depositCount, interestRate } = updatedAccount;
			const bonusInterest = calculateBonusInterest(depositCount);

			if (bonusInterest > 0) {
				// 입금 완료 모달을 먼저 표시하고, 닫힐 때 보너스 모달 표시
				showModal(
					"입금 완료",
					"포인트 입금이 정상적으로 처리되었습니다!\n매일 이자율 0.10 %P를 획득했습니다.",
					() => {
						showModal(
							"축하드립니다!",
							`보너스 이자율 ${bonusInterest.toFixed(2)} %P를 획득하셨습니다!\n총 이자율은 ${interestRate.toFixed(2)} %P입니다.`,
							null,
							'bonus'
						);
					},
					'deposit'
				);
			} else {
				showModal(
					"입금 완료",
					`포인트 입금이 정상적으로 처리되었습니다!\n매일 이자율 0.10 %P를 획득하셨습니다!\n총 이자율은 ${interestRate.toFixed(2)} %P입니다.`,
					null,
					'deposit'
				);
			}

		} catch (error) {
			showModal("입금 실패", error.response?.data?.message || "입금 중 오류가 발생했습니다.");
		}
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div>
			<p className="available-points">입금 가능한 보유 포인트: <strong>{availablePoints.toLocaleString()} P</strong></p>

			<div className="deposit-input-container">
				<div className="max-deposit-button-container">
					<button onClick={applyMaxDeposit} className="max-deposit-button">
						보유 포인트 최대 적용
					</button>
				</div>
				<input
					ref={depositInputRef}
					type="number"
					value={depositAmount}
					onChange={(e) => setDepositAmount(e.target.value)}
					placeholder="입금할 포인트 입력"
					min={MIN_DEPOSIT}
					max={MAX_DEPOSIT}
					className="deposit-input"
				/>
			</div>

			<ul className="deposit-info">
				<li>하루에 한 번만 입금할 수 있습니다.</li>
				<li>한 번에 최저 {formattedMinDeposit} P ~ 최대 {formattedMaxDeposit} P까지 입금 가능합니다.</li>
				<li>보유 포인트를 초과하여 입금할 수 없습니다.</li>
				<li>입금 후 중도 해지한 당일에는 다시 입금을 진행할 수 없습니다.</li>
			</ul>

			<button onClick={handleDeposit} className="deposit-button">
				입금하기
			</button>

			<CustomModal
				isOpen={modal.isOpen}
				onClose={handleModalClose}
				title={modal.title}
				buttons={
					<button className="confirm-btn" onClick={handleModalClose}>
						확인
					</button>
				}
			>
				<p dangerouslySetInnerHTML={{ __html: modal.message.replace(/\n/g, "<br />") }}></p>
			</CustomModal>
		</div>
	);
};

export default DepositComponent;