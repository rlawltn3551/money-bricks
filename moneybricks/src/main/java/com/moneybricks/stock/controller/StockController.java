package com.moneybricks.stock.controller;

import com.moneybricks.stock.dto.StockDTO;
import com.moneybricks.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
@Slf4j
public class StockController {

    private final StockService stockService;

    @GetMapping
    public ResponseEntity<List<StockDTO>> getAllStocks() {
        log.info("주식 목록 조회");
        List<StockDTO> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{industry}")
    public ResponseEntity<List<StockDTO>> getStocksByIndustry(@PathVariable String industry) {
        log.info("업종별 주식 조회 : {}", industry);
        List<StockDTO> stocks = stockService.getStockByIndustry(industry);
        return ResponseEntity.ok(stocks);
    }
}
