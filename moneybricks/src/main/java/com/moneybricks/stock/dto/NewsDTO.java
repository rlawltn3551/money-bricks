package com.moneybricks.stock.dto;

import com.moneybricks.stock.domain.DailyNews;
import com.moneybricks.stock.domain.StockGame;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {
    private Long id;
    private String title;
    private String content;
    private String marketImpact;
    private Double priceImpact;
    private Boolean isPositive;
    private List<String> affectedStocks;
    private String type;  // INDUSTRY, DOMESTIC, INTERNATIONAL
    private String industry;
    private String relatedStocks;

    // DB 엔티티로 변환하는 메서드
    public DailyNews toEntity(StockGame game, int day) {
        return DailyNews.builder()
                .game(game)
                .day(day)
                .title(title)
                .content(content)
                .marketImpact(marketImpact)
                .priceImpact(priceImpact)
                .isPositive(isPositive)
                .affectedStocks(affectedStocks)
                .newsType(type)
                .industry(industry)
                .relatedStocks(relatedStocks)
                .build();
    }

    // 엔티티를 DTO로 변환하는 정적 메서드
    public static NewsDTO fromEntity(DailyNews entity) {
        return NewsDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .marketImpact(entity.getMarketImpact())
                .priceImpact(entity.getPriceImpact())
                .isPositive(entity.getIsPositive())
                .affectedStocks(entity.getAffectedStocks())
                .type(entity.getNewsType())
                .industry(entity.getIndustry())
                .relatedStocks(entity.getRelatedStocks())
                .build();
    }
}