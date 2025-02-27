package com.moneybricks.point.domain;


import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "points_history", indexes = {
        @Index(name = "idx_points_id", columnList = "points_id"),
        @Index(name = "idx_action_type", columnList = "action_type"),
})
public class PointsHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "points_id", nullable = false)
    private Points points;  // 포인트 객체 참조

    @Column(name = "final_total_points", nullable = false)
    private Integer finalTotalPoints;  // 변화 이후 총 포인트

    @Column(name = "final_available_points", nullable = false)
    private Integer finalAvailablePoints;  // 변화 이후 사용 가능한 포인트

    @Column(name = "total_points_changed", nullable = false)
    private Integer totalPointsChanged;  // 총 포인트 변화량

    @Column(name = "available_points_changed", nullable = false)
    private Integer availablePointsChanged;  // 사용 가능 포인트 변화량

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private PointsActionType actionType;  // 포인트 변화 유형 (Enum)
}

