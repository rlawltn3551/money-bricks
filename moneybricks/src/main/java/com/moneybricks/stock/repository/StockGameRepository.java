package com.moneybricks.stock.repository;

import com.moneybricks.member.domain.Member;
import com.moneybricks.stock.domain.StockGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface StockGameRepository extends JpaRepository<StockGame, Long> {
    Optional<StockGame> findByMemberAndIsCompletedFalse(Member member);

    boolean existsByMemberAndIsCompletedTrueAndLastRewardDateAndPointsAwardedTrue(Member currentMember, LocalDate today);
}
