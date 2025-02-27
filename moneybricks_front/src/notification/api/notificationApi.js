import jwtAxios from "../../common/util/jwtUtil";
import { API_SERVER_HOST } from "../../common/login/api/loginApi";

const notificationPrefix = `${API_SERVER_HOST}/api/notifications`;

// 알림 목록 조회
export const getNotifications = async (startDate, endDate, isRead) => {
	try {
		// URL 파라미터 구성
		let params = new URLSearchParams();

		if (startDate) params.append('startDate', startDate);
		if (endDate) params.append('endDate', endDate);
		// isRead가 undefined나 null이 아닐 때만 파라미터 추가
		if (isRead !== undefined && isRead !== null) {
			params.append('isRead', isRead);
		}

		const res = await jwtAxios.get(`${notificationPrefix}?${params.toString()}`);
		return res.data;
	} catch (error) {
		console.error("알림 조회 오류:", error.response?.data || error.message);
		throw error;
	}
};
// 알림 상태 업데이트
export const updateNotificationStatus = async (id, readStatus) => {
	try {
		const res = await jwtAxios.put(`${notificationPrefix}/${id}/status`, {
			id,
			readStatus,
		});
		return res.data;
	} catch (error) {
		console.error("알림 상태 업데이트 오류:", error.response?.data || error.message);
		throw error;
	}
};

// 모든 알림 삭제
export const deleteAllNotifications = async () => {
	try {
		const res = await jwtAxios.delete(`${notificationPrefix}/all`);
		return res.data;
	} catch (error) {
		console.error("알림 삭제 오류:", error.response?.data || error.message);
		throw error;
	}
};

// 선택적 알림 삭제
export const deleteNotification = async (id) => {
	try {
		const res = await jwtAxios.delete(`${notificationPrefix}/${id}`);
		return res.data;
	} catch (error) {
		console.error("알림 삭제 오류:", error.response?.data || error.message);
		throw error;
	}
};

// 안 읽은 알림 개수 조회
export const getUnreadNotificationCount = async () => {
	try {
		const res = await jwtAxios.get(`${notificationPrefix}/unread-count`);
		return res.data;
	} catch (error) {
		console.error("안 읽은 알림 개수 조회 오류:", error.response?.data || error.message);
		throw error;
	}
};
