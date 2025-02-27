package com.moneybricks.stock.service;

import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.point.domain.Points;
import com.moneybricks.point.domain.PointsActionType;
import com.moneybricks.point.domain.PointsHistory;
import com.moneybricks.point.repository.PointsHistoryRepository;
import com.moneybricks.point.repository.PointsRepository;
import com.moneybricks.stock.domain.*;
import com.moneybricks.stock.dto.*;
import com.moneybricks.stock.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StockGameService {

    private final StockGameRepository stockGameRepository;
    private final StockHoldingRepository stockHoldingRepository;
    private final StockRepository stockRepository;
    private final PointsRepository pointsRepository;
    private final PointsHistoryRepository pointsHistoryRepository;
    private final MemberRepository memberRepository;
    private final StockDailyPriceRepository stockDailyPriceRepository;
    private final DailyNewsRepository dailyNewsRepository;
    private final StockRankingService stockRankingService;

    @Transactional
    public Optional<StockGame> getCurrentGame(String username) {

        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        return stockGameRepository.findByMemberAndIsCompletedFalse(member);
    }

    public StockGame startNewGame(String username) {

        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));
        // 기존 코드와 동일
        StockGame newGame = StockGame.builder()
                .member(member)
                .currentDay(1)
                .currentBalance(5000000)
                .initialBalance(5000000L)
                .earnedPoints(0)
                .totalReturn(0.0)
                .lastRewardDate(LocalDate.now())
                .isCompleted(false)
                .pointsAwarded(false)
                .build();

        return stockGameRepository.save(newGame);
    }

    private void updateGameReturn(StockGame game) {
        double totalValue = calculateTotalStockValue(game);
        double initialBalance = game.getInitialBalance();
        double returnRate = ((totalValue - initialBalance) / initialBalance) * 100;

        log.info("[updateGameReturn] 계산 요소 - 총자산: {}, 초기자금: {}", totalValue, initialBalance);
        log.info("수익률 계산 상세 정보:");
        log.info("총 자산 가치: {}", totalValue);
        log.info("초기 자금: {}", initialBalance);
        log.info("계산된 수익률: {}%", returnRate);

        // 업데이트 전 수익률
        log.info("수익률 업데이트 전: {}", game.getTotalReturn());
        game.updateTotalReturn(returnRate);
        log.info("수익률 업데이트 후: {}", game.getTotalReturn());

        stockGameRepository.save(game);

        // 저장 후 확인
        StockGame savedGame = stockGameRepository.findById(game.getId()).orElse(null);
        if (savedGame != null) {
            log.info("저장 후 DB에서 조회한 수익률: {}", savedGame.getTotalReturn());
        }
    }

    @Transactional
    public StockGameDTO nextDay(Long gameId) {
        try {
            StockGame game = stockGameRepository.findById(gameId)
                    .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));

            // 현재 일 증가
            game.incrementDay();
            log.info("게임 일자 증가: day={}", game.getCurrentDay());

            // 게임이 20일이 되면 종료
            if (game.getCurrentDay() >= 20) {
                log.info("게임 종료 조건 충족 (20일): gameId={}, day={}", game.getId(), game.getCurrentDay());

                // 먼저 수익률 계산 (공통)
                log.info("수익률 계산 전 정보 - 잔액: {}, 초기자금: {}",
                        game.getCurrentBalance(), game.getInitialBalance());
                updateGameReturn(game);
                log.info("[nextDay] 수익률 계산 직후: {}", game.getTotalReturn());
                log.info("게임 종료 시 최종 수익률: {}", game.getTotalReturn());

                // 게임 완료 처리를 포인트 지급 조건과 무관하게 항상 수행
                game.setCompleted(true);
                log.info("[nextDay] 게임 완료 처리 후: {}", game.getTotalReturn());

                // 변경사항 저장
                game = stockGameRepository.saveAndFlush(game);
                log.info("[nextDay] 저장 직후: gameId={}, 수익률={}, 완료여부={}",
                        game.getId(), game.getTotalReturn(), game.getIsCompleted());

                // 랭킹 업데이트 (공통)
                log.info("랭킹 업데이트 호출 전 게임 수익률: {}", game.getTotalReturn());
                stockRankingService.updateRanking(game.getId());

                // 포인트 지급 조건 확인을 위해 사용자의 최근 완료된 게임 조회
                Member currentMember = game.getMember();
                LocalDate today = LocalDate.now();

                // 오늘 날짜에 이미 포인트를 받은 게임이 있는지 확인
                boolean alreadyReceivedRewardToday = stockGameRepository.existsByMemberAndIsCompletedTrueAndLastRewardDateAndPointsAwardedTrue(
                        currentMember, today);

                log.info("오늘 이미 보상을 받았는지 확인: {}", alreadyReceivedRewardToday);

                // 포인트 지급 조건: 현재 게임에서 아직 포인트를 지급받지 않았고, 오늘 다른 게임에서도 포인트를 받지 않았어야 함
                boolean canAwardPoints = !game.getPointsAwarded() && !alreadyReceivedRewardToday;

                if(canAwardPoints) {
                    // 랭킹 업데이트 후 게임 정보 다시 확인
                    StockGame updatedGame = stockGameRepository.findById(game.getId()).orElse(null);
                    if (updatedGame != null) {
                        log.info("랭킹 업데이트 후 게임 수익률: {}", updatedGame.getTotalReturn());
                    }

                    // 포인트 계산은 랭킹 업데이트 후에
                    int points = (int) (game.getTotalReturn() / 5.0 * 300);
                    game.addEarnedPoints(points);
                    log.info("획득 포인트 계산: {}", points);

                    // 포인트 저장
                    Points userPoints = pointsRepository.findByMember(game.getMember());
                    if (userPoints == null) {
                        userPoints = Points.builder()
                                .member(game.getMember())
                                .totalPoints(0)
                                .availablePoints(0)
                                .savingsUsedPoints(0)
                                .lockedFlag(false)
                                .build();
                    }

                    userPoints.changeTotalPoints(userPoints.getTotalPoints() + points);
                    userPoints.changeAvailablePoints(userPoints.getAvailablePoints() + points);
                    log.info("포인트 저장 전: id={}, total={}", game.getId(), game.getTotalReturn());
                    pointsRepository.save(userPoints);
                    log.info("포인트 저장 완료: id={}", userPoints.getId());

                    // 포인트 히스토리 저장
                    PointsHistory history = PointsHistory.builder()
                            .points(userPoints)
                            .finalTotalPoints(userPoints.getTotalPoints())
                            .finalAvailablePoints(userPoints.getAvailablePoints())
                            .totalPointsChanged(points)
                            .availablePointsChanged(points)
                            .actionType(PointsActionType.GAME_REWARD)
                            .build();
                    pointsHistoryRepository.save(history);
                    log.info("포인트 히스토리 저장 완료");

                    // 포인트 지급 플래그 업데이트
                    game.setPointsAwarded(true);
                    game.recordReward();  // 오늘 날짜로 업데이트
                    game = stockGameRepository.save(game);
                } else {
                    log.info("포인트 지급 조건 미충족: 이미 지급됨={}, 오늘 보상 수령 가능={}",
                            game.getPointsAwarded(), game.canReceiveRewardToday());
                }

                // 마지막으로 주식 삭제 (공통)
                List<StockHolding> holdings = stockHoldingRepository.findByGame(game);
                log.info("삭제할 주식 보유 건수: {}", holdings.size());
                stockHoldingRepository.deleteAll(holdings);
                stockHoldingRepository.flush();
            } else {
                // 일반적인 날의 수익률 업데이트
                updateGameReturn(game);
                log.info("일반 게임 진행: day={}, 수익률={}", game.getCurrentDay(), game.getTotalReturn());
            }

            return convertToDTO(stockGameRepository.save(game));
        } catch (Exception e) {
            log.error("다음 날 처리 중 오류 발생", e);
            throw e;
        }
    }

    @Transactional
    public void executeTrade(Long gameId, TradeRequest request) {
        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));

        Stock stock = stockRepository.findByStockCode(request.getStockCode())
                .orElseThrow(() -> new IllegalArgumentException("주식을 찾을 수 없습니다."));

        int totalAmount = stock.getStockPrice() * request.getQuantity();

        if (request.getIsBuy()) {
            executeBuy(game, stock, request.getQuantity(), totalAmount);
        } else {
            executeSell(game, stock, request.getQuantity(), totalAmount);
        }

        updateGameReturn(game);
    }

    @Transactional
    protected void executeBuy(StockGame game, Stock stock, int quantity, int totalAmount) {
        log.info("Executing buy order - Stock: {}, Quantity: {}, Amount: {}",
                stock.getStockCode(), quantity, totalAmount);

        StockHolding holding = stockHoldingRepository
                .findByGameAndStock(game, stock)
                .orElseGet(() -> StockHolding.builder()
                        .game(game)
                        .stock(stock)
                        .quantity(0)
                        .averagePrice(0)
                        .build());

        log.info("Current holding - Quantity: {}, Average Price: {}",
                holding.getQuantity(), holding.getAveragePrice());

        // 새로운 평균 단가 계산
        int newQuantity = holding.getQuantity() + quantity;
        int totalValue = (holding.getQuantity() * holding.getAveragePrice())
                + (quantity * stock.getStockPrice());
        int newAveragePrice = totalValue / newQuantity;

        log.info("New values - Quantity: {}, Average Price: {}", newQuantity, newAveragePrice);

        holding.updateQuantity(newQuantity);
        holding.updateAveragePrice(newAveragePrice);
        stockHoldingRepository.save(holding);

        game.updateBalance(-totalAmount);  // 음수로 전달하여 잔액 차감
        log.info("현재 금액 업데이트 : {}", game.getCurrentBalance());
    }

    private void updateTotalReturn(StockGame game) {
        List<StockHolding> holdings = stockHoldingRepository.findByGame(game);

        double totalValue = game.getCurrentBalance() +
                holdings.stream()
                        .mapToDouble(h -> h.getQuantity() * h.getCurrentPrice())
                        .sum();

        double returnRate = ((totalValue - game.getInitialBalance()) / (double)game.getInitialBalance()) * 100;
        game.updateTotalReturn(returnRate);
    }

    private void executeSell(StockGame game, Stock stock, int quantity, int totalAmount) {
        StockHolding holding = stockHoldingRepository
                .findByGameAndStock(game, stock)
                .orElseThrow(() -> new IllegalStateException("보유하지 않은 주식입니다."));

        if (holding.getQuantity() < quantity) {
            throw new IllegalStateException("보유 수량이 부족합니다.");
        }

        int newQuantity = holding.getQuantity() - quantity;
        holding.updateQuantity(newQuantity);

        if (newQuantity == 0) {
            stockHoldingRepository.delete(holding);
        } else {
            stockHoldingRepository.save(holding);
        }

        game.updateBalance(totalAmount);
    }

    @Transactional
    public void processGameReward(Long gameId) {
        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));

        if (!game.canReceiveRewardToday()) {
            throw new IllegalStateException("오늘은 이미 보상을 받았습니다.");
        }

        int rewardPoints = calculateRewardPoints(game.getTotalReturn());

        Points points = pointsRepository.findByMember(game.getMember());
        if (points == null) {
            points = points.builder()
                    .member(game.getMember())
                    .totalPoints(0)
                    .availablePoints(0)
                    .savingsUsedPoints(0)
                    .lockedFlag(false)
                    .build();
        }

        log.info("포인트 = {}", points);
        log.info("포인트 저장 전: {}", points);
        log.info("포인트 저장 후: {}", points.getId());

        points.changeTotalPoints(points.getTotalPoints() + rewardPoints);
        points.changeAvailablePoints(points.getAvailablePoints() + rewardPoints);
        pointsRepository.save(points);

        PointsHistory history = PointsHistory.builder()
                .points(points)
                .finalTotalPoints(points.getTotalPoints())
                .finalAvailablePoints(points.getAvailablePoints())
                .totalPointsChanged(rewardPoints)
                .availablePointsChanged(rewardPoints)
                .actionType(PointsActionType.GAME_REWARD)
                .build();

        pointsHistoryRepository.save(history);

        game.recordReward();
        stockGameRepository.save(game);
    }


    private int calculateRewardPoints(double returnRate) {
        if (returnRate > 0) {
            return (int) (returnRate * 300);
        } else {
            return (int) (returnRate * 150);
        }
    }

    private int calculateNewAveragePrice(int oldQuantity, int oldPrice, int newQuantity, int newPrice) {
        int totalQuantity = oldQuantity + newQuantity;
        return (oldQuantity * oldPrice + newQuantity * newPrice) / totalQuantity;
    }


    private double calculateTotalStockValue(StockGame game) {
        List<StockHolding> holdings = stockHoldingRepository.findByGame(game);
        double stockValue = 0;

        for (StockHolding holding : holdings) {
            // 최신 가격 조회
            int currentPrice = stockDailyPriceRepository
                    .findFirstByGameAndStockOrderByDayDesc(holding.getGame(), holding.getStock())
                    .map(StockDailyPrice::getPrice)
                    .orElse(holding.getStock().getStockPrice());  // 없으면 기본 가격 사용

            stockValue += holding.getQuantity() * currentPrice;
        }

        log.info("총 주식 가치 : {}, 현재 보유 금액 : {}", stockValue, game.getCurrentBalance());
        return stockValue + game.getCurrentBalance();
    }

    public StockGameDTO convertToDTO(StockGame game) {
        if (game == null) {
            return null;
        }

        List<StockHolding> holdings = stockHoldingRepository.findByGame(game);

        return StockGameDTO.builder()
                .id(game.getId())
                .memberName(game.getMember().getUsername())
                .currentDay(game.getCurrentDay())
                .balance(game.getCurrentBalance())
                .totalReturn(game.getTotalReturn())
                .isCompleted(game.getIsCompleted())
                .earnedPoints(game.getEarnedPoints())
                .pointAwarded(game.getPointsAwarded())
                .holdings(holdings.stream()
                        .map(this::convertToHoldingDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private StockHoldingDTO convertToHoldingDTO(StockHolding holding) {
        log.info("Converting holding to DTO for stock: {}", holding.getStock().getStockCode());

        int averagePrice = holding.getAveragePrice();

        // 최신 가격 조회
        int currentPrice = stockDailyPriceRepository
                .findFirstByGameAndStockOrderByDayDesc(holding.getGame(), holding.getStock())
                .map(StockDailyPrice::getPrice)
                .orElse(holding.getStock().getStockPrice());  // 없으면 기본 가격 사용

        double returnRate = averagePrice > 0 ?
                ((double)(currentPrice - averagePrice) / averagePrice) * 100 : 0;

        log.info("Latest price found: {}", currentPrice);
        log.info("Average price: {}", averagePrice);
        log.info("Calculated return rate: {}", returnRate);

        return StockHoldingDTO.builder()
                .stockCode(holding.getStock().getStockCode())
                .stockName(holding.getStock().getStockName())
                .quantity(holding.getQuantity())
                .averagePrice(averagePrice)
                .currentPrice(currentPrice)
                .returnRate(returnRate)
                .build();
    }

    private double calculateReturnRate(StockHolding holding) {
        if (holding.getAveragePrice() == 0) return 0;
        return ((double) (holding.getStock().getStockPrice() - holding.getAveragePrice())
                / holding.getAveragePrice()) * 100;
    }

    //주가 가격 변동
    public void saveDailyPrices(StockGame game, int day, List<StockPriceDTO> prices) {
        prices.forEach(priceDTO -> {
            StockDailyPrice dailyPrice = StockDailyPrice.builder()
                    .game(game)
                    .stock(priceDTO.getStock())
                    .day(day)
                    .price(priceDTO.getPrice())
                    .priceChangeRate(priceDTO.getChangeRate())
                    .newsContent(priceDTO.getNewsContent())
                    .build();
            stockDailyPriceRepository.save(dailyPrice);
        });
    }

    public List<StockDailyPrice> getDailyPrices(Long gameId, int day) {

        StockGame stockGame = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));
        return stockDailyPriceRepository.findByGameAndDay(stockGame, day);
    }

    @Transactional(readOnly = true)
    public List<StockDailyPriceDTO> getStockPriceHistory(Long gameId, String stockCode) {
        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다 : " + gameId));

        Stock stock = stockRepository.findByStockCode(stockCode)
                .orElseThrow(() -> new IllegalArgumentException("주식을 찾을 수 없습니다." + stockCode));

        return stockDailyPriceRepository.findByGameAndStock(game, stock)
                .stream()
                .map(StockDailyPriceDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveDailyPrices(Long gameId, Map<String, Double> stockPrices, Map<String, Double> changeRates, int day) {
        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));

        List<StockDailyPrice> dailyPrices = stockPrices.entrySet().stream()
                .map(entry -> {
                    String stockCode = entry.getKey();
                    Stock stock = stockRepository.findByStockCode(stockCode)
                            .orElseThrow(() -> new IllegalArgumentException("주식을 찾을 수 없습니다"));

                    return StockDailyPrice.builder()
                            .game(game)
                            .stock(stock)
                            .day(day)
                            .price(entry.getValue().intValue())
                            .priceChangeRate(changeRates.get(stockCode))
                            .build();
                })
                .collect(Collectors.toList());

        stockDailyPriceRepository.saveAll(dailyPrices);
    }


    public DailyNews getDailyNews(Long gameId, int day) {
        StockGame stockGame = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다." + gameId));

        return dailyNewsRepository.findByGameAndDay(stockGame, day)
                .orElseThrow(() -> new RuntimeException("해당 일자의 뉴스를 찾을 수 없습니다."));
    }

    // 뉴스 저장
    @Transactional
    public void saveDailyNews(Long gameId, NewsDTO newsDTO) {
        log.info("뉴스 저장 시작 : gameId={}", gameId);

        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다." + gameId));

        DailyNews news = DailyNews.builder()
                .game(game)
                .day(game.getCurrentDay())
                .title(newsDTO.getTitle())
                .content(newsDTO.getContent())
                .marketImpact(newsDTO.getMarketImpact())
                .priceImpact(newsDTO.getPriceImpact())
                .isPositive(newsDTO.getIsPositive())
                .affectedStocks(newsDTO.getAffectedStocks())
                .newsType(newsDTO.getType())
                .industry(newsDTO.getIndustry())
                .relatedStocks(newsDTO.getRelatedStocks())
                .build();

        dailyNewsRepository.save(news);
        log.info("뉴스 저장 완료 : newsId={}", news.getId());
    }




    public List<DailyNewsDTO> getAllGameNews(Long gameId) {
        // 게임이 존재하는지 먼저 확인
        if (!stockGameRepository.existsById(gameId)) {
            throw new IllegalArgumentException("게임을 찾을 수 없습니다: " + gameId);
        }

        return dailyNewsRepository.findAllDTOsByGameId(gameId);
    }
}
