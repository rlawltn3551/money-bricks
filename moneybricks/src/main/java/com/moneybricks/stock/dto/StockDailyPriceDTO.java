package com.moneybricks.stock.dto;


import com.moneybricks.stock.domain.StockDailyPrice;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockDailyPriceDTO {

    private Long id;
    private int day;
    private int price;
    private double priceChangeRate;
    private String stockCode;
    private String stockName;

    public static StockDailyPriceDTO from(StockDailyPrice entity) {
        return StockDailyPriceDTO.builder()
                .id(entity.getId())
                .day(entity.getDay())
                .price(entity.getPrice())
                .priceChangeRate(entity.getPriceChangeRate())
                .stockCode(entity.getStock().getStockCode())
                .stockName(entity.getStock().getStockName())
                .build();
    }
}
