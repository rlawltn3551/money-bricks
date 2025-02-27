package com.moneybricks.notification.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long id;
    private Long memberId; // 알림을 받은 사용자 ID
    private String title;   // 알림 제목
    private String message; // 알림 내용
    private String createdAt; // 알림 생성 일시
    private boolean readStatus; // 읽음 여부
}
