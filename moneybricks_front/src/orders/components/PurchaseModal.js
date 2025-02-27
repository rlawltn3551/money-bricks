import React, {useState} from 'react';
import {purchaseProduct} from "../api/ordersApi";
import "../styles/PurchaseModal.scss"

const PurchaseModal = ({mall, memberId, onClose}) => {
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handlePurchase = async () => {
        try {
            await purchaseProduct(memberId, mall.mallId, quantity);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                onClose(); // 모달 닫기
            }, 2000);
        } catch (error) {
            alert("결제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="purchase-modal-overlay">
            <div className="purchase-modal-content">
                <button className="close-button" onClick={onClose}>x</button>
                <h2>{mall.productName} 구매</h2>
                <p>가격: {mall.price} 포인트</p>

                <label>수량 선택:</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />

                <button className="confirm-button" onClick={handlePurchase} disabled={isProcessing}>
                    {isProcessing ? "결제 중..." : "결제하기"}
                </button>
            </div>

            {showSuccessPopup && (
                <div className="success-popup">결제가 완료되었습니다!</div>
            )}
        </div>
    );
};

export default PurchaseModal;