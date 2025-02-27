package com.moneybricks.qna.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "qnaReply")
public class QnaReply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrno;

    @ManyToOne(fetch = FetchType.LAZY)
    private QnaBoard qnaBoard;

    private String replyText;

    private String replier;

    // replyText를 수정하기 위한 함수
    public void changeText(String text){
        this.replyText = text;
    }
}
