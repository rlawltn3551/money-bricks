import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trophy, Star, ArrowUpRight, X, Info } from "lucide-react";
import "../scss/StockGame.scss";

const GameResultModal = ({ isOpen, onClose, gameEndData }) => {
  const INITIAL_BALANCE = 5000000;

  console.log("게임 종료 데이터:", gameEndData);

  const calculateTotalReturn = () => {
    // 백엔드에서 계산된 수익률 직접 사용
    return gameEndData?.totalReturn || 0;
  };

  const getReturnClass = (returnValue) => {
    if (returnValue > 0) return "positive";
    if (returnValue < 0) return "negative";
    return "neutral";
  };

  const totalReturn = calculateTotalReturn();
  console.log(gameEndData);
  const pointsAwarded = gameEndData?.pointAwarded || false;
  const earnedPoints = gameEndData?.earnedPoints || 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="game-end-modal-overlay" />
        <Dialog.Content className="game-end-modal-content">
          <div className="game-end-modal-header">
            <Dialog.Title className="game-end-modal-title">
              <Trophy className="trophy-icon" />
              게임 종료
            </Dialog.Title>
            <Dialog.Close className="modal-close-button">
              <X className="close-icon" />
            </Dialog.Close>
          </div>

          <div className="game-end-modal-body">
            {/* 최종 수익률 */}
            <div className="game-end-result-card">
              <div className="result-card-header">
                <ArrowUpRight />
                <span>최종 수익률</span>
              </div>
              <span className={`result-value ${getReturnClass(totalReturn)}`}>
                {totalReturn > 0 ? "+" : ""}
                {totalReturn.toFixed(2)}%
              </span>
            </div>

            {/* 획득 포인트 */}
            <div className="game-end-result-card">
              <div className="result-card-header">
                <Star />
                <span>포인트 변화</span>
              </div>
              {pointsAwarded === false ? (
                <div className="points-already-awarded">
                  <Info size={18} />
                  <span>포인트를 이미 수령했습니다</span>
                </div>
              ) : (
                <span className="result-points">{earnedPoints.toLocaleString()} P</span>
              )}
            </div>
          </div>

          <div className="game-end-modal-footer">
            <button onClick={onClose} className="game-end-confirm-button">
              확인
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GameResultModal;
