package com.moneybricks.stock.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockHoldingDTO {

    private String stockCode;
    private String stockName;
    private Integer quantity;
    private Integer averagePrice;
    private Integer currentPrice;
    private Double returnRate;

}
