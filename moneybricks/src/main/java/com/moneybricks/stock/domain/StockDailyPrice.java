package com.moneybricks.stock.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_daily_prices")
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StockDailyPrice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private StockGame game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private Integer day; // 몇 일차인지

    @Column(nullable = false)
    private Integer price; // 해당 알자의 주가

    @Column(length = 500)
    private String newsContent;

    @Column(nullable = false)
    private Double priceChangeRate; // 가격 변동률

}
