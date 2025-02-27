
import jwtAxios from "../../common/util/jwtUtil";
import { API_SERVER_HOST } from "../../common/login/api/loginApi";

const adminMemberPrefix = `${API_SERVER_HOST}/api/admin/members`;

export const getAdminMembers = async () => {
	const res = await jwtAxios.get(adminMemberPrefix);
	return res.data;
};

// 회원 삭제
export const deleteAdminMember = async (id) => {
	try {
		const res = await jwtAxios.delete(`${adminMemberPrefix}/${id}`);
		return res.data;
	} catch (error) {
		console.error("회원 삭제 오류:", error.response?.data || error.message);
		throw error;
	}
};

// 회원 검색
export const searchAdminMembers = async (keyword) => {
	const res = await jwtAxios.get(`${adminMemberPrefix}/search`, {
		params: { keyword },
	});
	return res.data;
};

// 이메일 발송
export const sendEmail = async (emailRequestDTO) => {
	const res = await jwtAxios.post(
		`${adminMemberPrefix}/send-email`,
		emailRequestDTO, // 요청 본문
	);
	return res.data;
};
