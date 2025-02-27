package com.moneybricks.notification.service;

import com.moneybricks.notification.dto.NotificationCreateDTO;
import com.moneybricks.notification.dto.NotificationResponseDTO;
import com.moneybricks.notification.dto.NotificationUpdateDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {
    // 알림 생성
    NotificationResponseDTO createNotification(NotificationCreateDTO notificationCreateDto);

    List<NotificationResponseDTO> getNotifications(String username, LocalDateTime startDate, LocalDateTime endDate, Boolean isRead);

    // 알림 상태 업데이트 (읽음/안읽음 변경)
    void updateNotificationStatus(NotificationUpdateDTO notificationUpdateDto);

    // 모든 알림 삭제
    void deleteAllNotifications(String username);

    // 선택적 알림 삭제
    void deleteNotification(Long notificationId);

    // 안 읽은 알림 개수 조회
    Long getUnreadNotificationCount(String username);
}
