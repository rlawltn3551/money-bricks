package com.moneybricks.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// 퀴즈 정답 제출
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAnswerDTO {
    private Long quizId;
    private String selectedAnswer; // O, X, 시간초과
    private Boolean isCorrect;
}
