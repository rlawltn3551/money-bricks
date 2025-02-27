package com.moneybricks.account.repository;

import com.moneybricks.account.domain.AccountHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountHistoryRepository extends JpaRepository<AccountHistory, Long> {
    // username을 기준으로 AccountHistory 조회 (엔티티 그래프 사용)
    @EntityGraph(attributePaths = {"savingsAccount", "savingsAccount.member"})
    Page<AccountHistory> findBySavingsAccountMemberUsername(String username, Pageable pageable);
}
