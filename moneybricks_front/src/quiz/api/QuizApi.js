import jwtAxios from "../../common/util/jwtUtil";

// API 기본 설정
const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "http://localhost:8080";
const API_ENDPOINT = `${API_SERVER_HOST}/api/quiz`;

// 퀴즈 API 함수들
const quizApi = {
  /**
   * 퀴즈 목록 가져오기 (5문제 랜덤)
   * @returns {Promise} 퀴즈 목록
   */
  getQuizzes: async () => {
    try {
      const response = await jwtAxios.get(`${API_ENDPOINT}`);
      return response.data;
    } catch (error) {
      console.error("퀴즈 목록 조회 오류:", error);
      throw error;
    }
  },

  /**
   * 오늘 퀴즈 시도 가능 여부 확인
   * @returns {Promise} 시도 가능 여부 (canAttempt: boolean)
   */
  checkAttempt: async () => {
    try {
      const response = await jwtAxios.get(`${API_ENDPOINT}/check-attempt`);
      return response.data;
    } catch (error) {
      console.error("퀴즈 시도 가능 여부 확인 오류:", error);
      throw error;
    }
  },

  /**
   * 퀴즈 결과 제출
   * @param {Object} quizResults 퀴즈 결과 데이터
   * @returns {Promise} 제출 결과 및 획득 포인트
   */
  submitQuizResult: async (quizResults) => {
    try {
      const response = await jwtAxios.post(`${API_ENDPOINT}/submit`, quizResults);
      return response.data;
    } catch (error) {
      console.error("퀴즈 결과 제출 오류:", error);
      throw error;
    }
  },

  /**
   * 퀴즈 이력 조회
   * @param {number} page 페이지 번호 (0부터 시작)
   * @param {number} size 페이지 크기
   * @returns {Promise} 퀴즈 이력 목록 (페이징)
   */
  getQuizHistory: async (page = 0, size = 10) => {
    try {
      const response = await jwtAxios.get(`${API_ENDPOINT}/history`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("퀴즈 이력 조회 오류:", error);
      throw error;
    }
  },

  /**
   * 특정 퀴즈 시도 상세 정보 조회
   * @param {number} attemptId 시도 ID
   * @returns {Promise} 퀴즈 시도 상세 정보
   */
  getQuizAttemptDetail: async (attemptId) => {
    try {
      const response = await jwtAxios.get(`${API_ENDPOINT}/history/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error("퀴즈 시도 상세 정보 조회 오류:", error);
      throw error;
    }
  },
};

export default quizApi;
