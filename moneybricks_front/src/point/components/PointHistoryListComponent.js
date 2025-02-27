import React, { useEffect, useState } from "react";
import { getPointsHistories } from "../api/pointApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import PageComponent from "../../common/components/PageComponent";
import useCustomMove from "../../common/hooks/useCustomMove";
import { useNavigate } from "react-router-dom";
import "../styles/PointHistoryListComponent.scss";
import CustomModal from "../../common/components/CustomModal";

// 액션 타입 변환 함수
const getActionTypeText = (actionType) => {
	switch (actionType) {
		case "SIGNUP_BONUS":
			return "회원가입 보너스";
		case "DEPOSIT":
			return "포인트 적금 입금";
		case "EARLY_WITHDRAWAL":
			return "중도 해지";
		case "MATURITY_WITHDRAWAL":
			return "만기 해지";
		case "PURCHASE":
			return "포인트샵 구매";
		case "GAME_REWARD":
			return "모의 주식 결과";
		case "CHECK_IN":
			return "출석 체크 보상";
		case "QUIZ":
			return "퀴즈 보상";
		default:
			return "알 수 없음";
	}
};

const pageState = {
	dtoList: [],
	pageNumList: [],
	prev: false,
	next: false,
	totalCount: 0,
	prevPage: 0,
	nextPage: 0,
	totalPage: 0,
	current: 0,
};

// 날짜 포맷 함수 (예: 2025-02-09 14:30)
const formatDate = (dateTime) => {
	return new Date(dateTime).toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// 포인트 변동 표시 함수 (양수면 `+` 표시)
const formatPointsChange = (points) => {
	return points > 0 ? `+${points} P` : `${points} P`;
};

// 포인트 변동량 클래스 적용 함수
const getPointsClassName = (points) => {
	if (points > 0) return "positive-points";  // 양수 → 파란색
	if (points < 0) return "negative-points";  // 음수 → 빨간색
	return "neutral-points";                   // 0 → 검정색
};

const PointHistoryListComponent = () => {
	const [historyList, setHistoryList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [serverData, setServerData] = useState(pageState);
	const [error, setError] = useState("");
	const [modalData, setModalData] = useState(null);

	const navigate = useNavigate();
	const { page, size, refresh } = useCustomMove(); // useCustomMove 훅 사용

	useEffect(() => {
		const fetchPointsHistory = async () => {
			try {
				const data = await getPointsHistories({ page, size });
				setHistoryList(data.dtoList);
				setServerData(data);
			} catch (error) {
				setError("포인트 내역을 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPointsHistory();
	}, [page, size, refresh]);

	// ✅ 페이지 이동 함수 (URL 유지하면서 `page`, `size`만 변경)
	const movePage = (newPage) => {
		navigate({
			search: `?page=${newPage.page}&size=${size}`,
		});
	};

	// 모달 열기 함수
	const openModal = (history) => {
		setModalData(history);
	};

	// 모달 닫기 함수
	const closeModal = () => {
		setModalData(null);
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div>
			{historyList.length > 0 ? (
				<table className="points-history-table">
					<thead>
					<tr>
						<th>총 포인트 변동량</th>
						<th>사용 가능 포인트 변동량</th>
						<th>유형</th>
						<th>상세 보기</th>
					</tr>
					</thead>
					<tbody>
					{historyList.map((history) => (
						<tr key={history.id}>
							<td className={`table-total-points-changed ${getPointsClassName(history.totalPointsChanged)}`}>
								{formatPointsChange(history.totalPointsChanged.toLocaleString())}
							</td>
							<td
								className={`table-available-points-changed ${getPointsClassName(history.availablePointsChanged)}`}>
								{formatPointsChange(history.availablePointsChanged.toLocaleString())}
							</td>
							<td>{getActionTypeText(history.actionType)}</td>
							<td className="btn-detail-cell">
								<button className="btn-detail" onClick={() => openModal(history)}>보기</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			) : (
				<p className="no-history">포인트 사용 내역이 없습니다.</p>
			)}

			{/* 설명 추가 */}
			<div className="point-explanation">
				<p><strong>포인트 적금 입금:</strong> 적금 계좌에 입금된 금액은 <strong>총 포인트에는 변동이 없으며, 사용 가능 포인트만 변동</strong>합니다. 기간
					내 <strong>하루에 1번</strong>만 입금 가능합니다.</p>
				<p><strong>회원가입 보너스:</strong> 회원가입 시 10,000P가 지급됩니다.</p>
				<p><strong>출석체크 보상:</strong> 출석체크를 통해 <strong>매일 10P</strong>를 받을 수 있으며, 누적일 수에 따라 보너스 포인트도 지급받을 수 있습니다. <br />매월 1일마다 출석이 리셋됩니다.</p>
				<p><strong>중도 해지:</strong> 포인트 적금 계좌를 중도에 해지할 경우, <strong>현재 적용 이자율의 50%</strong>만 적용된 만기 금액이 포인트로 지급됩니다.
				</p>
				<p><strong>만기 해지:</strong> 만기 시 포인트 적금 계좌에서 만기 해지된 금액이 포인트로 지급됩니다.</p>
				<p><strong>포인트샵 구매:</strong> 포인트샵에서 상품을 구매하는 내역입니다. <strong>계좌 생성 후 7일 뒤(8일차)</strong>부터 사용 가능한
					포인트로 <strong>포인트샵 이용 가능</strong>합니다.</p>
				<p><strong>모의 주식 결과:</strong> 모의 주식 내 활동을 통해 포인트가 변동됩니다. <strong>하루에 1번</strong>만 적용됩니다.</p>
			</div>

			{/* 페이지네이션 */}
			<PageComponent serverData={serverData} movePage={movePage} />

			{/* 모달 */}
			<CustomModal
				isOpen={modalData !== null}
				onClose={closeModal}
				title="포인트 내역 상세"
				buttons={
					<button className="confirm-btn" onClick={closeModal}>
						닫기
					</button>
				}
			>
				<table className="modal-point-details-table">
					<thead>
					<tr>
						<th>항목</th>
						<th>내용</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td><strong>유형</strong></td>
						<td>{getActionTypeText(modalData?.actionType)}</td>
					</tr>
					<tr>
						<td><strong>변화 전 총 포인트</strong></td>
						<td>{(modalData?.finalTotalPoints - modalData?.totalPointsChanged).toLocaleString()} P</td>
					</tr>
					<tr>
						<td><strong>변화 전 사용 가능 포인트</strong></td>
						<td>{(modalData?.finalAvailablePoints - modalData?.availablePointsChanged).toLocaleString()} P</td>
					</tr>
					<tr>
						<td><strong>총 포인트 변동량</strong></td>
						<td>{formatPointsChange(modalData?.totalPointsChanged.toLocaleString())}</td>
					</tr>
					<tr>
						<td><strong>사용 가능 포인트 변동량</strong></td>
						<td>{formatPointsChange(modalData?.availablePointsChanged.toLocaleString())}</td>
					</tr>
					<tr>
						<td><strong>변화 후 총 포인트</strong></td>
						<td className="modal-final-total-points">{modalData?.finalTotalPoints.toLocaleString()} P</td>
					</tr>
					<tr>
						<td><strong>변화 후 사용 가능 포인트</strong></td>
						<td className="modal-final-available-points">{modalData?.finalAvailablePoints.toLocaleString()} P</td>
					</tr>
					<tr>
						<td><strong>시간</strong></td>
						<td>{formatDate(modalData?.createdAt)}</td>
					</tr>
					</tbody>
				</table>

			</CustomModal>


		</div>
	);
};

export default PointHistoryListComponent;
