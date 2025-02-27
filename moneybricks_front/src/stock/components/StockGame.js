import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { getGameData, getAllStocks, claimDailyReward, nextDay, getStockPriceHistory, saveGameNews, saveDailyPrices } from "../api/StockGameApi";
import GameStatus from "./GameStatus";
import StockChart from "./StockChart";
import { generateDailyNews } from "../utils/NewsGenerator";
import "../scss/StockGame.scss";
import GameResultModal from "./GameResultModal";
import TradeModal from "./TradeModal";
import NewsHistoryTab from "./NewsHistoryTab";
import RankingBoard from "./RankingBoard";
import BasicMenu from "../../common/components/BasicMenu";

const StockGame = () => {
  // 상태 관리
  const [gameData, setGameData] = useState(null);
  const [currentStocks, setCurrentStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedListStock, setSelectedListStock] = useState(null);
  const [news, setNews] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [gameEndData, setGameEndData] = useState(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [showNewsHistory, setShowNewsHistory] = useState(false);

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const [gameData, stocksData] = await Promise.all([getGameData(), getAllStocks()]);
        console.log("Received Game Data:", gameData); // 로그 추가
        console.log("Game Holdings:", gameData.holdings);
        console.log("All Stocks Data:", stocksData);

        // 보유 주식 수익률 계산
        const updatedGameData = {
          ...gameData,
          holdings: gameData.holdings?.map((holding) => {
            // 기존 코드에서는 currentPrice를 stocksData에서 가져왔는데,
            // 대신 holding의 currentPrice를 사용
            const currentPrice = holding.currentPrice; // 여기가 변경된 부분
            const averagePrice = holding.averagePrice;
            const returnRate = ((currentPrice - averagePrice) / averagePrice) * 100;

            console.log("Processing Stock:", {
              name: holding.stockName,
              currentPrice,
              averagePrice,
              returnRate,
            });

            console.log("Holding Details:", {
              holdingCurrentPrice: holding.currentPrice,
              stockDataPrice: stocksData.find((s) => s.code === holding.stockCode)?.price,
              averagePrice: holding.averagePrice,
            });

            return {
              ...holding,
              currentPrice: currentPrice,
              averagePrice: averagePrice,
              returnRate: returnRate,
            };
          }),
        };

        setGameData(updatedGameData);
        setCurrentStocks(stocksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleNextDay = async () => {
    try {
      // 새로운 뉴스 생성 및 저장 (이전과 동일)
      const newNews = generateDailyNews(currentStocks, gameData.currentDay + 1);
      setNews(newNews);

      const newsDTO = {
        title: newNews.title,
        content: newNews.content,
        marketImpact: newNews.marketImpact,
        priceImpact: newNews.priceImpact,
        isPositive: newNews.isPositive,
        affectedStocks: newNews.affectedStocks,
        type: newNews.type,
        industry: newNews.industry,
        relatedStocks: newNews.relatedStocks,
      };

      await saveGameNews(gameData.id, newsDTO);

      // 주가 변동 로직
      const prices = {};
      const changeRates = {};

      const updatedStocks = currentStocks.map((stock) => {
        const copy = { ...stock };

        // 각 종목별 독립적인 기본 변동성 생성 (-15% ~ 15%)
        const individualBaseImpact = Math.random() * 0.3 - 0.15;

        let priceImpact;

        // 뉴스 타입에 따른 영향도 설정
        if (newNews.type === "INDUSTRY") {
          if (stock.industry === newNews.industry) {
            // 해당 산업 주식도 각각 다른 영향도 적용
            const industryImpact = Math.random() * 0.1 + 0.1; // 10% ~ 20% 변동
            priceImpact = individualBaseImpact * industryImpact;
          } else {
            // 다른 산업 주식도 각각 다른 영향도 적용
            const otherIndustryImpact = Math.random() * 0.05; // 0% ~ 5% 변동
            priceImpact = individualBaseImpact * otherIndustryImpact;
          }
        } else if (newNews.type === "DOMESTIC") {
          // 국내 뉴스도 종목별 독립적인 변동성
          const domesticImpact = Math.random() * 0.1 + 0.05; // 5% ~ 15% 변동
          priceImpact = individualBaseImpact * domesticImpact;
        } else {
          // 국제 뉴스도 종목별 독립적인 변동성
          const internationalImpact = Math.random() * 0.15 + 0.05; // 5% ~ 20% 변동
          priceImpact = individualBaseImpact * internationalImpact;
        }

        // 종목별 추가 변동성 (-5% ~ 5%)
        const stockRandomFactor = 1 + (Math.random() * 0.1 - 0.05);
        const finalImpact = priceImpact * stockRandomFactor;

        // 가격 업데이트
        const oldPrice = copy.price;
        copy.price = Math.max(1, Math.round(oldPrice * (1 + finalImpact)));

        // 가격과 변동률 저장
        prices[stock.code] = copy.price;
        changeRates[stock.code] = finalImpact * 100;

        return copy;
      });

      // 현재 주가 state 업데이트
      setCurrentStocks(updatedStocks);

      // 일일 주가 데이터 저장
      await saveDailyPrices(gameData.id, prices, changeRates, gameData.currentDay + 1);

      // 백엔드에 다음 날로 진행 요청
      const nextDayResponse = await nextDay(gameData.id);
      const newGameData = await getGameData();

      // 보유 주식 정보 업데이트
      const updatedGame = {
        ...newGameData,
        holdings: newGameData.holdings?.map((holding) => {
          const updatedStock = updatedStocks.find((s) => s.code === holding.stockCode);
          if (!updatedStock) return holding;

          const currentPrice = updatedStock.price;
          const averagePrice = holding.averagePrice;
          const returnRate = ((currentPrice - averagePrice) / averagePrice) * 100;

          return {
            ...holding,
            averagePrice: averagePrice,
            currentPrice: currentPrice,
            returnRate: returnRate,
          };
        }),
      };

      // 차트 데이터 업데이트
      if (selectedListStock) {
        const priceHistory = await getStockPriceHistory(gameData.id, selectedListStock.code);
        if (priceHistory && priceHistory.length > 0) {
          const newChartData = priceHistory.map((price) => ({
            day: price.day,
            price: price.price,
            priceChangeRate: price.priceChangeRate,
          }));
          setChartData(newChartData);
        }
      }
      // 게임 종료 확인
      if (nextDayResponse.isCompleted) {
        console.log("게임 종료 시 nextDayResponse:", nextDayResponse);

        // nextDayResponse 데이터 사용
        const currentBalance = nextDayResponse.balance || 5000000;
        const totalReturn = nextDayResponse.totalReturn || 0;

        setGameEndData({
          ...nextDayResponse,
          currentBalance: currentBalance,
          totalReturn: totalReturn,
          earnedPoints: nextDayResponse.earnedPoints || 0,
          holdings: nextDayResponse.holdings || [],
        });
        setGameResult(true);
      }

      setGameData(updatedGame);
    } catch (error) {
      console.error("다음 날 진행 중 오류:", error);
      alert(error.message || "다음 날 진행 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (selectedListStock && gameData) {
      const fetchPriceHistory = async () => {
        try {
          const priceHistory = await getStockPriceHistory(gameData.id, selectedListStock.code);
          if (priceHistory && Array.isArray(priceHistory)) {
            setChartData(priceHistory);
          } else {
            // 히스토리가 없는 경우 현재 가격으로 초기 데이터 생성
            setChartData([
              {
                day: 1,
                price: selectedListStock.price,
                priceChangeRate: 0,
              },
            ]);
          }
        } catch (error) {
          console.error("주가 히스토리 조회 실패:", error);
          // 에러 발생시 현재 가격으로 초기 데이터 생성
          setChartData([
            {
              day: 1,
              price: selectedListStock.price,
              priceChangeRate: 0,
            },
          ]);
        }
      };
      fetchPriceHistory();
    } else {
      setChartData([]); // 선택된 주식이 없을 때는 빈 배열로 초기화
    }
  }, [selectedListStock, gameData]);

  const handleTradeSuccess = async () => {
    try {
      // 이전 상태의 보유 주식 정보 백업
      const prevHoldings = gameData.holdings || [];

      // 새 게임 데이터 가져오기
      const updatedGame = await getGameData();

      // 각 보유 주식에 대해 처리
      const mergedHoldings = updatedGame.holdings?.map((newHolding) => {
        // 기존에 보유하고 있던 주식인지 확인
        const prevHolding = prevHoldings.find((h) => h.stockCode === newHolding.stockCode);

        // 현재 주가 정보 가져오기
        const currentStock = currentStocks.find((s) => s.code === newHolding.stockCode);
        const currentPrice = currentStock?.price || newHolding.currentPrice;

        if (prevHolding) {
          // 기존 보유 주식의 경우
          return {
            ...newHolding,
            currentPrice: currentPrice,
            // 백엔드에서 받은 평균단가 사용
            averagePrice: newHolding.averagePrice,
            // 새로운 평균단가로 수익률 계산
            returnRate: ((currentPrice - newHolding.averagePrice) / newHolding.averagePrice) * 100,
          };
        } else {
          // 새로 매수한 주식의 경우
          return {
            ...newHolding,
            currentPrice: currentPrice,
            averagePrice: currentPrice, // 현재 매수가가 평균단가가 됨
            returnRate: 0, // 신규 매수는 수익률 0%
          };
        }
      });

      // 게임 데이터 업데이트
      setGameData({
        ...updatedGame,
        holdings: mergedHoldings,
      });
    } catch (error) {
      console.error("게임 데이터 갱신 중 오류:", error);
    }
  };

  const handleClaimReward = async () => {
    try {
      await claimDailyReward(gameData.id);
      const updatedGame = await getGameData();
      setGameData(updatedGame);
      alert("일일 보상을 받았습니다!");
    } catch (error) {
      alert(error.message);
    }
  };

  // 게임 종료 상태 체크
  useEffect(() => {
    if (gameData?.currentDay < 21 && gameData?.isCompleted) {
      setGameEndData({
        totalReturn: gameData.totalReturn,
        earnedPoints: gameData.earnedPoints || 0,
        id: gameData.id,
      });
      setGameResult(true);
    }
  }, [gameData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gameData) return <div>No game data available</div>;

  return (
    <div>
      <BasicMenu />
      <div className="stock-game-container">
        <div className="game-content">
          <div className="stock-game">
            <GameStatus gameData={gameData} />

            {/* 다음 날 버튼과 뉴스 카드 */}
            <div className="card">
              <div className="card__header">
                <h2>
                  <Calendar />
                  오늘의 뉴스
                </h2>
              </div>

              <div className="card__content">
                {/* 액션 버튼 컨테이너 */}
                <div className="action-buttons">
                  <button className={`action-button news-button ${showNewsHistory ? "active" : ""}`} onClick={() => setShowNewsHistory(!showNewsHistory)}>
                    <Calendar size={18} />
                    {showNewsHistory ? "뉴스 히스토리 닫기" : "뉴스 히스토리 보기"}
                  </button>

                  {/* <button className="action-button trade-button" onClick={() => setIsTradeModalOpen(true)}>
                    <TrendingUp size={18} />
                    주식 거래
                  </button> */}
                </div>

                {/* 뉴스 히스토리 탭 */}
                {showNewsHistory && <NewsHistoryTab gameId={gameData.id} />}

                <div className="news-section">
                  {news ? (
                    <div className="news-content">
                      <h3 className="news-title">{news.title}</h3>
                      <p className="news-body">{news.content}</p>
                      <div className="news-info">
                        <span className={`news-impact ${news.isPositive ? "positive" : "negative"}`}>시장 영향: {news.marketImpact}</span>
                        <span className="news-related">관련 종목: {news.relatedStocks}</span>
                      </div>
                    </div>
                  ) : (
                    <p>다음 날 버튼을 눌러 새로운 뉴스를 확인하세요.</p>
                  )}
                  <button className="next-day-button" onClick={handleNextDay} disabled={loading}>
                    다음 날
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <h2>
                  <TrendingUp />
                  실시간 시세
                </h2>
              </div>
              <div className="card__content">
                <div className="stock-list-chart">
                  <div className="stock-list">
                    {currentStocks.map((stock) => (
                      <div key={stock.code} className={`stock-item ${selectedListStock?.code === stock.code ? "selected" : ""}`} onClick={() => setSelectedListStock(stock)}>
                        <div className="stock-item-content">
                          <div className="stock-name">{stock.stockName || stock.name}</div>
                          <div className={`stock-price ${stock.priceChangeRate > 0 ? "up" : stock.priceChangeRate < 0 ? "down" : ""}`}>
                            {stock.price.toLocaleString()}
                            <span className="change-rate">
                              {stock.priceChangeRate > 0 ? "+" : ""}
                              {stock.priceChangeRate?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {/* <button
                          className="quick-trade-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedListStock(stock);
                            setIsTradeModalOpen(true);
                          }}>
                          거래
                        </button> */}
                      </div>
                    ))}
                  </div>

                  <div className="chart-container">
                    {selectedListStock && (
                       <button className="trade-selected-button" onClick={() => setIsTradeModalOpen(true)}>
                         이 종목 거래하기
                       </button>
                    )}
                    <div className="chart-content">
                      {selectedListStock ? (
                         <StockChart stock={selectedListStock} chartData={chartData} />
                      ) : (
                         <div className="chart-placeholder">좌측에서 종목을 선택하여 차트를 확인하세요.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 보유 주식 */}
            <div className="card">
              <div className="card__header">
                <h2>보유 주식</h2>
              </div>
              <div className="card__content">
                <table className="holdings-table">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th className="text-right">보유수량</th>
                      <th className="text-right">평균단가</th>
                      <th className="text-right">현재가</th>
                      <th className="text-right">총 매수금액</th>
                      <th className="text-right">총액</th>
                      <th className="text-right">수익률</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.holdings && gameData.holdings.length > 0 ? (
                      gameData.holdings.map((holding) => (
                        <tr key={holding.stockCode}>
                          <td>{holding.stockName}</td>
                          <td className="text-right">{holding.quantity}</td>
                          <td className="text-right">{holding.averagePrice.toLocaleString()}</td>
                          <td className="text-right">{holding.currentPrice.toLocaleString()}</td>
                          <td className="text-right">{(holding.averagePrice * holding.quantity).toLocaleString()}</td>
                          <td className="text-right">{(holding.currentPrice * holding.quantity).toLocaleString()}</td>
                          <td className={`text-right ${holding.returnRate >= 0 ? "positive" : "negative"}`}>{holding.returnRate.toFixed(2)}%</td>
                          <td>
                            <button
                              className="holding-trade-button"
                              onClick={() => {
                                const stock = currentStocks.find((s) => s.code === holding.stockCode);
                                if (stock) {
                                  setSelectedListStock(stock);
                                  setIsTradeModalOpen(true);
                                }
                              }}>
                              거래
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-holdings-message">
                          보유 중인 주식이 없습니다. 주식을 매수해보세요!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 일일 보상
           <div className="card">
             <div className="card__header">
               <h2>
                 <Award />
                 일일 보상
               </h2>
             </div>
             <div className="card__content">
               <div className="daily-reward">
                 <button onClick={handleClaimReward}>보상 받기</button>
                 <div className="reward-info">1% 수익당 300포인트, 1% 손실당 150포인트 차감</div>
               </div>
             </div>
           </div> */}
          </div>
        </div>

        <div className="ranking-sidebar">
          <RankingBoard username={gameData.memberName} />
        </div>

        {/* 모달은 컨테이너 외부에 배치 */}
        {/* 거래 모달 */}
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          stocks={currentStocks}
          gameId={gameData.id}
          gameData={gameData}
          selectedStock={selectedListStock}
          onTradeSuccess={handleTradeSuccess}
        />

        {/* 게임 결과 모달 */}
        {gameResult && gameEndData && (
          <GameResultModal
            isOpen={true}
            onClose={() => {
              setGameResult(false);
              setGameEndData(null);

              // 페이지 리로드
              window.location.reload();
            }}
            gameEndData={gameEndData}
          />
        )}
      </div>
    </div>
  );
};

export default StockGame;
