import jwtAxios from "../../common/util/jwtUtil";
import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080";

// 특정 댓글의 대댓글 목록 조회
export const getRepliesByComment = async (commentId) => {
try {
    console.log(`📡 [API 호출] 대댓글 가져오기 - commentId=${commentId}`);
    const response = await axios.get(`${API_SERVER_HOST}/api/replies/comment/${commentId}`);

    console.log(" [API 응답] 데이터:", response.data);
    return response.data;
} catch (error) {
    console.error(" [API 호출 오류]:", error);
    return [];  // 실패 시 빈 배열 반환
}
};


//  특정 댓글의 대댓글 개수 조회
//
export const countRepliesByComment = async (commentId) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/replies/comment/${commentId}/count`);
        return response.data;  // ✅ API 응답 데이터만 반환
    } catch (error) {
        console.error(" [API ERROR] 대댓글 개수 조회 실패:", error);
        return 0;
    }
};


//  대댓글 등록
export const createReply = async (replyData) => {
    try {
        return await jwtAxios.post(`${API_SERVER_HOST}/api/replies`, replyData);
    } catch (error) {
        console.error("🚨 [API ERROR] 대댓글 등록 실패:", error);
        throw error;
    }
};


//  대댓글 수정
export const updateReply = async (replyId, replyContent) => {
    try {
        return await jwtAxios.put(`${API_SERVER_HOST}/api/replies/${replyId}`, {replyContent});
    } catch (error) {
        console.error("🚨 [API ERROR] 대댓글 수정 실패:", error);
        throw error;
    }
};


//  대댓글 삭제
export const deleteReply = async (replyId) => {
    try {
        return await jwtAxios.delete(`${API_SERVER_HOST}/api/replies/${replyId}`);
    } catch (error) {
        console.error("🚨 [API ERROR] 대댓글 삭제 실패:", error);
        throw error;
    }
};


