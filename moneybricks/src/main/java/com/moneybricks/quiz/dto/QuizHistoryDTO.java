package com.moneybricks.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//퀴즈 이력
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizHistoryDTO {

    private Long attemptId;
    private String category;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer earnedPoints;
    private String attemptDate;
}
