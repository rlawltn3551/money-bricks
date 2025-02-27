package com.moneybricks.quiz.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "quiz_answers", indexes = {
        @Index(name = "idx_quiz_attempt", columnList = "quiz_attempt_id"),
        @Index(name = "idx_quiz", columnList = "quiz_id")
})
public class QuizAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_attempt_id", nullable = false)
    private QuizAttempt quizAttempt; // 시도 정보

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz; // 퀴즈 문제

    @Column(name = "selected_answer", nullable = false)
    private String selectedAnswer; // 선택한 답변 (O 또는 X 또는 시간초과)

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect; // 정답 여부
}
