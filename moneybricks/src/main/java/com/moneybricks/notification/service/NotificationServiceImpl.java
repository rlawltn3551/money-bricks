package com.moneybricks.notification.service;

import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.notification.domain.Notification;
import com.moneybricks.notification.dto.NotificationCreateDTO;
import com.moneybricks.notification.dto.NotificationResponseDTO;
import com.moneybricks.notification.dto.NotificationUpdateDTO;
import com.moneybricks.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Transactional
@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;

    // 알림 생성
    @Override
    public NotificationResponseDTO createNotification(NotificationCreateDTO notificationCreateDto) {
        Member member = memberRepository.findById(notificationCreateDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        Notification notification = Notification.builder()
                .member(member)
                .title(notificationCreateDto.getTitle())
                .message(notificationCreateDto.getMessage())
                .readStatus(false) // 기본값은 읽지 않음
                .build();

        notificationRepository.save(notification);

        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .readStatus(notification.isReadStatus())
                .createdAt(notification.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();

    }

    // 알림 조회 (회원별로 알림 목록 조회)
    @Override
    public List<NotificationResponseDTO> getNotifications(String username, LocalDateTime startDate, LocalDateTime endDate, Boolean isRead) {
        List<Notification> notifications;

        // 시간 범위가 없고, 읽음 상태 필터가 없는 경우
        if (startDate == null && endDate == null && isRead == null) {
            notifications = notificationRepository.findByMemberUsernameOrderByCreatedAtDesc(username);
        }
        // 시간 범위만 있는 경우
        else if (startDate != null && endDate != null && isRead == null) {
            notifications = notificationRepository.findByMemberUsernameAndCreatedAtBetweenOrderByCreatedAtDesc(username, startDate, endDate);
        }
        // 읽지 않은 알림만 필터링하는 경우
        else if (startDate == null && endDate == null) {
            notifications = notificationRepository.findByMemberUsernameAndReadStatusFalseOrderByCreatedAtDesc(username);
        }
        // 시간 범위와 읽음 상태를 모두 필터링하는 경우
        else {
            notifications = notificationRepository.findByMemberUsernameAndCreatedAtBetweenAndReadStatusFalseOrderByCreatedAtDesc(
                    username, startDate, endDate);
        }

        return notifications.stream()
                .map(notification -> NotificationResponseDTO.builder()
                        .id(notification.getId())
                        .memberId(notification.getMember().getId())
                        .title(notification.getTitle())
                        .message(notification.getMessage())
                        .createdAt(notification.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                        .readStatus(notification.isReadStatus())
                        .build())
                .collect(Collectors.toList());
    }

    // 알림 상태 업데이트 (읽음/안읽음 변경)
    @Override
    public void updateNotificationStatus(NotificationUpdateDTO notificationUpdateDto) {
        Notification notification = notificationRepository.findById(notificationUpdateDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("알림이 존재하지 않습니다."));

        notification.updateReadStatus(notificationUpdateDto.isReadStatus());
        notificationRepository.save(notification);
    }

    // 모든 알림 삭제
    @Override
    public void deleteAllNotifications(String username) {
        notificationRepository.deleteByMemberUsername(username);
    }

    // 선택적 알림 삭제
    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // 안 읽은 알림 개수 조회
    @Override
    public Long getUnreadNotificationCount(String username) {
        return notificationRepository.countByMemberUsernameAndReadStatusFalse(username);
    }
}
