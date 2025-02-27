import jwtAxios from "../../common/util/jwtUtil";  // jwtAxios import
import { API_SERVER_HOST } from "../../common/login/api/loginApi";  // API 서버 주소

// 계좌 조회 API
export const getSavingsAccount = async () => {
	try {
		const res = await jwtAxios.get(`${API_SERVER_HOST}/api/savings/account`);
		return res.data;
	} catch (error) {
		console.error("계좌 조회 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 만기 처리 API
export const checkMaturityAndProcess = async () => {
	try {
		const res = await jwtAxios.post(`${API_SERVER_HOST}/api/savings/check-maturity`);
		return res.data;
	} catch (error) {
		console.error("만기 처리 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 입금 API
export const deposit = async (depositAmount) => {
	try {
		const res = await jwtAxios.post(
			`${API_SERVER_HOST}/api/savings/deposit`,
			depositAmount
		);
		return res.data;
	} catch (error) {
		console.error("입금 처리 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 입금 가능 여부 확인 API
export const checkDepositStatus = async () => {
	try {
		const res = await jwtAxios.get(`${API_SERVER_HOST}/api/savings/deposit/status`);
		return res.data;
	} catch (error) {
		console.error("입금 가능 여부 확인 중 오류 발생:", error);
		throw error;
	}
};

// 계좌 갱신 API
export const renewSavingsAccount = async (renewalPeriod) => {
	try {
		const res = await jwtAxios.post(`${API_SERVER_HOST}/api/savings/renew`, null, {
			params: { renewalPeriod }
		});
		return res.data;
	} catch (error) {
		console.error("계좌 갱신 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 중도 해지 API
export const cancelSavingsAccount = async () => {
	try {
		const res = await jwtAxios.post(`${API_SERVER_HOST}/api/savings/cancel`);
		return res.data;
	} catch (error) {
		console.error("계좌 중도 해지 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 모든 입금 내역 조회 API
export const getDepositHistory = async (pageParam) => {
	const { page, size } = pageParam;

	try {
		const res = await jwtAxios.get(`${API_SERVER_HOST}/api/deposits/history`, {
			params: { page: page, size: size },
		});
		return res.data;
	} catch (error) {
		console.error("입금 내역 조회 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 입금 내역 (startDate 부터) 조회 API
export const getCurrentDepositHistory = async (pageParam) => {
	const { page, size } = pageParam;
	try {
		const res = await jwtAxios.get(`${API_SERVER_HOST}/api/deposits/current-history`, {
			params: { page: page, size: size },
		});
		return res.data;
	} catch (error) {
		console.error("현재 입금 내역 조회 중 오류가 발생했습니다:", error);
		throw error;
	}
};

// 계좌 이력 목록 조회 API
export const getAccountHistoryList = async (pageParam) => {
	const { page, size } = pageParam;
	try {
		const res = await jwtAxios.get(`${API_SERVER_HOST}/api/account/history/list`, {
			params: { page: page, size: size },
		});
		return res.data;
	} catch (error) {
		console.error("계좌 이력 목록 조회 중 오류가 발생했습니다:", error);
		throw error;
	}
};
