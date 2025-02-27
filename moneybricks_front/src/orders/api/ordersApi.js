import jwtAxios from "../../common/util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/orders`;

// 결제
export const purchaseProduct = async (memberId, mallId, quantity) => {

    const res = await jwtAxios.post(`${host}/purchase`, null,{
        params: {memberId, mallId, quantity}
    },);
    return res.data;
};

// 내역 조회
export const getOrdersHistory = async (memberId) => {
    const res = await jwtAxios.get(`${host}/history`, {
        params: {memberId}
    });
    console.log("구매 내역 응답 데이터:", res.data)
    return res.data;
};