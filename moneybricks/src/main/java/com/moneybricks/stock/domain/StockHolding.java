package com.moneybricks.stock.domain;

import com.moneybricks.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stock_holdings")
public class StockHolding extends BaseEntity {

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
    private Integer quantity; // 보유 수량

    @Column(nullable = false)
    private Integer averagePrice; // 평균 매수가

    public void updateQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void updateAveragePrice(int newPrice) {
        this.averagePrice = newPrice;
    }

    public String getStockName() {
        return this.stock.getStockName();
    }

    public double calculateReturnRate() {
        if (this.averagePrice == 0) return 0;
        return ((double)(this.stock.getStockPrice() - this.averagePrice)) / this.averagePrice * 100;
    }

    public int getCurrentPrice() {
        return this.stock.getStockPrice();
    }
}
