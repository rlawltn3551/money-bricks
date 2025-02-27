package com.moneybricks.stock.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stocks")
public class Stock extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String stockCode;

    @Column(nullable = false)
    private String stockName;

    @Column(nullable = false)
    private String stockIndustry;

    @Column(nullable = false)
    private Integer stockPrice;

    public void updatePrice(BigDecimal newPrice) {
        this.stockPrice = newPrice.intValue();
    }

    @Builder(builderMethodName = "createStock")
    public static Stock of(String code, String name, String industry, Integer price) {
        return Stock.builder()
                .stockCode(code)
                .stockName(name)
                .stockIndustry(industry)
                .stockPrice(price)
                .build();
    }

    public Stock(String code, String name, String industry) {
        this.stockCode = code;
        this.stockName = name;
        this.stockIndustry = industry;
    }

    public String getCode() { return stockCode; }
    public String getName() { return stockName; }
    public String getIndustry() { return stockIndustry; }

}
