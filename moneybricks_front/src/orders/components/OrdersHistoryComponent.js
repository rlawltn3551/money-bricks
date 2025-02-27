import React, {useEffect, useState} from 'react';
import useCustomLogin from "../../common/hooks/useCustomLogin";
import {getOrdersHistory} from "../api/ordersApi";
import "../styles/OrdersHistoryComponent.scss"
import {useSelector} from "react-redux";

const OrdersHistoryComponent = ({onClose}) => {
    const { loginState } = useCustomLogin();
    const [ordersHistory, setOrdersHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const memberId = useSelector(state => state.loginSlice.id)

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!memberId) {
                console.log("memberId 없음, API 요청을 수행하지 않음.");
                return;
            }

            try {
                console.log(`구매 내역 조회 요청: memberId=${memberId}`);
                const data = await getOrdersHistory(memberId);
                console.log("구매 내역 데이터:", data);
                setOrdersHistory(data);
            } catch (error) {
                console.log("구매 내역을 불러오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [memberId]);

    return (
        <div className="order-history-popup">
            <div className="popup-header">
                <h4>구매 내역</h4>
                <button className="history-close-button" onClick={onClose}>✖</button>
            </div>
            <div className="popup-content">
                {loading ? (
                    <p>로딩 중...</p>
                ) : ordersHistory.length === 0 ? (
                    <p>구매 내역이 없습니다.</p>
                ) : (
                    <ul>
                        {ordersHistory.map((order) => (
                            <li key={order.oid}>
                                <p><strong>{order.productName}</strong></p>
                                <p>가격: {order.price.toLocaleString()} P</p>
                                <p>수량: {order.quantity}개</p>
                                <p>구매 날짜: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrdersHistoryComponent;