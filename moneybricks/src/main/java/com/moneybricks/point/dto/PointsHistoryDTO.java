package com.moneybricks.point.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointsHistoryDTO {
    private Long id;
    private Long pointsId;
    private Integer totalPointsChanged;  // 총 포인트 변화량
    private Integer availablePointsChanged;  // 사용 가능 포인트 변화량
    private Integer finalTotalPoints;  // 변화 후 총 포인트
    private Integer finalAvailablePoints;  // 변화 후 사용 가능 포인트
    private String actionType;
    private LocalDateTime createdAt;
}
