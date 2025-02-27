package com.moneybricks.quiz.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "quiz_attempts", indexes = {
        @Index(name = "idx_member_id", columnList = "member_id"),
        @Index(name = "idx_attempt_date", columnList = "attempt_date")
})
public class QuizAttempt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; //  퀴즈를 푼 회원

    @Column(name = "quiz_category", nullable = false)
    private String quizCategory; // 퀴즈 카테고리(금융, 경제)

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions; // 총 문제 수

    @Builder.Default
    @Column(name = "correct_answer", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer correctAnswer = 0; // 맞은 문제 수

    @Builder.Default
    @Column(name = "earned_points", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer earnedPoints = 0; // 획득한 포인트

    @Column(name = "attempt_date", nullable = false)
    private LocalDateTime attemptDate; // 퀴즈 시도 시간

    // 정답 수 업데이트
    public void updateCorrectAnswers(Integer correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    // 획득 포인트 업데이트
    public void updateEarnedPoints(Integer earnedPoints) {
        this.earnedPoints = earnedPoints;
    }

    @Builder
    public QuizAttempt(Member member, String quizCategory, Integer totalQuestions,
                       LocalDateTime attemptDate) {
        this.member = member;
        this.quizCategory = quizCategory;
        this.totalQuestions = totalQuestions;
        this.attemptDate = attemptDate;
        this.correctAnswer = 0;
        this.earnedPoints = 0;
    }
}
