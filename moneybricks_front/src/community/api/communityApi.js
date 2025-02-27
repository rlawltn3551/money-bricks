import jwtAxios from "../../common/util/jwtUtil";
import axios from "axios";  // ✅ Use jwtAxios to include authentication headers

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/community`;


export const fetchPosts = async () => {
    const res = await axios.get(`${host}/posts`);
    return res.data;
};


export const fetchPost = async (id) => {
    const res = await axios.get(`${host}/posts/${id}`);
    return res.data;
};


export const createPost = async (postData) => {
    try {
        const res = await jwtAxios.post(`${host}/posts`, postData);
        return res.data;
    } catch (error) {
        console.error("🚨 [API] 게시물 등록 실패:", error.response?.data || error.message);
        throw error;
    }
};



export const updatePost = async (id, postData) => {
    try {
        const res = await jwtAxios.put(`${host}/posts/${id}`, postData);
        return res.data;
    } catch (error) {
        console.error("🚨 [API] 게시물 수정 실패:", error.response?.data || error.message);
        throw error;
    }
};


export const deletePost = async (id) => {
    try {
        const res = await jwtAxios.delete(`${host}/posts/${id}`);
        return res.data;
    } catch (error) {
        console.error("🚨 [API] 게시물 삭제 실패:", error.response?.data || error.message);
        throw error;
    }
};


export const fetchComments = async (pstId) => {
    try {
        const res = await axios.get(`${host}/comments/post/${pstId}`);
        console.log("📡 fetchComments 요청:", pstId);  // 요청값 로그
        return res.data;
    } catch (error) {
        console.error("🚨 [API] 댓글 목록 조회 실패:", error.response?.data || error.message);
        return [];
    }
};

//
export const addComment = async (commentData) => {
    try {
        const res = await jwtAxios.post(`${host}/comments`, commentData, {
            headers: { 'Content-Type': 'application/json' }
        });



        // ✅ Ensure response format is correct
        return Array.isArray(res.data?.comments) ? res.data.comments : [];
    } catch (error) {
        console.error("🚨 [API] 댓글 등록 실패:", error.response?.data || error.message);
        return [];
    }
};


export const updateComment = async (id, commentData) => {
    try {
        const res = await jwtAxios.put(`${host}/comments/${id}`, commentData);
        return res.data;
    } catch (error) {
        console.error("🚨 [API] 댓글 수정 실패:", error.response?.data || error.message);
        throw error;
    }
};


export const deleteComment = async (id) => {
    try {
        const res = await jwtAxios.delete(`${host}/comments/${id}`);
        return res.data;
    } catch (error) {

        throw error;
    }
};

