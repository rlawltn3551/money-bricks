import React, { useEffect, useState } from "react";
import useCustomLogin from "../../common/hooks/useCustomLogin";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import { getOrdersHistory } from "../api/ordersApi";
import CustomModal from "../../common/components/CustomModal";
import BarcodeComponent from "./BarcodeComponent";
import "../styles/MypageOrdersHistoryComponent.scss";

const initState = [];

const MypageOrdersHistoryComponent = () => {
	const { loginState } = useCustomLogin();
	const [orders, setOrders] = useState(initState);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const memberId = loginState.id;

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getOrdersHistory(memberId);
				setOrders(data);
			} catch (error) {
				console.error("결제 내역 불러오기 실패:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (isLoading) return <LoadingSpinner isLoading={true} />;

	return (
		<div className="order-history">
			{orders.length === 0 ? (
				<p className="empty">결제 내역이 없습니다.</p>
			) : (
				<table className="order-list-table">
					<thead>
					<tr>
						<th></th>
						<th>상품명</th>
						<th>브랜드</th>
						<th>가격</th>
						<th>수량</th>
						<th>구매 날짜</th>
					</tr>
					</thead>
					<tbody>
					{orders.map((order) => (
						<tr key={order.oid} className="order-item">
							{/* 이미지 클릭 시 모달 열기 */}
							<td>
								<img
									src={order.imageUrl}
									alt={order.productName}
									className="product-image"
									onClick={() => setSelectedOrder(order)}
									style={{ cursor: "pointer" }}
								/>
							</td>
							<td>{order.productName}</td>
							<td>{order.brand}</td>
							<td className="price">{order.price.toLocaleString()}P</td>
							<td>{order.quantity}개</td>
							<td>{new Date(order.createdAt).toLocaleDateString()}</td>
						</tr>
					))}
					</tbody>
				</table>
			)}

			{/* 모달 */}
			{selectedOrder && (
				<CustomModal
					isOpen={!!selectedOrder}
					onClose={() => setSelectedOrder(null)}
					title="주문 상세 정보"
					buttons={
						<button className="confirm-btn" onClick={() => setSelectedOrder(null)}>
							닫기
						</button>
					}
				>
					<div className="mypage-modal-order-detail">
						<img
							src={selectedOrder.imageUrl}
						/>
						<BarcodeComponent orderId={selectedOrder.oid} />
						<table className="order-detail-table">
							<tbody>
							<tr>
								<td><strong>{selectedOrder.productName}</strong></td>
							</tr>
							<tr>
								<td>{selectedOrder.brand}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</CustomModal>
			)}
		</div>
	);
};

export default MypageOrdersHistoryComponent;
