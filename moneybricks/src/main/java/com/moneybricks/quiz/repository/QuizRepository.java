package com.moneybricks.quiz.repository;

import com.moneybricks.quiz.domain.Quiz;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // 카테고리 별 퀴즈 조회
    List<Quiz> findByCategoryAndActiveTrue(String category);

    // 모든 카테고리에서 활성화된 퀴즈 조회
    List<Quiz> findByActiveTrue();

    // 랜덤으로 지정된 수만큼 퀴즈 조회 (특정 카테고리)
    @Query("SELECT q FROM Quiz q WHERE q.category = :category AND q.active = true ORDER BY FUNCTION('RAND')")
    List<Quiz> findRandomQuizzesByCategory(@Param("category") String category, Pageable pageable);

    // 랜덤으로 지정된 수만큼 퀴즈 조회 (전체 카테고리)
    @Query( "SELECT q FROM Quiz q WHERE q.active = true ORDER BY FUNCTION('RAND')")
    List<Quiz> findRandomQuizzes(Pageable pageable);

    // 특정 답변 (O, X)를 가진 퀴즈 랜덤 조회
    @Query("SELECT q FROM Quiz q WHERE q.answer =  :answer AND q.active = true ORDER BY FUNCTION('RAND')")
    List<Quiz> findRandomQuizzesByAnswer(@Param("answer") String answer, Pageable pageable);

    // 카테고리 별 퀴즈 수 조회
    long countByCategoryAndActiveTrue(String category);

}
