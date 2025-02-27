// src/components/FinanceQuiz.js
import React, { useState, useEffect } from "react";
import quizApi from "../api/QuizApi";
import "../styles/FinanceQuiz.scss";
import BasicMenu from "../../common/components/BasicMenu";

const FinanceQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 문제당 15초
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [canAttemptToday, setCanAttemptToday] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 오늘 퀴즈를 이미 풀었는지 확인
  useEffect(() => {
    const checkTodayAttempt = async () => {
      try {
        setIsLoading(true);
        const response = await quizApi.checkAttempt();
        setCanAttemptToday(response.canAttempt);

        if (response.canAttempt) {
          // 퀴즈를 풀 수 있으면 문제 가져오기
          fetchQuizzes();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("퀴즈 시도 확인 중 오류 발생:", error);
        setError("퀴즈 정보를 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    checkTodayAttempt();
  }, []);

  // 퀴즈 데이터 가져오기
  // 퀴즈 데이터 가져오기
  const fetchQuizzes = async () => {
    try {
      const quizData = await quizApi.getQuizzes();
      console.log("✅ [1] 받아온 퀴즈 데이터 (원본):", quizData);

      // 개별 퀴즈 항목 확인
      quizData.forEach((quiz, index) => {
        console.log(`🔍 [2] 원본 데이터 - 문제 ${index + 1}:`, quiz);
      });

      // 상태 업데이트
      setQuizzes(quizData);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ 퀴즈 목록 조회 중 오류 발생:", error);
      setError("퀴즈 정보를 불러오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  // 상태 업데이트 후 변경 확인 (quizzes 값이 변경될 때마다 실행)
  useEffect(() => {
    console.log("🛠 [3] 상태 업데이트 후 quizzes:", quizzes);
    quizzes.forEach((quiz, index) => {
      console.log(`🧐 [4] 상태 업데이트 후 - 문제 ${index + 1}:`, quiz);
    });
  }, [quizzes]); // quizzes가 변경될 때마다 실행

  // 타이머 설정
  useEffect(() => {
    if (quizCompleted || showResult || !canAttemptToday || quizzes.length === 0) return;

    console.log(quizzes);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 시간 초과 시 다음 문제로
          handleAnswer("시간초과");
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuizIndex, quizCompleted, showResult, canAttemptToday, quizzes.length]);

  // 사용자가 답변을 선택했을 때
  // 사용자가 답변을 선택했을 때
  const handleAnswer = (selectedAnswer) => {
    if (quizCompleted || !canAttemptToday) return;

    const currentQuiz = quizzes[currentQuizIndex];
    const isLastQuestion = currentQuizIndex === quizzes.length - 1;

    console.log("현재 퀴즈:", currentQuiz);
    console.log("선택한 답변:", selectedAnswer);
    console.log("정답:", currentQuiz.answer);

    const isCorrect = selectedAnswer === currentQuiz.answer;
    console.log("정답 여부:", isCorrect);

    // 현재 답변 객체 생성
    const currentAnswer = {
      quizId: currentQuiz.id,
      selectedAnswer,
      isCorrect,
    };

    // 새로운 답변을 포함한 업데이트된 userAnswers 객체
    const updatedUserAnswers = {
      ...userAnswers,
      [currentQuizIndex]: currentAnswer,
    };

    // 사용자 답변 저장
    setUserAnswers(updatedUserAnswers);

    // 마지막 문제인 경우 바로 결과 제출
    if (isLastQuestion) {
      finishQuizWithAnswers(updatedUserAnswers);
    } else {
      // 다음 문제로 이동
      setCurrentQuizIndex(currentQuizIndex + 1);
      setTimeLeft(15); // 타이머 초기화
    }
  };

  // 직접 답변을 전달받아 퀴즈 결과 제출하는 함수
  const finishQuizWithAnswers = async (answersObj) => {
    try {
      console.log("🧐 퀴즈 종료, 서버에 결과 제출 중...");

      // 디버깅용 로그 추가
      console.log("📊 직접 전달받은 answersObj:", answersObj);
      console.log("📋 전체 퀴즈 수:", quizzes.length);
      console.log(
         "📋 전체 퀴즈 ID:",
         quizzes.map((q) => q.id)
      );
      console.log("📋 전달받은 answers 길이:", Object.keys(answersObj).length);

      // 각 항목 검사
      Object.entries(answersObj).forEach(([index, answer]) => {
        console.log(`📌 answersObj[${index}]:`, answer);
      });

      // 객체에서 직접 배열로 변환
      const answers = Object.values(answersObj).map((answer) => ({
        quizId: answer.quizId,
        selectedAnswer: answer.selectedAnswer,
      }));

      // 마지막 문제가 포함되었는지 확인
      console.log("✅ answers 배열 길이:", answers.length);
      console.log("✅ answers 배열 마지막 항목:", answers[answers.length - 1]);

      console.log("📩 서버 전송 answers:", JSON.stringify(answers, null, 2));
      console.log("answers : ", answers);

      const quizResults = {
        category: "종합",
        answers: answers,
      };

      const result = await quizApi.submitQuizResult(quizResults);
      console.log("✅ 퀴즈 제출 성공!", result);

      // 퀴즈 결과 데이터 변환
      const updatedQuizzes = result.details.map((detail) => ({
        id: detail.quizId,
        question: detail.question,
        category: quizzes.category, // 기존 카테고리 유지
        answer: detail.correctAnswer,
        explanation: detail.explanation,
        correctAnswer: detail.correctAnswer,
        selectedAnswer: detail.selectedAnswer,
        isCorrect: detail.isCorrect,
      }));

      console.log("📌 퀴즈 전체 응답 데이터:", result);
      console.log("📌 응답된 문제 수:", result.details.length);
      console.log(
         "📌 모든 문제 ID:",
         result.details.map((q) => q.quizId)
      );
      console.log("변환된 퀴즈 데이터:", updatedQuizzes);

      // 상태 업데이트
      setTotalPoints(result.earnedPoints);
      setCanAttemptToday(false);
      setQuizCompleted(true);
      setShowResult(true);
    } catch (error) {
      console.error("❌ 퀴즈 결과 제출 중 오류 발생:", error);
      console.error("에러 상세:", error.response);
      setError("퀴즈 결과 제출 중 오류가 발생했습니다.");
    }
  };

  // 원래 finishQuiz 함수는 그대로 유지 (사용하지 않더라도)
  const finishQuiz = async () => {
    try {
      console.log("🧐 퀴즈 종료, 서버에 결과 제출 중...");

      // 디버깅용 로그 추가
      console.log("📊 제출 전 userAnswers 객체:", userAnswers);
      console.log("📋 전체 퀴즈 수:", quizzes.length);
      console.log(
         "📋 전체 퀴즈 ID:",
         quizzes.map((q) => q.id)
      );
      console.log("📋 userAnswers 길이:", Object.keys(userAnswers).length);

      // userAnswers의 각 항목 검사
      Object.entries(userAnswers).forEach(([index, answer]) => {
        console.log(`📌 userAnswers[${index}]:`, answer);
      });

      // userAnswers 객체에서 직접 배열로 변환
      const answers = Object.values(userAnswers).map((answer) => ({
        quizId: answer.quizId,
        selectedAnswer: answer.selectedAnswer,
      }));

      // 마지막 문제가 포함되었는지 확인
      console.log("✅ answers 배열 길이:", answers.length);
      console.log("✅ answers 배열 마지막 항목:", answers[answers.length - 1]);

      console.log("📩 서버 전송 answers:", JSON.stringify(answers, null, 2));
      console.log("answers : ", answers);
      console.log("userAnswers:", userAnswers);

      const quizResults = {
        category: "종합",
        answers: answers,
      };

      const result = await quizApi.submitQuizResult(quizResults);
      console.log("✅ 퀴즈 제출 성공!", result);

      // 퀴즈 결과 데이터 변환
      const updatedQuizzes = result.details.map((detail) => ({
        id: detail.quizId,
        question: detail.question,
        category: quizzes.category, // 기존 카테고리 유지
        answer: detail.correctAnswer,
        explanation: detail.explanation,
        correctAnswer: detail.correctAnswer,
        selectedAnswer: detail.selectedAnswer,
        isCorrect: detail.isCorrect,
      }));

      console.log("📌 퀴즈 전체 응답 데이터:", result);
      console.log("📌 응답된 문제 수:", result.details.length);
      console.log(
         "📌 모든 문제 ID:",
         result.details.map((q) => q.quizId)
      );
      console.log("변환된 퀴즈 데이터:", updatedQuizzes);

      // 상태 업데이트
      setTotalPoints(result.earnedPoints);
      setCanAttemptToday(false);
      setQuizCompleted(true);
      setShowResult(true);
    } catch (error) {
      console.error("❌ 퀴즈 결과 제출 중 오류 발생:", error);
      console.error("에러 상세:", error.response);
      setError("퀴즈 결과 제출 중 오류가 발생했습니다.");
    }
  };

  // 퀴즈 이력 페이지로 이동
  const goToHistory = () => {
    window.location.href = "/quiz/history";
  };

  // 현재 진행 상황
  const progress = quizzes.length > 0 ? ((currentQuizIndex + 1) / quizzes.length) * 100 : 0;

  if (isLoading) {
    return (
       <div className="quiz-container">
         <div className="loading-container">
           <div className="loading-text">로딩 중...</div>
         </div>
       </div>
    );
  }

  if (error) {
    return (
       <div className="quiz-container">
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
       <div className="quiz-container">
         {/* 퀴즈 헤더 */}
         <div className="quiz-header">
           <h1>금융 & 경제 OX 퀴즈</h1>
           <p>매일 하루 한 번, 경제와 금융 지식을 테스트하고 포인트를 획득하세요!</p>
         </div>

         {/* 오늘 이미 퀴즈를 풀었을 경우 */}
         {!canAttemptToday && !showResult && (
            <div className="completed-container">
              <h2>오늘의 퀴즈를 이미 완료했습니다!</h2>
              <p>내일 다시 도전해보세요.</p>
              <p className="info-text">매일 자정(00:00)에 퀴즈가 초기화됩니다.</p>
              <button onClick={goToHistory}>퀴즈 이력 보기</button>
            </div>
         )}

         {/* 결과 화면 */}
         {showResult && (
            <div className="result-container">
              <h2>퀴즈 결과</h2>

              <div className="result-summary">
                <p className="score">
                  {(() => {
                    console.log("전체 퀴즈:", quizzes);
                    console.log("퀴즈 길이:", quizzes.length);
                    console.log(
                       "퀴즈 ID들:",
                       quizzes.map((quiz) => quiz.id)
                    );

                    const correctCount = quizzes.reduce((count, quiz, index) => {
                      const userAnswer = userAnswers[index]; // 사용자가 선택한 답변 정보
                      return userAnswer?.isCorrect ? count + 1 : count;
                    }, 0);
                    console.log("정답 문제 수", quizzes, userAnswers);
                    return `${quizzes.length}문제 중 ${correctCount}문제 정답`;
                  })()}
                </p>
                <p className="points">
                  획득 포인트: <span>{totalPoints}</span> P
                </p>
              </div>

              <div className="answers-list">
                {quizzes.map((quiz, index) => {
                  const userAnswer = userAnswers[index] || {};

                  console.log(`문제 ${index + 1} 정보:`, {
                    quiz,
                    userAnswer,
                  });

                  return (
                     <div key={quiz.id} className={`answer-item ${userAnswer.isCorrect ? "correct" : "incorrect"}`}>
                       <p className="question-text">
                         {index + 1}. {quiz.question}
                       </p>
                       <div className="answer-details">
                         <div className="answer-info">
                           <p>
                             정답: <span>{quiz.answer}</span>
                           </p>
                           <p>
                             내 답변: <span>{userAnswer.selectedAnswer === "시간초과" ? "시간 초과" : userAnswer.selectedAnswer}</span>
                           </p>
                         </div>
                         <div className={`answer-status ${userAnswer.isCorrect ? "correct" : "incorrect"}`}>{userAnswer.isCorrect ? "정답" : "오답"}</div>
                       </div>
                     </div>
                  );
                })}
              </div>

              <div className="action-buttons">
                <button onClick={goToHistory}>퀴즈 이력 보기</button>
              </div>
            </div>
         )}

         {/* 퀴즈 진행 화면 */}
         {canAttemptToday && !showResult && quizzes.length > 0 && (
            <div className="quiz-progress-container">
              {/* 진행 상황 바 */}
              <div className="progress-bar-container">
                <div className="progress-info">
                <span>
                  문제 {currentQuizIndex + 1} / {quizzes.length}
                </span>
                  <span>남은 시간: {timeLeft}초</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              {/* 현재 문제 */}
              <div className="question-container">
                <p className="category">카테고리: {quizzes[currentQuizIndex].category}</p>
                <h2 className="question-text">{quizzes[currentQuizIndex].question}</h2>
              </div>

              {/* O/X 선택 버튼 */}
              <div className="answer-buttons">
                <button onClick={() => handleAnswer("O")} className="btn-o">
                  O
                </button>
                <button onClick={() => handleAnswer("X")} className="btn-x">
                  X
                </button>
              </div>

              {/* 시간 바 */}
              <div className="timer-bar-container">
                <div className={`timer-fill ${timeLeft > 5 ? "normal" : "warning"}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
              </div>
            </div>
         )}
       </div>
     </div>
  );
};

export default FinanceQuiz;
