package com.moneybricks.account.repository;

import com.moneybricks.account.domain.DepositHistory;
import com.moneybricks.account.domain.SavingsAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface DepositHistoryRepository extends JpaRepository<DepositHistory, Long> {
    // username을 기준으로 입금 내역 조회 (엔티티 그래프 사용)
    @EntityGraph(attributePaths = {"savingsAccount", "savingsAccount.member"})
    Page<DepositHistory> findBySavingsAccountIdAndDepositDateGreaterThanEqual(Long id, LocalDateTime localDateTime, Pageable pageable);

    // username을 기준으로 입금 내역 조회 (엔티티 그래프 사용)
    @EntityGraph(attributePaths = {"savingsAccount", "savingsAccount.member"})
    Page<DepositHistory> findBySavingsAccountMemberUsername(String username, Pageable pageable);

    boolean existsBySavingsAccountAndDepositDateBetween(SavingsAccount savingsAccount, LocalDateTime depositDate, LocalDateTime depositDate2);
}
