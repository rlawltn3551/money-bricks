import jwtAxios from "../../common/util/jwtUtil";
import { API_SERVER_HOST } from "../../common/login/api/loginApi";

const attendancePrefix = `${API_SERVER_HOST}/api/attendance`;

// 출석 체크
export const checkIn = async () => {
	try {
		const res = await jwtAxios.post(`${attendancePrefix}/check-in`);
		return res.data;
	} catch (error) {
		console.error("출석 체크 오류:", error.response?.data || error.message);
		throw error;
	}
};

// 출석 기록 조회
export const getMyAttendanceRecord = async () => {
	try {
		const res = await jwtAxios.get(`${attendancePrefix}/my-record`);
		return res.data;
	} catch (error) {
		console.error("출석 기록 조회 오류:", error.response?.data || error.message);
		throw error;
	}
};
