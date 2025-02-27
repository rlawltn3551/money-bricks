package com.moneybricks.stock.dto;


import com.moneybricks.stock.domain.DailyNews;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyNewsDTO {

    private Long id;
    private Integer day;
    private String title;
    private String content;
    private String marketImpact;
    private Double priceImpact;
    private Boolean isPositive;
    private List<String> affectedStocks;
    private String type;
    private String industry;
    private String relatedStocks;


    // JPQL 생성자 추가
    public DailyNewsDTO(Long id, Integer day, String title, String content,
                        String marketImpact, Double priceImpact, Boolean isPositive,
                        String newsType, String industry, String relatedStocks) {
        this.id = id;
        this.day = day;
        this.title = title;
        this.content = content;
        this.marketImpact = marketImpact;
        this.priceImpact = priceImpact;
        this.isPositive = isPositive;
        this.type = newsType;
        this.industry = industry;
        this.relatedStocks = relatedStocks;
    }

    // 엔티티를 DTO로 변환하는 정적 메서드
    public static DailyNewsDTO from(DailyNews entity) {
        return DailyNewsDTO.builder()
                .id(entity.getId())
                .day(entity.getDay())
                .title(entity.getTitle())
                .content(entity.getContent())
                .marketImpact(entity.getMarketImpact())
                .priceImpact(entity.getPriceImpact())
                .isPositive(entity.getIsPositive())
                .type(entity.getNewsType())
                .industry(entity.getIndustry())
                .relatedStocks(entity.getRelatedStocks())
                .build();
    }
}
