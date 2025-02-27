import React, { useEffect, useState } from "react";
import { getPointsInfo } from "../api/pointApi";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import "../styles/PointInfoComponent.scss"

const initState = {
	id: null,
	memberId: null,
	totalPoints: 0,
	availablePoints: 0,
	savingsUsedPoints: 0,
	lockedFlag: false,
};

const PointInfoComponent = () => {
	const [pointsInfo, setPointsInfo] = useState(initState);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchPointsInfo = async () => {
			try {
				const data = await getPointsInfo();
				setPointsInfo(data);
			} catch (error) {
				setError("포인트 정보를 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPointsInfo();
	}, []);

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div>
			{pointsInfo ? (
				<table className="points-table">
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
						<th>적금에 사용된 포인트</th>
						<td>{pointsInfo.savingsUsedPoints.toLocaleString()} P</td>
					</tr>
					<tr>
						<th>포인트샵</th>
						<td>{pointsInfo.lockedFlag ? "사용 불가능 🔒" : "사용 가능 ✅"}</td>
					</tr>
					</tbody>
				</table>
			) : (
				<p>포인트 정보가 없습니다.</p>
			)}
		</div>
	);
};

export default PointInfoComponent;
