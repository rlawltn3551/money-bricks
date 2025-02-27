package com.moneybricks.stock.controller;

import com.moneybricks.stock.domain.Stock;
import com.moneybricks.stock.domain.StockGame;
import com.moneybricks.stock.dto.StockGameDTO;
import com.moneybricks.stock.dto.TradeRequest;
import com.moneybricks.stock.repository.StockHoldingRepository;
import com.moneybricks.stock.repository.StockRepository;
import com.moneybricks.stock.service.StockGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/stockGame")
@RequiredArgsConstructor
@Slf4j
public class StockGameController {

    private final StockGameService stockGameService;
    private final StockRepository stockRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getGameData(Principal principal) {
        String username = principal.getName();
        try {
            log.info("게임 데이터 조회 요청: username={}", username);
            Optional<StockGame> existingGame = stockGameService.getCurrentGame(username);

            StockGame game = existingGame.orElseGet(() -> {
                log.info("진행 중인 게임이 없어 새 게임을 시작합니다. username={}", username);
                return stockGameService.startNewGame(username);
            });

            StockGameDTO gameDTO = stockGameService.convertToDTO(game);
            log.info("게임 데이터 조회 완료: gameId={}, currentDay={}", game.getId(), game.getCurrentDay());
            return ResponseEntity.ok(gameDTO);
        } catch (Exception e) {
            log.error("게임 데이터 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게임 데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }

    @PostMapping
    public ResponseEntity<?> startNewGame(Principal principal) {
        String username = principal.getName();
        try {
            log.info("새 게임 시작 요청: username={}", username);
            StockGame game = stockGameService.startNewGame(username);
            StockGameDTO gameDTO = stockGameService.convertToDTO(game);
            log.info("새 게임 시작 완료: gameId={}", game.getId());
            return ResponseEntity.ok(gameDTO);
        } catch (Exception e) {
            log.error("새 게임 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("새 게임을 시작하는 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/{gameId}/trade")
    public ResponseEntity<?> trade(@PathVariable Long gameId, @RequestBody TradeRequest request) {
        try {
            log.info("거래 요청 정보: gameId={}, stockCode={}, quantity={}, isBuy={}",
                    gameId, request.getStockCode(), request.getQuantity(), request.getIsBuy());

            // Stock 조회 로그 추가
            Stock stock = stockRepository.findByStockCode(request.getStockCode())
                    .orElseThrow(() -> {
                        log.error("주식 코드로 Stock 엔티티를 찾을 수 없음: {}", request.getStockCode());
                        return new IllegalArgumentException("해당 주식 코드의 Stock을 찾을 수 없습니다.");
                    });

            log.info("조회된 Stock 정보: id={}, stockCode={}", stock.getId(), stock.getStockCode());

            stockGameService.executeTrade(gameId, request);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            log.error("거래 상태 오류: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 처리 중 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("거래 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/{gameId}/reward")
    public ResponseEntity<?> claimDailyReward(@PathVariable Long gameId) {
        try {
            log.info("일일 보상 요청: gameId={}", gameId);
            stockGameService.processGameReward(gameId);
            log.info("일일 보상 지급 완료");
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            log.warn("보상 지급 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("보상 처리 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("보상 처리 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/{gameId}/nextDay")
    public ResponseEntity<?> nextDay(@PathVariable Long gameId) {
        try {
            log.info("다음 날 진행 요청: gameId={}", gameId);
            StockGameDTO updatedGame = stockGameService.nextDay(gameId);
            log.info("다음 날 진행 완료: currentDay={}, isCompleted={}",
                    updatedGame.getCurrentDay(), updatedGame.getIsCompleted());
            return ResponseEntity.ok(updatedGame);
        } catch (IllegalStateException e) {
            log.warn("다음 날 진행 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("다음 날 진행 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("다음 날 진행 중 오류가 발생했습니다.");
        }
    }



}