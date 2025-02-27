package com.moneybricks.stock.repository;

import com.moneybricks.stock.domain.Stock;
import com.moneybricks.stock.domain.StockGame;
import com.moneybricks.stock.domain.StockHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockHoldingRepository extends JpaRepository<StockHolding, Long> {
    Optional<StockHolding> findByGameAndStock(StockGame game, Stock stock);
    List<StockHolding> findByGame(StockGame game);
}
