package com.moneybricks.stock.controller;

import com.moneybricks.stock.dto.StockRankingDTO;
import com.moneybricks.stock.service.StockRankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class StockRankingController {

    private final StockRankingService stockRankingService;

    @GetMapping("/top")
    public ResponseEntity<List<StockRankingDTO>> getTopRankings(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(stockRankingService.getTopRankings(limit));
    }

    @GetMapping("/my-ranking")
    public ResponseEntity<StockRankingDTO> getMyRanking(
            @RequestParam String username) {
        return ResponseEntity.ok(stockRankingService.getBestMemberRanking(username));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<StockRankingDTO>> getMyRankingHistory(
            @RequestParam String username) {
        return ResponseEntity.ok(stockRankingService.getMemberRankingHistory(username));
    }

}
