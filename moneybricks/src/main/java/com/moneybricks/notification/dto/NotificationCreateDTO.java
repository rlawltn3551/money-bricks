package com.moneybricks.notification.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCreateDTO {
    private Long memberId; // 알림을 받을 사용자 ID
    private String title;   // 알림 제목
    private String message; // 알림 내용
}
