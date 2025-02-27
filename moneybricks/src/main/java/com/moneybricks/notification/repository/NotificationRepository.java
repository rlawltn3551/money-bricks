package com.moneybricks.notification.repository;

import com.moneybricks.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByMemberUsername(String memberUsername);

    void deleteByMemberUsername(String username);

    Long countByMemberUsernameAndReadStatusFalse(String username);

    List<Notification> findByMemberUsernameOrderByCreatedAtDesc(String username);

    List<Notification> findByMemberUsernameAndCreatedAtBetweenOrderByCreatedAtDesc(String username, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Notification> findByMemberUsernameAndReadStatusFalseOrderByCreatedAtDesc(String username);

    List<Notification> findByMemberUsernameAndCreatedAtBetweenAndReadStatusFalseOrderByCreatedAtDesc(String username, LocalDateTime startDate, LocalDateTime endDate);
}
