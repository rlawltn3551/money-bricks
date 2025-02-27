import React, { useState } from "react";
import "../styles/NavMaturityCalculatorComponent.scss";

const NavMaturityCalculatorComponent = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [principal, setPrincipal] = useState("");
	const [depositCount, setDepositCount] = useState("");
	const [maturityAmount, setMaturityAmount] = useState(null);
	const [error, setError] = useState("");

	// 보너스 우대 금리 로직
	const getBonusRate = (count) => {
		if (count >= 30) return 2.50;
		if (count >= 25) return 1.50;
		if (count >= 20) return 1.00;
		if (count >= 15) return 0.70;
		if (count >= 10) return 0.40;
		if (count >= 5) return 0.20;
		return 0;
	};

	// 만기금 계산 함수
	const calculateMaturityAmount = () => {
		if (!principal || !depositCount) {
			setError("모든 값을 입력해주세요!");
			setMaturityAmount(null);
			return;
		}

		const p = parseFloat(principal);
		const dCount = parseInt(depositCount, 10);
		const maxD = 30; // 이체 기간 30일 고정

		if (p <= 0 || dCount <= 0 || dCount > maxD) {
			setError("올바른 값을 입력해주세요!");
			setMaturityAmount(null);
			return;
		}

		// 기본 금리
		const baseRate = 1.50 / 100;
		// 매일 우대 금리
		const dailyBonusRate = (0.10 * dCount) / 100;
		// 보너스 우대 금리
		const bonusRate = getBonusRate(dCount) / 100;

		// 최종 이자율 계산
		const finalRate = baseRate + dailyBonusRate + bonusRate;

		// 만기금 계산
		const maturity = Math.round(p * (1 + finalRate * (maxD / 365)));

		setMaturityAmount(maturity);
		setError(""); // 에러 메시지 초기화
	};

	// 값 리셋 함수
	const resetForm = () => {
		setPrincipal("");
		setDepositCount("");
		setMaturityAmount(null);
		setError("");
	};

	return (
		<div className="maturity-calculator">
			<button className="calculator-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? "닫기" : "만기 포인트 계산기"}
			</button>
			{isOpen && (
				<div className="calculator-content">
					{/* 원금 입력 */}
					<div className="input-group">
						<label>원금 (포인트)</label>
						<input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
					</div>

					{/* 입금 횟수 입력 */}
					<div className="input-group">
						<label>입금 횟수 (최대 30회)</label>
						<input type="number" value={depositCount} onChange={(e) => setDepositCount(e.target.value)} />
					</div>

					{/* 계산 & 리셋 버튼 */}
					<div className="calculator-btn-group">
						<button className="calculate-btn" onClick={calculateMaturityAmount}>
							계산하기
						</button>
						<button className="reset-btn" onClick={resetForm}>
							되돌리기
						</button>
					</div>

					{/* 결과 출력 */}
					{error && <p className="error">{error}</p>}
					{maturityAmount !== null && (
						<p className="result">예상 만기금: <strong>{maturityAmount.toLocaleString()} 포인트</strong></p>
					)}
				</div>
			)}
		</div>
	);
};

export default NavMaturityCalculatorComponent;
