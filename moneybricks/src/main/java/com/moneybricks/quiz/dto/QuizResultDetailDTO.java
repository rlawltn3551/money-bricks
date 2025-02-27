package com.moneybricks.quiz.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 퀴즈 결과
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultDetailDTO {

    private Long quizId;
    private String question;
    private String correctAnswer;
    private String selectedAnswer;
    private Boolean isCorrect;
    private String explanation;
}
