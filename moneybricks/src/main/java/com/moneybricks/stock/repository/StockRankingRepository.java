package com.moneybricks.stock.repository;

import com.moneybricks.member.domain.Member;
import com.moneybricks.stock.domain.StockRanking;
import com.moneybricks.stock.dto.StockRankingDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public interface StockRankingRepository extends JpaRepository<StockRanking, Long> {

    List<StockRanking> findAllByOrderByReturnRateDesc();

    Optional<StockRanking> findByMember(Member member);

    @Query("SELECT MAX(r.returnRate) FROM StockRanking r")
    Optional<Double> findHighestReturnRate();

    @Query("SELECT COUNT(r) + 1 FROM StockRanking r WHERE r.returnRate > :returnRate")
    int calculateRanking(@Param("returnRate") Double returnRate);

    @Query("SELECT r FROM StockRanking r WHERE r.id IN" +
            "(SELECT MAX(sr.id) FROM StockRanking sr GROUP BY sr.member)" +
            "ORDER BY r.returnRate DESC")

    List<Object[]> findTopRankingsByReturnRate(Pageable pageable);

    default List<Object[]> findTopRankingsByReturnRate(int limit) {
        return findTopRankingsByReturnRate(PageRequest.of(0, limit));
    }

    Optional<StockRanking> findTopByMemberOrderByReturnRateDesc(Member member);

    List<StockRanking> findByMemberOrderByReturnRateDesc(Member member);

}
