package com.moneybricks.stock.dto;

import com.moneybricks.stock.domain.StockRanking;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockRankingDTO {

    private String userName;
    private String userNickName;
    private Double returnRate;
    private Integer ranking;

    public static StockRankingDTO from(StockRanking rank) {
        return StockRankingDTO.builder()
                .userName(rank.getMember().getUsername())
                .userNickName(rank.getMember().getNickname())
                .returnRate(rank.getReturnRate())
                .ranking(rank.getRanking())
                .build();
    }
}
