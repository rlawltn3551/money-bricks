import React, {useState} from 'react';
import "../style/MallDetailComponent.scss"
import {useSelector} from "react-redux";
import {purchaseProduct} from "../../orders/api/ordersApi";
import {useNavigate} from "react-router-dom";

const MallDetailComponent = ({mall}) => {
    const {
        mallId,
        brand,
        imageUrl,
        price,
        productName
    } = mall;

    const [quantity, setQuantity] = useState(1); // 기본 수량 1로 설정
    const [totalPrice, setTotalPrice] = useState(price);
    const memberId = useSelector(state=> state.loginSlice.id);
    const navigate = useNavigate();

    // 총 가격 계산
    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, e.target.value); // 최소 수량 1
        setQuantity(newQuantity);
        setTotalPrice(newQuantity * price);
    };

    // 구매 함수
    const handlePurchase = async () => {
        const isConfirmed = window.confirm("정말 구매하시겠습니까?");
        if (!isConfirmed) return;

        try {
            await purchaseProduct(memberId, mallId, quantity);
            alert("구매가 완료되었습니다!");
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            alert("결제 중 오류가 발생했습니다.");
        }
    };

    if (!mall) {
        return <div>로딩 중...</div>
    }

    return (
        <div className="mall-detail-container">
            <div className="image-container">
                <img src={imageUrl} alt={productName} className="mall-image" />
            </div>

            <div className="detail-box">
                <div className="mall-header">
                    <h1>{productName}</h1>
                </div>
                <div className="price-info">
                    <p className="price">
                        가격 : {price.toLocaleString()} P
                    </p>
                    <label htmlFor="quantity">수량 : </label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                    &nbsp; 개
                    <div className="total-price">
                        <p>총 가격: {totalPrice.toLocaleString()} P</p>
                    </div>
                </div>
                <div className="action-buttons">
                    <button className="buy-now" onClick={handlePurchase}>
                        구매하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MallDetailComponent;