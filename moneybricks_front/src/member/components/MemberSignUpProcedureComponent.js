import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../common/components/CustomModal";  // CustomModal 컴포넌트 import
import "../styles/MemberSignUpProcedureComponent.scss";

const MemberSignupProcedureComponent = () => {
	const [isChecked, setIsChecked] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
	const navigate = useNavigate();  // navigate 훅 사용

	const handleCheckboxChange = () => {
		setIsChecked((prevState) => !prevState);
	};

	const handleNext = () => {
		if (isChecked) {
			setIsModalOpen(true); // 동의하면 모달을 열기
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false); // 모달 닫기
	};

	const handleModalAgree = () => {
		setIsModalOpen(false); // 모달 닫기
		navigate('/signup'); // 동의 후 /signup으로 이동
	};

	return (
		<div className="signup-procedure-container">
			<div className="signup-procedure">
				<h1>회원가입 동의</h1>

				{/* 포인트 적금 상품 안내 */}
				<div className="own-account-prodcuct">
					<div className="product-header">
						<h2>머니브릭스 포인트 적금 계좌 안내</h2>
					</div>

					<div className="product-details">
						<p>
							회원가입 시 자동으로 생성되는 포인트 적금 계좌는, 사용자가 얻은 포인트를 적금 형태로 넣어 두고 금리를 적용받는 서비스입니다. 이 계좌는 7일로 고정된 계약기간으로 자동 생성되며, 이후 갱신 시에는 <strong>7일,
							14일, 21일, 30일 중 선택</strong>할 수 있습니다.
						</p>
						<h3>포인트 적금 계좌 주요 특징</h3>
						<ul>
							<li><strong>- 가입 시 포인트 지급:</strong> 회원가입 시 <strong>10,000포인트</strong>가 자동 지급됩니다. 추가 포인트는 모의 주식 게임, 퀴즈, 이벤트 등을 통해 얻을 수 있습니다.</li>
							<li><strong>- 적금 납입 및 금리:</strong>
								<ul>
									<li>- 최대 <strong>연 5.50%p</strong>의 금리를 제공합니다.</li>
									<li>- 매일 우대금리: 최대 <strong>연 3.00%p</strong> 제공</li>
									<li>- 매 입금 시마다 <strong>+연 0.10%p</strong>가 더해집니다.</li>
									<li>- 보너스 우대금리: 최대 <strong>연 2.40%p</strong> 제공</li>
									<li>- 입금 횟수에 따라 보너스 금리가 누적됩니다.</li>
									<ul>
										<li>- <strong>5회</strong> 입금 시: +연 0.20%p</li>
										<li>- <strong>10회</strong> 입금 시: +연 0.20%p <strong>(누적 연 0.40%p)</strong></li>
										<li>- <strong>15회</strong> 입금 시: +연 0.30%p <strong>(누적 연 0.70%p)</strong></li>
										<li>- <strong>20회</strong> 입금 시: +연 0.30%p <strong>(누적 연 1.00%p)</strong></li>
										<li>- <strong>25회</strong> 입금 시: +연 0.50%p <strong>(누적 연 1.50%p)</strong></li>
										<li>- <strong>30회</strong> 입금 시: +연 1.00%p <strong>(누적 연 2.50%p)</strong></li>
									</ul>
								</ul>
							</li>
							<li>- <strong>입금 규칙:</strong>
								<ul>
									<li>- <strong>1일 1회</strong>만 입금할 수 있으며, <strong>최대 10,000포인트</strong>까지 입금 가능합니다.</li>
									<li>- 입금은 <strong>100포인트 이상</strong>, 1원 단위로 가능하고, 그 외의 입금은 모두 제한됩니다.</li>
									<li>- 적금에 사용하는 포인트는 포인트샵에서 <strong>사용할 수 없습니다.</strong></li>
								</ul>
							</li>
							<li>- <strong>적금 만기 후 해지:</strong> 적금 계좌의 만기일이 지나면 자동으로 해지됩니다. 만기 해지 후 적금에 사용되었던 포인트는 이자를 포함해 사용 가능한 포인트로 전환되어, 포인트샵에서 사용할 수 있게 됩니다.</li>
							<li>- <strong>중도 해지 시 금리:</strong> 중도 해지 시 적용된 금리의 <strong>50%</strong>만 반영됩니다. 따라서 중도 해지 후에는 원래의 금리보다 낮은 이자가 적용될 수 있습니다.</li> {/* 추가된 내용 */}
							<li>- <strong>포인트샵 사용 가능 시점:</strong> 포인트샵은 계정 생성일로부터 <strong>1주일 뒤</strong>부터 사용이 가능합니다.</li>
						</ul>
					</div>
				</div>

				{/* 동의 체크박스 */}
				<div className="agreement">
					<input
						type="checkbox"
						id="agree"
						checked={isChecked}
						onChange={handleCheckboxChange}
					/>
					<label htmlFor="agree">이 상품의 조건에 동의합니다.</label>
				</div>

				{/* 동의 후 진행 버튼 */}
				<button
					className="next-btn"
					onClick={handleNext}
					disabled={!isChecked}
				>
					다음
				</button>

				{/* 동의 후 뜨는 모달 */}
				<CustomModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					title="동의 확인"
					buttons={
						<>
							<button onClick={handleModalAgree} className="confirm-btn">동의하고 진행</button>
							<button onClick={handleModalClose} className="cancel-btn">취소</button>
						</>
					}
				>
					<p>상품 조건에 동의하시겠습니까?</p>
				</CustomModal>
			</div>
		</div>
	);
};

export default MemberSignupProcedureComponent;
