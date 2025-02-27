import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomMove from "../../common/hooks/useCustomMove";
import { getDepositHistory } from "../api/accountApi";
import moment from "moment/moment";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import PageComponent from "../../common/components/PageComponent";
import Calendar from "react-calendar";

// 초기 상태
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

const AllDepositHistoryListComponent = () => {
	const [depositHistoryList, setDepositHistoryList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [serverData, setServerData] = useState(pageState);
	const [viewMode, setViewMode] = useState("table"); // 'table' 또는 'calendar'
	const [depositsByDate, setDepositsByDate] = useState({});

	const navigate = useNavigate();
	const { page, size, refresh } = useCustomMove(); // useCustomMove 훅 사용

	useEffect(() => {
		const fetchDepositHistoryList = async () => {
			setIsLoading(true);
			try {
				const data = await getDepositHistory({ page, size });

				// 날짜에서 시간 부분 제거
				const formattedList = data.dtoList.map((deposit, index) => ({
					...deposit,
					depositDate: deposit.depositDate.split("T")[0], // YYYY-MM-DD 형식 유지
					order: index + 1, // 리스트 순서 추가 (1부터 시작)
				}));

				setDepositHistoryList(formattedList);
				setServerData(data);

				// 날짜별 입금 내역 정리
				const deposits = {};
				formattedList.forEach(deposit => {
					if (!deposits[deposit.depositDate]) {
						deposits[deposit.depositDate] = [];
					}
					deposits[deposit.depositDate].push(deposit);
				});
				setDepositsByDate(deposits);
			} catch (error) {
				setError("입금 내역을 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchDepositHistoryList();
	}, [page, size, refresh]);

	// ✅ 페이지 이동 함수 (URL 유지하면서 `page`, `size`만 변경)
	const movePage = (newPage) => {
		navigate({
			search: `?page=${newPage.page}&size=${size}`,
		});
	};

	// 캘린더 타일 콘텐츠 생성 함수
	const tileContent = ({ date, view }) => {
		if (view !== "month") return null;

		const dateStr = moment(date).format("YYYY-MM-DD");
		const depositsOnDate = depositsByDate[dateStr] || [];

		if (depositsOnDate.length === 0) return null;

		return (
			<div className="calendar-deposit-info">
				{depositsOnDate.map((deposit, index) => (
					<div key={index} className="deposit-amount">
						+{deposit.depositAmount.toLocaleString()} P
					</div>
				))}
			</div>
		);
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div>
			<h2 className="deposit-history-title">모든 입금 내역</h2>
			<div className="view-toggle">
				<button
					className={viewMode === "table" ? "active" : ""}
					onClick={() => setViewMode("table")}
					title="표로 보기"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
						  className="svg-icon icon_view_list">
						<path fill="currentColor" fillRule="evenodd"
								d="M21 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2M8 8h10a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2M21 13a1 1 0 1 1 0 2 1 1 0 0 1 0-2M8 13h10a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2M21 18a1 1 0 1 1 0 2 1 1 0 0 1 0-2M8 18h10a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2"
								clipRule="evenodd"></path>
					</svg>
				</button>
				<button
					className={viewMode === "calendar" ? "active" : ""}
					onClick={() => setViewMode("calendar")}
					title="달력으로 보기"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
						  className="svg-icon icon_calendar">
						<path fill="currentColor" fillRule="evenodd"
								d="M17 2h-1V1a1 1 0 1 0-2 0v1h-4V1a1 1 0 1 0-2 0v1H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2zM4 6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4zm1 2h14v12H5V8z"
								clipRule="evenodd"></path>
					</svg>
				</button>
				<button onClick={() => navigate("/mypage/deposit-history/current/list")}>
					현재 입금 내역 보기
				</button>
			</div>


			{depositHistoryList != null && depositHistoryList.length > 0 ? (
				viewMode === "table" ? (
					<>
						<table className="deposit-history-table">
							<thead>
							<tr>
								<th></th>
								<th>입금 포인트</th>
								<th>입금 날짜</th>
								<th>입금 후 적금 포인트</th>
							</tr>
							</thead>
							<tbody>
							{depositHistoryList.map((deposit) => (
								<tr key={deposit.id}>
									<td>{deposit.order}</td>
									<td>+ {deposit.depositAmount.toLocaleString()} P</td>
									<td>{deposit.depositDate}</td>
									<td>{deposit.balanceAfterDeposit.toLocaleString()} P</td>
								</tr>
							))}
							</tbody>
						</table>
						<p> * 모든 입금 내역은 이전 계좌의 입금 내역까지 모두 조회한 내역입니다.</p>

						{/* 페이지네이션 */}
						<PageComponent serverData={serverData} movePage={movePage} />
					</>
				) : (
					<div className="calendar-view">
						<Calendar
							calendarType="gregory"
							tileContent={tileContent}
							className="deposit-calendar"
						/>
						<p> * 모든 입금 내역은 이전 계좌의 입금 내역까지 모두 조회한 내역입니다.</p>
					</div>
				)
			) : (
				<p className="no-history">입금 내역이 없습니다.</p>
			)}
		</div>
	);
};

export default AllDepositHistoryListComponent;