package com.moneybricks.stock.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "daily_news")
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyNews extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private StockGame game;

    @Column(nullable = false)
    private Integer day;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private String marketImpact; // "매우 긍정적", "긍정적"

    @Column(nullable = false)
    private Double priceImpact; // 가격 영향도


    @Column(nullable = false)
    private Boolean isPositive;

    @ElementCollection
    @CollectionTable(name = "news_affected_stocks")
    private List<String> affectedStocks;

    private String newsType;

    private String industry;

    private String relatedStocks;
}
