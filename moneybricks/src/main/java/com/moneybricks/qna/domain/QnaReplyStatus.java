package com.moneybricks.qna.domain;

import lombok.Getter;

@Getter
public enum QnaReplyStatus {
    WAITING("답변 대기 중"),
    COMPLETED("답변 완료");

    private final String description;

    QnaReplyStatus(String description) {
        this.description = description;
    }
}
