package com.moneybricks.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// 퀴즈 조회
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    
    private Long id;
    private String question;
    private String category;
    private String answer;
    private String explanation;

}
