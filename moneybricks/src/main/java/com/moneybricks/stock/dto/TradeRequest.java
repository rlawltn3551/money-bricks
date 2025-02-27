package com.moneybricks.stock.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TradeRequest {
    private String stockCode;
    private Integer quantity;
    private Boolean isBuy;
}
