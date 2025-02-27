package com.moneybricks.stock.controller;

import com.moneybricks.stock.domain.StockDailyPrice;
import com.moneybricks.stock.dto.StockDailyPriceDTO;
import com.moneybricks.stock.service.StockGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stockPrices")
@RequiredArgsConstructor
@Slf4j
public class StockPriceController {

    private final StockGameService stockGameService;

    @PostMapping("/{gameId}/{day}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> saveDailyPrices (
            @PathVariable Long gameId,
            @PathVariable Integer day,
            @RequestBody Map<String, Map<String, Double>> stockData) {
        try {
            log.info("일일 주가 요청 : gameId={}, day={}", gameId, day);
            stockGameService.saveDailyPrices(
                    gameId,
                    stockData.get("prices"),
                    stockData.get("changeRates"),
                    day
            );
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e ) {
            log.warn("주가 저장 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("주가 저장 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{gameId}/{day}")
    public ResponseEntity<?> getDailyPrices (
            @PathVariable Long gameId,
            @PathVariable Integer day) {
        try {
            log.info("일일 주가 조회 요청 : gameId={}, day={}", gameId, day);
            List<StockDailyPrice> prices = stockGameService.getDailyPrices(gameId, day);
            return ResponseEntity.ok(prices);
        } catch (IllegalArgumentException e ) {
            log.warn("주가 조회 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("주가 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주가 조회 중 오류 발생");
        }
    }

    @GetMapping("/{gameId}/history/{stockCode}")
    public ResponseEntity<?> getStockPriceHistory(
            @PathVariable Long gameId,
            @PathVariable String stockCode) {
        try {
            log.info("주가 히스토리 조회 요청: gameId={}, stockCode={}", gameId, stockCode);
            List<StockDailyPriceDTO> priceHistory =
                    stockGameService.getStockPriceHistory(gameId, stockCode);
            log.info("주가 히스토리 조회 완료: {}건", priceHistory.size());
            return ResponseEntity.ok(priceHistory);
        } catch (IllegalArgumentException e) {
            log.warn("게임 또는 주식을 찾을 수 없음: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("주가 히스토리 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주가 히스토리 조회 중 오류가 발생했습니다.");
        }
    }
}