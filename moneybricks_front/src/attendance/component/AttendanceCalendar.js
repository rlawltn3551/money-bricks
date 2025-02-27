import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/AttendanceCalendar.scss";
import { checkIn, getMyAttendanceRecord } from "../api/attendanceApi";

const AttendanceCalendar = () => {
	const [attendanceRecords, setAttendanceRecords] = useState([]); // 출석 기록
	const [dateValue, setDateValue] = useState(new Date()); // 현재 선택된 날짜
	const [bonusDays, setBonusDays] = useState(new Map()); // 보너스 포인트 받은 날짜

	useEffect(() => {
		const loadAttendanceRecords = async () => {
			try {
				const records = await getMyAttendanceRecord();
				setAttendanceRecords(records);

				// 보너스 받은 날짜 계산
				setBonusDays(new Map(calculateBonusDays(records)));
			} catch (error) {
				console.error("출석 기록 불러오기 오류:", error);
			}
		};

		loadAttendanceRecords();
	}, []);

	// 출석 체크
	const handleCheckIn = async () => {
		const today = new Date().toDateString();
		if (attendanceRecords.some(record => new Date(record.checkInDate).toDateString() === today)) {
			alert("이미 출석했습니다!");
			return;
		}

		try {
			await checkIn();
			alert("출석 완료!");

			// 출석 데이터 추가
			const newRecord = { checkInDate: new Date(), checkedIn: true };
			const updatedRecords = [...attendanceRecords, newRecord];
			setAttendanceRecords(updatedRecords);

			// 보너스 받은 날짜 다시 계산
			setBonusDays(new Map(calculateBonusDays(updatedRecords)));
		} catch (error) {
			console.error("출석 체크 오류:", error);
			alert("출석 체크에 실패했습니다.");
		}
	};

	// 출석한 날짜인지 확인
	const isCheckedIn = date => {
		return attendanceRecords.some(
			record => new Date(record.checkInDate).toDateString() === date.toDateString()
		);
	};

	// 보너스를 받은 날짜인지 확인
	const getBonusPoints = date => {
		return bonusDays.get(date.toDateString()) || 0;
	};

	// 보너스 포인트를 받은 날짜 리스트 계산
	const calculateBonusDays = records => {
		const checkedInDates = records
			.filter(record => record.checkInDate)
			.map(record => new Date(record.checkInDate).toDateString());

		const totalAttendanceDays = checkedInDates.length;
		const bonusPoints = [5, 10, 15, 20, 25, 30];
		const bonusMap = new Map();

		bonusPoints.forEach(day => {
			if (day <= totalAttendanceDays) {
				bonusMap.set(checkedInDates[day - 1], day * 10); // 5일: 50포인트, 10일: 100포인트 등
			}
		});

		return bonusMap;
	};

	// 총 출석일 수 계산
	console.log(attendanceRecords)
	const totalAttendanceDays = attendanceRecords.filter(record => record.checkInDate).length;

	return (
		<div className="attendance-calendar">
			<p>총 출석일 수: <strong>{totalAttendanceDays}일</strong></p>

			<Calendar
				calendarType="gregory"
				onChange={setDateValue}
				value={dateValue}
				className="react-calendar"
				tileClassName={({ date }) => (isCheckedIn(date) ? "checked-in" : "")} // 출석한 날 스타일 적용
				tileContent={({ date }) => {
					const bonus = getBonusPoints(date);
					if (isCheckedIn(date) || bonus > 0) {
						return (
							<div className="point-badge">
								{isCheckedIn(date) && "+10P"}
								{bonus > 0 && ` +${bonus}P`}
							</div>
						);
					}
					return null;
				}}
			/>
			<p className="attendance-info">
				- 출석 체크는 하루에 한 번만 가능<br />
				- 출석 완료 시 <strong>10P</strong> 지급<br />
				- 보너스 출석 포인트 별도 지급<br />
				&emsp; - 5일 출석: <strong>+ 50P</strong><br />
				&emsp;- 10일 출석: <strong>+ 100P</strong><br />
				&emsp;- 15일 출석: <strong>+ 150P</strong><br />
				&emsp;- 20일 출석: <strong>+ 200P</strong><br />
				&emsp;- 25일 출석: <strong>+ 250P</strong><br />
				&emsp;- 30일 출석: <strong>+ 300P</strong><br />
			</p>
			<button className="check-in-button" onClick={handleCheckIn}>
				출석 체크하기
			</button>
		</div>
	);
};

export default AttendanceCalendar;