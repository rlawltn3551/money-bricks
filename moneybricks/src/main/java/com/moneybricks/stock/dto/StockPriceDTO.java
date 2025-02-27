package com.moneybricks.stock.dto;

import com.moneybricks.stock.domain.Stock;
import com.moneybricks.stock.domain.StockDailyPrice;
import com.moneybricks.stock.domain.StockGame;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockPriceDTO {

    private Long id;
    private Stock stock;
    private Integer price;
    private Double changeRate;
    private String newsContent;

    public StockDailyPrice toEntity(StockGame game, int day) {
        return StockDailyPrice.builder()
                .game(game)
                .stock(stock)
                .day(day)
                .price(price)
                .priceChangeRate(changeRate)
                .newsContent(newsContent)
                .build();
    }

    public static StockPriceDTO fromEntity(StockDailyPrice entity) {
        return StockPriceDTO.builder()
                .id(entity.getId())
                .stock(entity.getStock())
                .price(entity.getPrice())
                .changeRate(entity.getPriceChangeRate())
                .newsContent(entity.getNewsContent())
                .build();
    }


}
