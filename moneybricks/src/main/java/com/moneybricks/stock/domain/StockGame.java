package com.moneybricks.stock.domain;

import com.moneybricks.common.domain.BaseEntity;
import com.moneybricks.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Slf4j
@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stock_games")
public class StockGame extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "initial_balance", nullable = false, columnDefinition = "BIGINT DEFAULT 5000000")
    private Long initialBalance = 5000000L;

    @Column(nullable = false)
    private Integer currentBalance; // 현재 보유 자금

    @Column(nullable = false)
    private Integer currentDay; // 현재 진행 턴 (20)

    @Column(nullable = false)
    private Boolean isCompleted; // 게임 완료 여부

    @Column(nullable = false)
    private Double totalReturn = 0.0; // 총 수익률

    @Column(nullable = false)
    private LocalDate lastRewardDate; // 마지막 보상 수령일

    @Column(nullable = false)
    private Integer earnedPoints; // 획득 포인트

    @Column(nullable = false)
    private Boolean pointsAwarded = false;

    @Builder(builderMethodName = "createGame")
    public static StockGame of(Member member) {
        return StockGame.builder()
                .member(member)
                .currentDay(1)
                .currentBalance(5000000)
                .totalReturn(0.0)
                .lastRewardDate(LocalDate.now().minusDays(1))  // 어제 날짜로 설정
                .pointsAwarded(false)
                .isCompleted(false)
                .earnedPoints(0)  // 초기화 추가
                .build();
    }

    public boolean canReceiveRewardToday() {
        if (lastRewardDate == null) return true;
        return !LocalDate.from(lastRewardDate).equals(LocalDate.now());
    }

    public void recordReward() {
        this.lastRewardDate = LocalDate.now();
    }

    public void updateBalance(int amount) {
        this.currentBalance += amount;
    }

    public void updateTotalReturn(double returnRate) {
        this.totalReturn = returnRate;
        log.info("Updated total return: {}", returnRate); // 로그 추가
    }

    public void setPointsAwarded(boolean pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    // 추가된 메서드들
    public void incrementDay() {
        this.currentDay = this.currentDay + 1;
    }

    public void setCompleted(boolean completed) {
        this.isCompleted = completed;
    }

    public void complete() {
        this.isCompleted = true;
    }

    public void addEarnedPoints(int points) {
        this.earnedPoints += points;
    }
}