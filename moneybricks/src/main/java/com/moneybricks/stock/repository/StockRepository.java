package com.moneybricks.stock.repository;

import com.moneybricks.stock.domain.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {
    Optional<Stock> findByStockCode(String stockCode);
    List<Stock> findByStockIndustry(String industry);

}
