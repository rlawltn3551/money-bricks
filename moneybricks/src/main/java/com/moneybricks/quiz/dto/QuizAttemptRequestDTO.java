package com.moneybricks.quiz.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


// 퀴즈 시도 요청
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor 
public class QuizAttemptRequestDTO {
    private String category;

    @Builder.Default
    private List<QuizAnswerDTO> answers = new ArrayList<>();
}
