import React, { useState, useEffect } from "react";
import { Trophy, Medal, User } from "lucide-react";
import { getTopRankings, getMyRanking } from "../api/StockGameApi";
import "../scss/RankingBoard.scss";

const RankingBoard = ({ username }) => {
  const [rankings, setRankings] = useState([]);
  const [myRanking, setMyRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);

        // 상위 랭킹 데이터 가져오기
        const apiRankings = await getTopRankings(10);

        // 로그인한 경우에만 내 랭킹 정보 가져오기
        let userRanking = null;
        if (username) {
          userRanking = await getMyRanking(username);
        }

        // 순위 넣기
        const sortedRankings = [...apiRankings]
          .map((rank, index) => ({
            ...rank,
            displayRank: index + 1, // 표시용 순위 부여
          }));

        setRankings(sortedRankings);
        setMyRanking(userRanking);
        console.log(myRanking);
      } catch (err) {
        setError("랭킹 정보를 불러오는데 실패했습니다.");
        console.error("랭킹 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    };

      fetchRankings();
  }, [username]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ranking-board">
      <div className="ranking-header">
        <Trophy className="trophy-icon" />
        <h2>모의주식 수익률 랭킹</h2>
      </div>

      {/* 내 랭킹 */}
      {username && myRanking && (
         <>
           <div className="my-ranking">
             <User className="user-icon" />
             <div className="ranking-info">
               <span className="username">{myRanking.userNickName}</span>
               <span className={`return-rate ${myRanking.returnRate >= 0 ? "positive" : "negative"}`}>
                {typeof myRanking.returnRate === "number" ? myRanking.returnRate.toFixed(2) : "0.00"}%
              </span>
             </div>
           </div>
           <hr />
         </>
      )}

      {/* 상위 랭킹 목록 */}
      <div className="ranking-list">
        {rankings.map((rank) => (
          <div key={`rank-${rank.id || rank.displayRank}`} className={`ranking-item ${rank.userName === username ? "highlight" : ""}`}>
            <div className="rank-badge">{rank.displayRank <= 3 ? <Medal className={`medal-${rank.displayRank}`} /> : rank.displayRank}</div>
            <span className="username">{rank.userNickName}</span>
            <span className={`return-rate ${rank.returnRate >= 0 ? "positive" : "negative"}`}>{rank.returnRate.toFixed(2)}%</span>
          </div>
        ))}

        {rankings.length === 0 && <div className="no-rankings">아직 랭킹 정보가 없습니다.</div>}
      </div>
    </div>
  );
};

export default RankingBoard;
