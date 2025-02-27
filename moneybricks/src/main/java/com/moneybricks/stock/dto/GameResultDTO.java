package com.moneybricks.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResultDTO {
    private Long gameId;
    private Double totalReturn;  // 최종 수익률
    private Integer earnedPoints;  // 획득한 포인트
    private RankingDTO ranking;  // 랭킹 정보
    private LocalDateTime completedAt;  // 게임 종료 시간

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankingDTO {
        private Integer rank;  // 현재 순위
        private Double percentile;  // 상위 퍼센트
    }
}