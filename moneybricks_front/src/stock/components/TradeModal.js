import React, { useState, useEffect } from "react";
import { getGameData, tradeStock } from "../api/StockGameApi";
import "../scss/TradeModal.scss";

const TradeModal = ({ isOpen, onClose, stocks, gameId, onTradeSuccess, gameData, selectedStock }) => {
  // 현재 선택된 주식 상태
  const [currentStock, setCurrentStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(true);
  const [error, setError] = useState(null);

  // 모달이 열릴 때 선택된 주식 초기화
  useEffect(() => {
    if (isOpen) {
      // 부모 컴포넌트에서 전달된 selectedStock이 있으면 해당 주식으로 설정
      if (selectedStock) {
        setCurrentStock(selectedStock);
      } else if (stocks.length > 0) {
        // 선택된 주식 없으면 첫 번째 주식으로 설정
        setCurrentStock(stocks[0]);
      }

      // 수량 초기화
      setQuantity(1);
      // 구매 모드로 초기화
      setIsBuying(true);
      // 에러 초기화
      setError(null);
    }
  }, [isOpen, selectedStock, stocks]);

  // 현재 보유 현금 계산 함수
  const calculateAvailableCash = () => {
    return 5000000 - (gameData?.holdings || []).reduce((sum, holding) => sum + holding.averagePrice * holding.quantity, 0);
  };

  // 매수 가능 여부 체크 함수
  const checkCanBuy = () => {
    if (!currentStock || !isBuying) return true;

    const totalCost = currentStock.price * quantity;
    const availableCash = calculateAvailableCash();
    return totalCost <= availableCash;
  };

  // 매도 가능 여부 체크 함수
  const checkCanSell = () => {
    if (!currentStock || isBuying) return true;

    const holdingStock = gameData.holdings?.find((holding) => holding.stockCode === currentStock.code);

    return holdingStock && holdingStock.quantity >= quantity;
  };

  // 거래 제출 핸들러
  const handleTradeSubmit = async () => {
    // 주식 선택 검증
    if (!currentStock) {
      setError("주식을 선택해주세요.");
      return;
    }

    // 매수 시 현금 체크
    if (isBuying) {
      const totalCost = currentStock.price * quantity;
      const availableCash = calculateAvailableCash();

      if (totalCost > availableCash) {
        setError(`거래 불가: 잔고(${availableCash.toLocaleString()}원)가 부족합니다.`);
        return;
      }
    }

    // 매도 시 보유 수량 체크
    if (!isBuying) {
      const holdingStock = gameData.holdings?.find((holding) => holding.stockCode === currentStock.code);

      if (!holdingStock || holdingStock.quantity < quantity) {
        setError("보유 수량보다 많은 주식을 매도할 수 없습니다.");
        return;
      }
    }

    try {
      // 거래 API 호출
      await tradeStock(gameId, {
        stockCode: currentStock.code,
        quantity: quantity,
        isBuy: isBuying,
      });

      // 거래 성공 후 콜백
      onTradeSuccess();
      onClose();
      setError(null);
    } catch (err) {
      // 에러 처리
      setError(err.response?.data || "거래 중 오류가 발생했습니다.");
    }
  };

  // 모달이 닫혀있으면 렌더링 하지 않음
  if (!isOpen) return null;

  return (
    <div className="trade-modal-overlay">
      <div className="trade-modal-content">
        <h2>{isBuying ? "매수" : "매도"} 주문</h2>

        {/* 매수/매도 토글 */}
        <div className="trade-type-switch">
          <button className={isBuying ? "active" : ""} onClick={() => setIsBuying(true)}>
            매수
          </button>
          <button className={!isBuying ? "active" : ""} onClick={() => setIsBuying(false)}>
            매도
          </button>
        </div>

        {/* 종목 선택 드롭다운 */}
        <div className="stock-select">
          <label>종목 선택</label>
          <select
            value={currentStock?.code || ""}
            onChange={(e) => {
              const stock = stocks.find((s) => s.code === e.target.value);
              setCurrentStock(stock);
            }}>
            {stocks.map((stock) => (
              <option key={stock.code} value={stock.code}>
                {stock.name} - {stock.price.toLocaleString()}원
              </option>
            ))}
          </select>
        </div>

        {/* 수량 입력 */}
        <div className="quantity-input">
          <label>수량</label>
          <div className="quantity-controls">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* 거래 요약 */}
        {currentStock && (
          <div className="trade-summary">
            <p>총 거래 금액: {(currentStock.price * quantity).toLocaleString()}원</p>
            {isBuying && (
              <>
                <p>현재 보유 현금: {calculateAvailableCash().toLocaleString()}원</p>
                {!checkCanBuy() && <p className="error-message">거래 불가: 거래 금액이 보유 현금을 초과합니다.</p>}
              </>
            )}
            {!isBuying && <p>보유 수량: {gameData.holdings?.find((h) => h.stockCode === currentStock.code)?.quantity || 0}주</p>}
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 액션 버튼 */}
        <div className="trade-modal-actions">
          <button className="submit-button" onClick={handleTradeSubmit} disabled={(isBuying && !checkCanBuy()) || (!isBuying && !checkCanSell())}>
            {isBuying ? "매수" : "매도"} 주문
          </button>
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
