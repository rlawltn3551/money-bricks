package com.moneybricks.quiz.repository;

import com.moneybricks.quiz.domain.QuizAnswer;
import com.moneybricks.quiz.domain.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;

public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {

    // 특정 퀴즈 시도에 대한 모든 답변 조회
    List<QuizAnswer> findByQuizAttemptOrderById(QuizAttempt quizAttempt);

    // 특정 퀴즈 시도에서 정답인 답변 수 조회
    int countByQuizAttemptAndIsCorrectTrue(QuizAttempt quizAttempt);

//    // 특정 퀴즈에 대한 정답률 조회
//    @Query("SELECT COUNT(qa) FROM QuizAnswer qa WHERE qa.quiz.id = :quizId AND qa.isCorrect = true) * 100.0 /" +
//            "(SELECT COUNT(qa2) FROM QuizAnswer qa2 WHERE qa2 WHERE qa2.quiz.id = :quizId)")
//    Double getCorrectRateByQuizId(@Param("quizId") Long quizId);

    // 전체 답변 수 조회
    int countByQuizId(Long quizId);

    // 정답 답변 수 조회
    int countByQuizIdAndIsCorrectTrue(Long quizId);

    // 가장 많이 틀린 문제 조회
    @Query("SELECT qa.quiz.id, COUNT(qa) as wrongCount " +
            "FROM QuizAnswer qa " +
            "WHERE qa.isCorrect = false " +
            "GROUP BY qa.quiz.id " +
            "ORDER BY wrongCount DESC")
    List<Object[]> findMostIncorrectQuizzes(Pageable pageable);
}
