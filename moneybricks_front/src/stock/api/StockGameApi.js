import jwtAxios from "../../common/util/jwtUtil";
import {API_SERVER_HOST} from "../../common/login/api/loginApi";
import axios from "axios";

// 게임 데이터 조회 API
export const getGameData = async () => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/stockGame`, {
    });
    return response.data;
  } catch (error) {
    console.error("게임 데이터 조회 중 오류 발생:", error);
    throw error;
  }
};

// 거래 실행 API
export const tradeStock = async (gameId, tradeRequest) => {
  try {
    console.log(tradeRequest);
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/stockGame/${gameId}/trade`, tradeRequest, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error("거래 요청 상세 에러:", error.response?.data);
    throw error;
  }
};

// 일일 보상 수령 API
export const claimDailyReward = async (gameId) => {
  try {
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/stockGame/${gameId}/reward`);
    return response.data;
  } catch (error) {
    console.error("일일 보상 수령 중 오류 발생:", error);
    throw error;
  }
};

// 주식 목록 조회 API
export const getAllStocks = async () => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/stocks`);
    return response.data;
  } catch (error) {
    console.error("주식 목록 조회 중 오류 발생:", error);
    throw error;
  }
};

// 다음 날로 진행 API
export const nextDay = async (gameId) => {
  try {
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/stockGame/${gameId}/nextDay`);
    console.log("API  응답", response.data);
    return response.data;
  } catch (error) {
    console.error("다음 날 진행 중 오류 발생:", error);
    throw error;
  }
};

export const saveGameNews = async (gameId, newsDTO) => {
  try {
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/news/${gameId}`, newsDTO);
    return response.data;
  } catch (error) {
    console.error("뉴스 저장 중 오류:", error);
    throw error;
  }
};

export const getNewsHistory = async (gameId) => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/news/${gameId}/history`);
    return response.data;
  } catch (error) {
    console.error("뉴스 히스토리 조회 중 오류:", error);
    throw error;
  }
};

// 주가 관련 API
export const saveDailyPrices = async (gameId, prices, changeRates, day) => {
  try {
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/stockPrices/${gameId}/${day}`, {
      prices: prices,
      changeRates: changeRates,
    });
    return response.data;
  } catch (error) {
    console.error("주가 저장 중 오류:", error);
    throw error;
  }
};

export const getStockPriceHistory = async (gameId, stockCode) => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/stockPrices/${gameId}/history/${stockCode}`);
    return response.data;
  } catch (error) {
    console.error("주가 히스토리 조회 중 오류:", error);
    throw error;
  }
};

// 랭킹 관련 API
export const getTopRankings = async (limit) => {
  try {
    console.log(limit);
    console.log("Fetching top rankings...");
    const response = await axios.get(`${API_SERVER_HOST}/api/rankings/top?limit=${limit}`);
    console.log("Top rankings response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Top rankings fetch error:", error);
    throw error;
  }
};

export const getMyRanking = async (username) => {
  try {
    console.log("Fetching ranking for user:", username);
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/rankings/my-ranking?username=${username}`);
    console.log("My ranking response:", response.data);
    return response.data;
  } catch (error) {
    console.error("My ranking fetch error:", error);
    throw error;
  }
};
