import axios from "axios";
import jwtAxios from "../../common/util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/qna/replies`;

export const getReplies = async (pageParam, qno) => {
	const { page, size } = pageParam;

	const res = await axios.get(`${host}/list/${qno}`, {
		params: { page: page, size: size },
		qno,
	});

	return res.data;
};

// 게시글 등록
export const registerReply = async (qrno) => {
	const res = await jwtAxios.post(`${host}/`, qrno);

	return res.data;
};