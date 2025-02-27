package com.moneybricks.stock.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TransactionType {
    BUY("매수"),
    SELL("매도");

    private final String description;
}
