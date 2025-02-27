package com.moneybricks.stock.service;

import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.stock.domain.StockGame;
import com.moneybricks.stock.domain.StockRanking;
import com.moneybricks.stock.dto.StockRankingDTO;
import com.moneybricks.stock.repository.StockGameRepository;
import com.moneybricks.stock.repository.StockRankingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StockRankingService {

    private final StockRankingRepository stockRankingRepository;
    private final StockGameRepository stockGameRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void updateRanking(Long gameId) {
        StockGame game = stockGameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다."));

        // 게임이 완료된 경우에만 랭킹 업데이트
        if (!game.getIsCompleted()) {
            log.info("게임이 완료되지 않아 랭킹 업데이트를 건너뜁니다. gameId={}", gameId);
            return;
        }

        Member member = game.getMember();
        Double returnRate = game.getTotalReturn();

        log.info("게임 수익률(DB에서 조회): {}", returnRate);
        log.info("게임 정보 - 초기자금: {}, 현재잔액: {}, ID: {}",
                game.getInitialBalance(), game.getCurrentBalance(), game.getId());

        // 항상 새로운 랭킹으로 저장
        int newRankings = stockRankingRepository.calculateRanking(returnRate);
        log.info("계산된 랭킹 위치: {}", newRankings);

        // 새 랭킹 레코드 생성
        StockRanking newRanking = StockRanking.builder()
                .member(member)
                .returnRate(returnRate)
                .ranking(newRankings)
                .build();

        StockRanking savedRanking = stockRankingRepository.save(newRanking);
        log.info("새로운 랭킹 저장 완료 : 멤버 = {}, 수익률 = {}, 순위 = {}",
                member.getUsername(), returnRate, savedRanking.getRanking());
        log.info("저장된 랭킹 ID: {}, 수익률: {}", savedRanking.getId(), savedRanking.getReturnRate());

        // 다른 랭킹 순위도 업데이트
        updateAllRankings();
    }


    @Transactional
    public void updateAllRankings() {
        List<StockRanking> allRankings = stockRankingRepository.findAllByOrderByReturnRateDesc();

        // 랭킹 위치 업데이트
        for (int i = 0; i < allRankings.size(); i++) {
            StockRanking ranking = allRankings.get(i);
            ranking.updateRanking(i + 1);  // 랭킹 위치만 업데이트하는 메소드 추가
        }

        stockRankingRepository.saveAll(allRankings);  // 한 번에 저장
        log.info("전체 랭킹 순위 업데이트 완료: {}개", allRankings.size());
    }

    public List<StockRankingDTO> getTopRankings(int limit) {
        // 각 사용자의 최고 수익률만 포함하도록 수정
        List<StockRanking> topRankings = stockRankingRepository.findAllByOrderByReturnRateDesc()
                .stream()
                .limit(limit)
                .collect(Collectors.toList());

        return topRankings.stream()
                .map(StockRankingDTO::from)
                .collect(Collectors.toList());
    }

    public StockRankingDTO getBestMemberRanking(String username) {
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 해당 사용자의 최고 수익률 랭킹 조회
        return stockRankingRepository.findTopByMemberOrderByReturnRateDesc(member)
                .map(StockRankingDTO::from)
                .orElse(null);
    }

    public List<StockRankingDTO> getMemberRankingHistory(String username) {
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return stockRankingRepository.findByMemberOrderByReturnRateDesc(member)
                .stream()
                .map(ranking -> StockRankingDTO.from(ranking))
                .collect(Collectors.toList());
    }

}
