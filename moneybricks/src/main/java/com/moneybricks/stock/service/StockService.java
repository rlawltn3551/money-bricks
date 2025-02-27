package com.moneybricks.stock.service;

import com.moneybricks.stock.api.StockAPI;
import com.moneybricks.stock.components.StockConstants;
import com.moneybricks.stock.domain.Stock;
import com.moneybricks.stock.dto.StockDTO;
import com.moneybricks.stock.repository.StockRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final StockAPI stockAPI;

//    @Transactional
//    @PostConstruct
//    public void initializeStocks() {
//        stockRepository.deleteAll();
//
//        List<Stock> stocks = StockConstants.INDUSTRY_STOCKS.values()
//                .stream()
//                .flatMap(List::stream)
//                .map(stock -> Stock.of(
//                        stock.getCode(),
//                        stock.getName(),
//                        stock.getIndustry(),
//                        0)  // 초기 가격은 0으로 설정
//                )
//                .collect(Collectors.toList());
//
//        log.info("초기 주식 데이터 생성: {} 개", stocks.size());
//
//        // 각 주식의 현재가 업데이트
//        for (Stock stock : stocks) {
//            try {
//                BigDecimal currentPrice = stockAPI.getCurrentPrice(stock.getStockCode());
//                if (currentPrice != null && currentPrice.compareTo(BigDecimal.ZERO) > 0) {
//                    stock.updatePrice(currentPrice);
//                    log.info("주식 가격 업데이트 성공: {} ({}), 가격: {}",
//                            stock.getStockName(), stock.getStockCode(), currentPrice);
//                }
//                Thread.sleep(1000);
//            } catch (Exception e) {
//                log.error("주식 가격 업데이트 실패: {} ({})",
//                        stock.getStockName(), stock.getStockCode(), e);
//            }
//        }
//
//        List<Stock> savedStocks = stockRepository.saveAll(stocks);
//        stockRepository.flush();
//        log.info("주식 초기화 완료: 총 {}개 종목 저장됨", savedStocks.size());
//    }

    @Transactional
    public void updateAllStockPrices() {
        List<Stock> stocks = stockRepository.findAll();
        log.info("주식 가격 업데이트 시작: {}개 종목", stocks.size());

        for (Stock stock : stocks) {
            try {
                BigDecimal newPrice = stockAPI.getCurrentPrice(stock.getStockCode());

                if (newPrice != null && newPrice.compareTo(BigDecimal.ZERO) > 0) {
                    stock.updatePrice(newPrice);
                    stockRepository.save(stock);
                    log.info("가격 업데이트 완료: {} ({}): {}",
                            stock.getStockName(), stock.getStockCode(), newPrice);
                }

                Thread.sleep(2000);
            } catch (Exception e) {
                log.error("가격 업데이트 실패: {} ({}): {}",
                        stock.getStockName(), stock.getStockCode(), e.getMessage());
            }
        }
        log.info("전체 주식 가격 업데이트 완료");
    }

    public List<StockDTO> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(StockDTO::from)  // 정의된 from 메서드 사용
                .collect(Collectors.toList());
    }

    public List<StockDTO> getStockByIndustry(String industry) {
        return stockRepository.findByStockIndustry(industry).stream()
                .map(StockDTO::from)  // 정의된 from 메서드 사용
                .collect(Collectors.toList());
    }
}

