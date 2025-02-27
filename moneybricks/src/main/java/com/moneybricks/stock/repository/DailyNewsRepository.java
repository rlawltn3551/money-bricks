package com.moneybricks.stock.repository;

import com.moneybricks.stock.domain.DailyNews;
import com.moneybricks.stock.domain.StockGame;
import com.moneybricks.stock.dto.DailyNewsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyNewsRepository extends JpaRepository<DailyNews, Long> {
    Optional<DailyNews> findByGameAndDay(StockGame game, Integer day);

    @Query("SELECT new com.moneybricks.stock.dto.DailyNewsDTO(n.id, n.day, n.title, n.content, " +
            "n.marketImpact, n.priceImpact, n.isPositive, n.newsType, n.industry, n.relatedStocks) " +
            "FROM DailyNews n WHERE n.game.id = :gameId")
    List<DailyNewsDTO> findAllDTOsByGameId(@Param("gameId") Long gameId);

    List<DailyNews> findByGame(StockGame game);  // Collection<Object>를 List<DailyNews>로 수정
}