// NewsHistoryTab.jsx
import React, { useState, useEffect } from "react";
import { getNewsHistory } from "../api/StockGameApi";
import "../scss/NewsHistoryTab.scss";

const NewsHistoryTab = ({ gameId }) => {
  const [newsHistory, setNewsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchNewsHistory = async () => {
          try {
              setLoading(true);
              setError(null);
              const data = await getNewsHistory(gameId);
              setNewsHistory(Array.isArray(data) ? data : []);  // 데이터가 배열인지 확인
          } catch (error) {
              console.error('뉴스 히스토리 로딩 중 오류:', error);
              setError('뉴스 히스토리를 불러오는데 실패했습니다.');
          } finally {
              setLoading(false);
          }
      };

      if (gameId) {
          fetchNewsHistory();
      }
  }, [gameId]);

  if (loading) return <div className="news-history-loading">로딩 중...</div>;
  if (error) return <div className="news-history-error">{error}</div>;
  if (!newsHistory.length) return <div className="news-history-empty">아직 뉴스가 없습니다.</div>;

  return (
    <div className="news-history-tab">
      <h2>뉴스 히스토리</h2>
      <div className="news-list">
        {newsHistory.map((news, index) => (
          <div key={index} className="news-item">
            <div className="news-header">
              <span className="day">{news.day}일차</span>
              <span className={`impact ${news.isPositive ? "positive" : "negative"}`}>{news.marketImpact}</span>
            </div>
            <h3>{news.title}</h3>
            <p>{news.content}</p>
            <div className="news-footer">
              <span className="type">{news.type}</span>
              {news.relatedStocks && <span className="related">관련 종목: {news.relatedStocks}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsHistoryTab;
