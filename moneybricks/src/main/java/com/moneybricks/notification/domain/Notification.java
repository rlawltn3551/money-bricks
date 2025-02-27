package com.moneybricks.notification.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notification")
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;  // 알림을 받는 사용자

    @Column(nullable = false)
    private String title;   // 알림 제목

    @Column(nullable = false)
    private String message; // 알림 내용

    @Column(nullable = false)
    private boolean readStatus; // 읽음 여부

    public void updateReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }
}
