package com.moneybricks.quiz.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "quiz", indexes = {
        @Index(name = "idx_category", columnList = "category")
})
public class Quiz extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String question; // 퀴즈 질문
    
    @Column(nullable = false)
    private String answer; // 정답 ( O 또는 X) 
    
    @Column(nullable = false, length = 1000)
    private String explanation; // 문제 해설
    
    @Column(nullable = false)
    private String category; // 퀴즈 카테고리 (금융, 경제 등)

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true; // 활성화 상태

    // 질문 변경
    public void changeQuestion(String question) {
        this.question = question;
    }

    // 정답 변경
    public void changeAnswer(String answer) {
        this.answer = answer;
    }

    // 해설 변경
    public void changeExplanation(String explanation) {
        this.explanation = explanation;
    }

    // 활성 상태 변경
    public void changeActive(Boolean active) {
        this.active = active;
    }
}
