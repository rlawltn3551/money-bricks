package com.moneybricks.stock.dto;

import com.moneybricks.stock.domain.Stock;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class StockDTO {
    private String code;
    private String name;
    private String industry;
    private BigDecimal price;
    private LocalDateTime lastUpdate;
    private List<StockHoldingDTO> holdings;

    public static StockDTO from(Stock stock) {
        return StockDTO.builder()
                .code(stock.getStockCode())
                .name(stock.getStockName())
                .industry(stock.getIndustry())
                .price(BigDecimal.valueOf(stock.getStockPrice()))
                .build();
    }
}
