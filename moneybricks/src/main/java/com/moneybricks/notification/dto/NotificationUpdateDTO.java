package com.moneybricks.notification.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationUpdateDTO {
    private Long id;
    private boolean readStatus; // 읽음 상태
}
