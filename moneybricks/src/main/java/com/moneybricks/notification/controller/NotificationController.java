package com.moneybricks.notification.controller;

import com.moneybricks.notification.dto.NotificationResponseDTO;
import com.moneybricks.notification.dto.NotificationUpdateDTO;
import com.moneybricks.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    // 알림 조회 (회원별, 시간 범위, 읽음 상태 필터링)
    @GetMapping
    public List<NotificationResponseDTO> getNotifications(
            Principal principal,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Boolean isRead) {

        String username = principal.getName();

        LocalDateTime startDateTime = (startDate != null) ?
                LocalDate.parse(startDate).atStartOfDay() : null;

        LocalDateTime endDateTime = (endDate != null) ?
                LocalDate.parse(endDate).atTime(LocalTime.MAX) : null;

        return notificationService.getNotifications(username, startDateTime, endDateTime, isRead);
    }


    // 알림 상태 업데이트 (읽음/안읽음)
    @PutMapping("/{id}/status")
    public void updateNotificationStatus(@PathVariable Long id, @RequestBody NotificationUpdateDTO notificationUpdateDto) {
        notificationUpdateDto.setId(id);
        notificationService.updateNotificationStatus(notificationUpdateDto);
    }

    // 모든 알림 삭제
    @DeleteMapping("/all")
    public void deleteAllNotifications(Principal principal) {
        String username = principal.getName();
        notificationService.deleteAllNotifications(username);
    }

    // 선택적 알림 삭제
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }

    // 안 읽은 알림 개수 조회
    @GetMapping("/unread-count")
    public long getUnreadNotificationCount(Principal principal) {
        String username = principal.getName();
        return notificationService.getUnreadNotificationCount(username);
    }
}
