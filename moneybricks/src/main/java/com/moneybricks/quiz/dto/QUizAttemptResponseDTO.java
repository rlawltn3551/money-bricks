package com.moneybricks.quiz.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// 퀴즈 시도 응답
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QUizAttemptResponseDTO {

    private Long attemptId;
    private String category;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer earnedPoints;
    private List<QuizResultDetailDTO> details; // 정답 및 해설
}
