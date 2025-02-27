package com.moneybricks.qna.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QnaBoardReplyCountDTO {

    private Long qno;
    private String title;
    private String writer;
    private LocalDateTime createdAt;
    private Long replyCount;
}
