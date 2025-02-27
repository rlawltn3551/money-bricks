package com.moneybricks.stock.controller;

import com.moneybricks.stock.domain.DailyNews;
import com.moneybricks.stock.dto.DailyNewsDTO;
import com.moneybricks.stock.dto.NewsDTO;
import com.moneybricks.stock.service.StockGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Slf4j
public class NewsController {
    private final StockGameService stockGameService;


    @PostMapping("/{gameId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> saveDailyNews(@PathVariable Long gameId, @RequestBody NewsDTO newsDTO) {
        try {
            log.info("뉴스 저장 요청 : gameId ={}, news{}", gameId, newsDTO);
            stockGameService.saveDailyNews(gameId, newsDTO);
            log.info("뉴스 저장 완료");
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.warn("뉴스 저장 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("뉴스 저장 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("뉴스 저장 중 오류 발생");
        }
    }

    @GetMapping("/{gameId}/{day}")
    public ResponseEntity<?> getDailyNews(@PathVariable Long gameId, @PathVariable Integer day) {
        try {
            log.info("뉴스 조회 요청 : gameId ={}, day={}", gameId, day);
            DailyNews news = stockGameService.getDailyNews(gameId, day);

            log.info("뉴스 조회 완료 : newsId={}", news.getId());
            return ResponseEntity.ok(news);
        } catch (IllegalArgumentException e) {
            log.warn("게임 또는 뉴스를 찾을 수 없음 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("뉴스 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("뉴스 조회 중 오류 발생");
        }
    }

    @GetMapping("/{gameId}/history")
    public ResponseEntity<?> getNewsHistory(@PathVariable Long gameId) {
        try {
            log.info("뉴스 히스토리 조회 요청: gameId={}", gameId);
            List<DailyNewsDTO> dtoList = stockGameService.getAllGameNews(gameId);
            log.info("뉴스 히스토리 조회 완료: {}건", dtoList.size());
            return ResponseEntity.ok(dtoList);
        } catch (IllegalArgumentException e) {
            log.warn("뉴스 히스토리 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("뉴스 히스토리 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("뉴스 히스토리 조회 중 오류가 발생했습니다.");
        }
    }
}
