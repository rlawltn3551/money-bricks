package com.moneybricks.stock.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StockGameDTO {

    private Long id;
    private String memberName;
    private Integer currentDay;
    private Integer balance;
    private Double totalReturn;
    private Boolean isCompleted;
    private Integer earnedPoints;
    private Boolean pointAwarded;
    private List<StockHoldingDTO> holdings;
}
