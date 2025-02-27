import React, { useEffect, useState } from "react";
import useCustomLogin from "../hooks/useCustomLogin";
import useAdminOnly from "../hooks/useAdminOnly";
import { getMemberInfo } from "../../member/api/memberApi";
import LoadingSpinner from "./LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { getSavingsAccount } from "../../savingsAccount/api/accountApi";
import { getPointsInfo } from "../../point/api/pointApi";
import "../styles/NavUserComponent.scss";
import AttendanceCalendar from "../../attendance/component/AttendanceCalendar";
import CustomModal from "./CustomModal";
import dayjs from "dayjs";

const memberInitState = {
	nickname: "",
	username: "",
};

const accountInitState = {
	id: null,
	memberId: null,
	interestRate: 0,
	startDate: "",
	endDate: "",
	totalAmount: 0,
	status: "",
	depositCount: 0,
};

const pointInitState = {
	id: null,
	memberId: null,
	totalPoints: 0,
	availablePoints: 0,
	lockedFlag: false,
};

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

const NavUserComponent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [memberInfo, setMemberInfo] = useState(memberInitState);
	const [account, setAccount] = useState(accountInitState);
	const [pointsInfo, setPointsInfo] = useState(pointInitState);
	const [activeTab, setActiveTab] = useState("");
	const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
	const { isLogin } = useCustomLogin();
	const { isAdmin } = useAdminOnly();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLogin) {
			fetchData();
		}
	}, [isLogin]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [memberData, accountData, pointsData] = await Promise.all([
				getMemberInfo(),
				getSavingsAccount(),
				getPointsInfo(),
			]);
			setMemberInfo(memberData);
			setAccount(accountData);
			setPointsInfo(pointsData);
		} catch (error) {
			console.error("데이터 로드 실패:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getProgress = () => {
		if (account.startDate && account.endDate) {
			const start = dayjs(account.startDate);
			const end = dayjs(account.endDate).add(1, "day");
			const today = dayjs();

			const totalDays = end.diff(start, "day");
			const currentDay = today.diff(start, "day") + 1;

			return { totalDays, currentDay };
		}
		return { totalDays: 0, currentDay: 0 };
	};

	const { totalDays, currentDay } = getProgress();
	const depositProgress = Math.min(account.depositCount / totalDays, 1) * 100;

	if (isLoading) return <LoadingSpinner isLoading={true} />;

	const handleLoginClick = () => {
		navigate("/auth/login");
	};

	return (
		<div className="nav-user-component">
			{!isLogin ? (
				<div className="login-prompt">
					<p>금융의 첫 걸음,<br />MONEYBRICKS와 시작하세요</p>
					<button onClick={handleLoginClick} className="login-btn">로그인</button>
					<Link to="/signup-procedure">회원가입</Link>
				</div>
			) : (
				<div className="nav-user-info">
					<div className="nav-user-details-and-check-in">
						<div className="nav-user-details">
							<h2>{memberInfo.nickname}님, 안녕하세요!</h2>
							<p>{memberInfo.username}</p>
						</div>

						{/* ✅ 출석 캘린더 모달 열기 버튼 */}
						<div className="modal-check-in-btn-box">
							{!isAdmin && (
								<button className="modal-check-in-btn" onClick={() => setIsAttendanceModalOpen(true)}>
									출석 체크
								</button>
							)}
						</div>

						{/* ✅ 출석 캘린더 모달 */}
						<CustomModal
							isOpen={isAttendanceModalOpen}
							onClose={() => setIsAttendanceModalOpen(false)}
							title="출석 체크"
							buttons={
								<button className="cancel-btn" onClick={() => setIsAttendanceModalOpen(false)}>
									닫기
								</button>
							}
						>
							<AttendanceCalendar /> {/* ✅ 캘린더 표시 */}
						</CustomModal>
					</div>

					{!isAdmin && (
						<>
							<div className="tab-menu">
								<button
									className={activeTab === "savings" ? "active" : ""}
									onClick={() => setActiveTab(activeTab === "savings" ? "" : "savings")}
								>
									MY 포인트 적금
								</button>
								<button
									className={activeTab === "points" ? "active" : ""}
									onClick={() => setActiveTab(activeTab === "points" ? "" : "points")}
								>
									MY 포인트
								</button>
							</div>
						</>
					)}

					{activeTab === "savings" && account.id && (
						<div className="nav-account-info">
							<table>
								<tbody>
								<tr>
									<th>상태</th>
									<td>{getStatusText(account.status)}</td>
								</tr>
								<tr>
									<th>입금한 포인트</th>
									<td>{account.totalAmount.toLocaleString()} P</td>
								</tr>
								<tr>
									<th>이자율</th>
									<td>{account.interestRate.toFixed(2)} %P</td>
								</tr>
								{account.status === "ACTIVE" && (
									<>
										<tr>
											<th>진행일</th>
											<td>{currentDay}일 차 / {totalDays}일
												<div className="progress-bar">
													<div
														className="progress"
														style={{ width: `${(currentDay / totalDays) * 100}%` }}
													>
														<div className="nav-user-tooltip">
															{((currentDay / totalDays) * 100).toFixed(1)}%
														</div>
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th>입금횟수</th>
											<td>
												{account.depositCount}회 / {totalDays}회
												<div className="progress-bar">
													<div
														className="progress"
														style={{ width: `${depositProgress}%` }}
													>
														<div className="nav-user-tooltip">{depositProgress.toFixed(1)}%</div>
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th>입금 횟수 / 진행일</th>
											<td>
												{account.depositCount}회 / {currentDay}일 차
												<div className="progress-bar">
													<div
														className="progress"
														style={{ width: `${(account.depositCount / currentDay) * 100}%` }}
													>
														<div className="nav-user-tooltip">
															{((account.depositCount / currentDay) * 100).toFixed(1)}%
														</div>
													</div>
												</div>
											</td>
										</tr>
									</>
								)}

								</tbody>
							</table>

							<div className="account-links">
								<Link to="/mypage/account">상세조회</Link>
								<Link to="/mypage/deposit">입금하기</Link>
								<Link to="/mypage/deposit-history/current/list">입금내역</Link>
							</div>
						</div>
					)}

					{activeTab === "points" && (
						<div className="nav-points-info">
							<table>
								<tbody>
								<tr>
									<th>총 포인트</th>
									<td>{pointsInfo.totalPoints.toLocaleString()} P</td>
								</tr>
								<tr>
									<th>사용 가능 포인트</th>
									<td>{pointsInfo.availablePoints.toLocaleString()} P</td>
								</tr>
								<tr>
									<th>포인트샵</th>
									<td>{pointsInfo.lockedFlag ? "사용 불가능 🔒" : "사용 가능 ✅"}</td>
								</tr>
								</tbody>
							</table>
							<div className="point-links">
								<Link to="/mypage/point">상세조회</Link>
								<Link to="/mypage/point-history/list">이력조회</Link>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NavUserComponent;