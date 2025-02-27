package com.moneybricks.stock.repository;

import com.moneybricks.stock.domain.Stock;
import com.moneybricks.stock.domain.StockDailyPrice;
import com.moneybricks.stock.domain.StockGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockDailyPriceRepository extends JpaRepository<StockDailyPrice, Integer> {

    @Query("SELECT p FROM StockDailyPrice p " +
            "JOIN FETCH p.game g " +
            "JOIN FETCH p.stock s " +
            "WHERE p.game = :game AND p.day = :day")
    List<StockDailyPrice> findByGameAndDay(@Param("game") StockGame game, @Param("day") Integer day);

    @Query("SELECT p FROM StockDailyPrice p " +
            "JOIN FETCH p.game g " +
            "JOIN FETCH p.stock s " +
            "WHERE p.game = :game AND p.stock = :stock " +
            "ORDER BY p.day ASC")
    List<StockDailyPrice> findByGameAndStock(@Param("game") StockGame game, @Param("stock") Stock stock);

    Optional<StockDailyPrice> findFirstByGameAndStockOrderByDayDesc(StockGame game, Stock stock);
}
