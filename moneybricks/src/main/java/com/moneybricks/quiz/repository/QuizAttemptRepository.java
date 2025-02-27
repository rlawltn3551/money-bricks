package com.moneybricks.quiz.repository;

import com.moneybricks.member.domain.Member;
import com.moneybricks.quiz.domain.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    // 특정 회원의 퀴즈 시도 목록 조회(페이징)
    Page<QuizAttempt> findByMemberOrderByAttemptDateDesc(Member member, Pageable pageable);

    // 특정 회원의 특정 카테고리 퀴즈 시도 목록 조회
    List<QuizAttempt> findByMemberAndQuizCategoryOrderByAttemptDateDesc(Member member, String quizCategory);

    // 특정 회원의 가장 최근 퀴즈 시도 조회
    Optional<QuizAttempt> findTopByMemberOrderByAttemptDateDesc(Member member);

    // 특정 회원의 특정 날짜 범위 내 퀴즈 시도 횟수 조회
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.member = :member AND qa.attemptDate between :startDate AND :endDate")
    int countByMemberAndAttemptDateBetween(@Param("member")Member member,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    // 특정 회원이 해당 날짜에 특정 카테고리의 퀴즈를 풀었는 지 확인
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.member = :member AND qa.quizCategory = :category " +
            "AND qa.attemptDate >= :startOfDay AND qa.attemptDate < :endOfDay")
    int countByMemberAndQuizCategoryAndAttemptDateBetween(@Param("member") Member member,
                                                          @Param("category") String category,
                                                          @Param("startOfDay") LocalDateTime startOfDay,
                                                          @Param("endOfDay") LocalDateTime endOfDay);

    // 회원 ID로 퀴즈 시도 조회
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.member.id = :memberId ORDER BY qa.attemptDate DESC")
    Page<QuizAttempt> findByMemberId(@Param("memberId") Long memberId, Pageable pageable);
}
