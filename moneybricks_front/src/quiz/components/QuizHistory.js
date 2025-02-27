// src/components/QuizHistory.js
import React, { useState, useEffect } from "react";
import quizApi from "../api/QuizApi";
import "../styles/QuizHistory.scss";
import BasicMenu from "../../common/components/BasicMenu";

const QuizHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 5;

  // 퀴즈 이력 불러오기
  useEffect(() => {
    loadHistory();
  }, [currentPage]);

  // 퀴즈 이력 불러오기 함수
  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const response = await quizApi.getQuizHistory(currentPage, pageSize);

      setHistoryList(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);

      setIsLoading(false);
    } catch (error) {
      console.error("퀴즈 이력 불러오기 오류:", error);
      setError("퀴즈 이력을 불러오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 특정 퀴즈 시도 상세 정보 보기
  const viewAttemptDetails = async (attemptId) => {
    if (selectedAttempt === attemptId && attemptDetails) {
      // 이미 선택된 시도는 접기
      setSelectedAttempt(null);
      setAttemptDetails(null);
      return;
    }

    try {
      const response = await quizApi.getQuizAttemptDetail(attemptId);
      setSelectedAttempt(attemptId);
      setAttemptDetails(response);
    } catch (error) {
      console.error("퀴즈 시도 상세 정보 불러오기 오류:", error);
      setError("상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 메인 퀴즈 페이지로 이동
  const goToQuiz = () => {
    window.location.href = "/quiz";
  };

  if (isLoading && historyList.length === 0) {
    return (
      <div className="quiz-history-container">
        <div className="loading-container">
          <div className="loading-text">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error && historyList.length === 0) {
    return (
      <div className="quiz-history-container">
        <div className="error-container">
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BasicMenu />
      <div className="quiz-history-container">
        <div className="history-header">
          <h1>퀴즈 이력</h1>
          <p>지금까지 푼 퀴즈의 이력을 확인하세요.</p>
        </div>

        {historyList.length === 0 ? (
          <div className="empty-history">
            <h2>아직 푼 퀴즈가 없습니다.</h2>
            <p>퀴즈를 풀고 포인트를 획득해보세요!</p>
            <button onClick={goToQuiz} className="primary-button">
              퀴즈 풀기
            </button>
          </div>
        ) : (
          <>
            <div className="history-list">
              {historyList.map((attempt) => (
                <div key={attempt.attemptId} className="history-item">
                  <div className="history-item-header" onClick={() => viewAttemptDetails(attempt.attemptId)}>
                    <div className="attempt-info">
                      <h3>{attempt.attemptDate}</h3>
                      <div className="attempt-stats">
                        <span className="category">{attempt.category}</span>
                        <span>
                          {attempt.correctAnswers} / {attempt.totalQuestions} 정답
                        </span>
                        <span className="points">+{attempt.earnedPoints} 포인트</span>
                      </div>
                    </div>
                    <div className="toggle-icon">{selectedAttempt === attempt.attemptId ? "▲" : "▼"}</div>
                  </div>

                  {selectedAttempt === attempt.attemptId && attemptDetails && (
                    <div className="attempt-details">
                      <div className="details-header">
                        <h4>퀴즈 상세 결과</h4>
                      </div>
                      <div className="details-list">
                        {attemptDetails.details &&
                          attemptDetails.details.map((detail, index) => (
                            <div key={index} className={`detail-item ${detail.isCorrect ? "correct" : "incorrect"}`}>
                              <p className="question">
                                {index + 1}. {detail.question}
                              </p>
                              <div className="answer-info">
                                <div className="answer-row">
                                  <span className="label">정답:</span>
                                  <span className="value">{detail.correctAnswer}</span>
                                </div>
                                <div className="answer-row">
                                  <span className="label">내 답변:</span>
                                  <span className="value">{detail.selectedAnswer}</span>
                                </div>
                                <div className="result">{detail.isCorrect ? "정답" : "오답"}</div>
                              </div>
                              <p className="explanation">{detail.explanation}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 0} className="page-button">
                  이전
                </button>
                <span className="page-info">
                  {currentPage + 1} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="page-button">
                  다음
                </button>
              </div>
            )}

            {/* 퀴즈 페이지로 이동 버튼 */}
            <div className="action-buttons">
              <button onClick={goToQuiz} className="primary-button">
                새 퀴즈 풀기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
