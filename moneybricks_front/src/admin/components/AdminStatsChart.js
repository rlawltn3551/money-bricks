import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/AdminStatsChart.scss";

const AdminStatsChart = ({ members }) => {
	const [ageData, setAgeData] = useState([]);
	const [genderData, setGenderData] = useState([]);
	const [withdrawalData, setWithdrawalData] = useState([]);
	const [emailAgreementData, setEmailAgreementData] = useState([]);
	const [totalMembers, setTotalMembers] = useState(0);  // 총 회원 수 상태 추가

	// 색상 팔레트
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

	useEffect(() => {
		if (members && members.length > 0) {
			// 필터링: USER 역할을 가진 멤버들만 처리
			const userMembers = members.filter(member => member.roles.includes("USER") && !member.roles.includes("ADMIN"));

			// 연령대 데이터 처리
			processAgeData(userMembers);

			// 성별 데이터 처리
			processGenderData(userMembers);

			// 탈퇴율 데이터 처리
			processWithdrawalData(userMembers);

			// 이메일 수신 동의 데이터 처리
			processEmailAgreementData(userMembers);

			// 총 회원 수 업데이트
			setTotalMembers(userMembers.length);
		}
	}, [members]);

	// 이메일 수신 동의 데이터 처리
	const processEmailAgreementData = (userMembers) => {
		const agreedCount = userMembers.filter(member => member.emailAgreed).length;
		const notAgreedCount = userMembers.length - agreedCount;

		setEmailAgreementData([
			{ name: '수신 동의', value: agreedCount },
			{ name: '수신 거부', value: notAgreedCount }
		]);
	};

	// 주민등록번호로부터 연령대 계산
	const processAgeData = (userMembers) => {
		const ageGroups = {
			"10대 이하": 0,
			"20대": 0,
			"30대": 0,
			"40대": 0,
			"50대": 0,
			"60대 이상": 0
		};

		const currentYear = new Date().getFullYear();

		userMembers.forEach(member => {
			if (!member.ssn) return;

			// 주민번호 앞 7자리에서 생년 추출 (예: 9101231)
			const birthYear = parseInt(member.ssn.substring(0, 2));
			const century = member.ssn.charAt(6) === '1' || member.ssn.charAt(6) === '2' ? 1900 : 2000;
			const fullBirthYear = century + birthYear;

			// 나이 계산
			const age = currentYear - fullBirthYear;

			// 연령대 그룹화
			if (age < 20) ageGroups["10대 이하"]++;
			else if (age < 30) ageGroups["20대"]++;
			else if (age < 40) ageGroups["30대"]++;
			else if (age < 50) ageGroups["40대"]++;
			else if (age < 60) ageGroups["50대"]++;
			else ageGroups["60대 이상"]++;
		});

		// 차트 데이터로 변환
		const chartData = Object.entries(ageGroups).map(([name, value]) => ({
			name,
			value
		})).filter(item => item.value > 0); // 0인 항목 제거

		setAgeData(chartData);
	};

	// 주민등록번호로부터 성별 계산
	const processGenderData = (userMembers) => {
		let maleCount = 0;
		let femaleCount = 0;

		userMembers.forEach(member => {
			if (!member.ssn || member.ssn.length < 7) return;

			// 주민번호 7번째 자리로 성별 구분
			const genderDigit = member.ssn.charAt(6);
			if (genderDigit === '1' || genderDigit === '3') {
				maleCount++;
			} else if (genderDigit === '2' || genderDigit === '4') {
				femaleCount++;
			}
		});

		setGenderData([
			{ name: '남성', value: maleCount },
			{ name: '여성', value: femaleCount }
		]);
	};

	// 탈퇴율 계산
	const processWithdrawalData = (userMembers) => {
		const activeCount = userMembers.filter(member => !member.deleted).length;
		const deletedCount = userMembers.filter(member => member.deleted).length;

		setWithdrawalData([
			{ name: '활성 회원', value: activeCount },
			{ name: '탈퇴 회원', value: deletedCount }
		]);
	};

	// 커스텀 툴팁
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<p className="label">{`${payload[0].name}: ${payload[0].value}명`}</p>
					<p className="percent">{`(${(payload[0].value / members.length * 100).toFixed(1)}%)`}</p>
				</div>
			);
		}
		return null;
	};

	// 데이터가 없는 경우 처리
	const renderEmptyData = () => (
		<div className="empty-data-message">
			<p>데이터가 충분하지 않습니다. 회원 정보를 확인해주세요.</p>
		</div>
	);

	return (
		<div className="admin-charts-container">
			<h2>회원 통계 데이터</h2>

			<div className="total-members">
				<h3>총 회원 수</h3>
				<h3>{totalMembers} 명</h3>
			</div>

			<div className="charts-grid">
				{/* 연령대 분포 차트 */}
				<div className="chart-box">
					<h4>연령대 분포</h4>
					{ageData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={ageData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
								>
									{ageData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend layout="vertical" align="center" verticalAlign="top" />
							</PieChart>
						</ResponsiveContainer>
					) : renderEmptyData()}
				</div>

				{/* 성별 분포 차트 */}
				<div className="chart-box">
					<h4>성별 분포</h4>
					{genderData.length > 0 && genderData.some(item => item.value > 0) ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={genderData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
								>
									<Cell fill={COLORS[0]} /> {/* #0088FE */}
									<Cell fill={COLORS[3]} /> {/* #FF8042 */}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend layout="vertical" align="center" verticalAlign="top" />
							</PieChart>
						</ResponsiveContainer>
					) : renderEmptyData()}
				</div>

				{/* 탈퇴율 차트 */}
				<div className="chart-box">
					<h4>회원 탈퇴율</h4>
					{withdrawalData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={withdrawalData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
								>
									<Cell fill={COLORS[1]} />
									<Cell fill={COLORS[4]} />
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend layout="vertical" align="center" verticalAlign="top" />
							</PieChart>
						</ResponsiveContainer>
					) : renderEmptyData()}
				</div>

				{/* 이메일 수신 동의 차트 */}
				<div className="chart-box">
					<h4>이메일 수신 동의 현황</h4>
					{emailAgreementData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={emailAgreementData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
								>
									<Cell fill={COLORS[3]} />
									<Cell fill={COLORS[4]} />
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend layout="vertical" align="center" verticalAlign="top" />
							</PieChart>
						</ResponsiveContainer>
					) : renderEmptyData()}
				</div>
			</div>
		</div>
	);
};

export default AdminStatsChart;