import React, { useState } from "react";
import { CircleDollarSign, HelpCircle, Scroll, ChevronDown, ChevronUp } from "lucide-react";
import { IoWarning } from "react-icons/io5"; // 경고 아이콘 import
import "../scss/GameStatus.scss";

const GameStatus = ({ gameData }) => {
  // 초기 자금 상수
  const INITIAL_BALANCE = 5000000;
  const [isGameMethodOpen, setIsGameMethodOpen] = useState(false);

  const gameMethodSteps = [
    {
      title: "투자 전략 및 관리",
      content: " 각 종목의 특성과 산업 트렌드를 주의깊게 관찰하며, 주식 시장의 동향과 뉴스를 분석해서 현명한 투자 결정을 내리세요.",
      content2: "다양한 종목에 투자하여 리스크를 분산시키세요. 한 종목에 모든 자금을 투자하는 것은 위험할 수 있습니다.",
    },

    {
      title: "일일 뉴스 활용",
      content: "매일 제공되는 뉴스를 참고하여 주식 시장의 변화를 예측하고 투자 전략을 조정하세요.",
    },
    {
      title: "수익률 관리",
      content: "총 20일 동안 초기 자본 대비 최대의 수익을 창출하는 것이 게임의 목표입니다.",
    },
    {
      title: "포인트 안내",
      content: (
         <>
           플러스 수익: 5% 기준으로 <strong>300P가 지급</strong>됩니다.<br />
           마이너스 수익: 5% 기준으로 <strong>300P가 차감</strong>됩니다.<br />
           단, 첫 게임만 포인트 변화가 적용되며, 하루에 한 번만 반영됩니다. 이후 당일의 게임은 포인트 지급/차감이 이루어지지 않습니다.
         </>
      )
    },
    {
      title: "주의사항",
      content: "이 게임의 주식 수익률은 실제 주식 시장과 다를 수 있으며, 실제 투자와는 다른 시뮬레이션입니다.",
      content2: "20일까지 완료해야 게임 종료가 정상적으로 되며, 랭킹을 등록할 수 있습니다. ",
      icon: <IoWarning className="warning-icon" />, // 아이콘 추가
    },
  ];

  // 보유 주식의 매수 금액 총액 계산
  const calculateInvestedAmount = () => {
    return (gameData.holdings || []).reduce((sum, holding) => {
      return sum + holding.averagePrice * holding.quantity;
    }, 0);
  };

  // 보유 주식의 현재 가치 계산
  const calculateStockValue = () => {
    return (gameData.holdings || []).reduce((sum, holding) => {
      return sum + holding.currentPrice * holding.quantity;
    }, 0);
  };

  // 실제 보유 현금 계산 (초기 자금 - 투자 금액)
  const calculateAvailableCash = () => {
    return INITIAL_BALANCE - calculateInvestedAmount();
  };

  // 수익률 계산
  const calculateTotalReturn = () => {
    const stockValue = calculateStockValue();
    const returnRate = ((stockValue + calculateAvailableCash() - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;
    return returnRate;
  };

  return (
    <div className="card game-status-card">
      <div className="card__header game-method-section">
        <div className="game-method-header" onClick={() => setIsGameMethodOpen(!isGameMethodOpen)}>
          <h2>
            <Scroll />
            게임 방법
          </h2>
          {isGameMethodOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {isGameMethodOpen && (
        <div className="game-method-content">
          {gameMethodSteps.map((step, index) => (
            <div key={index} className="game-method-step">
              <div className="game-method-step-header">
                {step.icon && <span className="step-icon">{step.icon}</span>}
                <h3>{step.title}</h3>
              </div>
              <p>{step.content}</p>
              <p>{step.content2}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card__content">
        <div className="section-title">
          <CircleDollarSign />
          게임 현황
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-item__label">
              보유 현금
              <div className="tooltip-container">
                <HelpCircle className="help-icon" />
                <div className="tooltip">초기 자금에서 매수 금액을 제외한 실제 사용 가능한 현금</div>
              </div>
            </div>
            <div className="stat-item__value">{calculateAvailableCash().toLocaleString()}원</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__label">
              총 자산
              <div className="tooltip-container">
                <HelpCircle className="help-icon" />
                <div className="tooltip">보유 현금과 보유 주식의 현재 가치의 합계</div>
              </div>
            </div>
            <div className="stat-item__value">{(calculateAvailableCash() + calculateStockValue()).toLocaleString()}원</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__label">
              수익률
              <div className="tooltip-container">
                <HelpCircle className="help-icon" />
                <div className="tooltip">초기 자금 대비 현재 총 자산의 증감률</div>
              </div>
            </div>
            <div className={`stat-item__value ${calculateTotalReturn() >= 0 ? "text-red-500" : "text-blue-500"}`}>{calculateTotalReturn().toFixed(2)}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__label">진행 일자</div>
            <div className="stat-item__value">{gameData.currentDay}/20일</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
