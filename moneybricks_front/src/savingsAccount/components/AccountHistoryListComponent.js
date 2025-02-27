import React, { useEffect, useState } from "react";
import { getAccountHistoryList } from "../api/accountApi";
import CustomModal from "../../common/components/CustomModal";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import useCustomMove from "../../common/hooks/useCustomMove";
import PageComponent from "../../common/components/PageComponent";
import { useNavigate } from "react-router-dom";
import "../styles/AccountHistoryListComponent.scss"

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

const AccountHistoryListComponent = () => {
	const [historyList, setHistoryList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [serverData, setServerData] = useState(pageState);
	const [selectedHistory, setSelectedHistory] = useState(); // 선택된 항목 저장
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

	const navigate = useNavigate();
	const { page, size, refresh } = useCustomMove(); // useCustomMove 훅 사용

	useEffect(() => {
		const fetchHistoryList = async () => {
			setIsLoading(true);
			try {
				const data = await getAccountHistoryList({ page: page, size: size });
				setHistoryList(data.dtoList);
				setServerData(data);
			} catch (error) {
				setError("계좌 이력을 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchHistoryList();
	}, [page, size, refresh]);

	// 상세 조회 모달 열기
	const openModal = (history) => {
		if (!history) return;
		setSelectedHistory(history);
		setIsModalOpen(true);
	};

	// 상세 조회 모달 닫기
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedHistory();
	};

	// ✅ 페이지 이동 함수 (URL 유지하면서 `page`, `size`만 변경)
	const movePage = (newPage) => {
		navigate({
			search: `?page=${newPage.page}&size=${size}`,
		});
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div className="account-history-container">
			{historyList != null && historyList.length > 0 ? (
				<>
					<table className="account-history-table">
						<thead>
						<tr>
							<th>만기 포인트</th>
							<th>계좌 상태</th>
							<th>기간</th>
							<th>상세 보기</th>
						</tr>
						</thead>
						<tbody>
						{historyList.map((history) => (
							<tr key={history.historyId} className="clickable-row">
								<td>{history.previousMaturityPoints.toLocaleString()} P</td>
								<td>{getStatusText(history.previousStatus)}</td>
								<td>{history.previousStartDate} ~ {history.previousEndDate}</td>
								<td className="btn-history-detail-cell">
									<button className="btn-detail" onClick={() => openModal(history)}>보기</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</>
			) : (
				<p className="no-history">이전 계좌 이력이 없습니다.</p>
			)}

			{/* 페이지네이션 */}
			<PageComponent serverData={serverData} movePage={movePage} />

			{/* 상세 조회 모달 */}
			<CustomModal
				isOpen={isModalOpen}
				onClose={closeModal}
				title="계좌 이력 상세 조회"
				buttons={<button className="confirm-btn" onClick={closeModal}>닫기</button>}
			>
				{selectedHistory ? (
					<div className="modal-details">
						<p><strong>이자율:</strong> {selectedHistory.previousInterestRate.toFixed(2)}%</p>
						<p><strong>입금 횟수:</strong> {selectedHistory.previousDepositCount} 회</p>
						<p><strong>계좌 상태:</strong> {getStatusText(selectedHistory.previousStatus)}</p>
						<p><strong>만기 포인트:</strong> {selectedHistory.previousMaturityPoints.toLocaleString()} P</p>
						<p><strong>기간:</strong> {selectedHistory.previousStartDate} ~ {selectedHistory.previousEndDate}</p>
					</div>
				) : (
					<p>데이터를 불러오는 중입니다...</p>
				)}
			</CustomModal>
		</div>
	);
};

export default AccountHistoryListComponent;
