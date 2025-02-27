package com.moneybricks.account.service;

import com.moneybricks.account.domain.AccountHistory;
import com.moneybricks.account.domain.SavingsAccount;
import com.moneybricks.account.domain.SavingsAccountStatus;
import com.moneybricks.account.dto.AccountHistoryDTO;
import com.moneybricks.account.repository.AccountHistoryRepository;
import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Transactional
@RequiredArgsConstructor
@Service
public class AccountHistoryServiceImpl implements AccountHistoryService {
    private final AccountHistoryRepository accountHistoryRepository;
    
    // 특정 계좌의 모든 히스토리 목록 조회
    @Override
    public PageResponseDTO<AccountHistoryDTO> getAccountHistoryList(PageRequestDTO pageRequestDTO, String username) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by(Sort.Direction.DESC, "historyId"));

        Page<AccountHistory> result = accountHistoryRepository.findBySavingsAccountMemberUsername(username, pageable);

        List<AccountHistoryDTO> dtoList = result.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<AccountHistoryDTO> responseDTO = PageResponseDTO.<AccountHistoryDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    // 특정 히스토리 상세 조회
    @Override
    public AccountHistoryDTO getAccountHistory(Long historyId) {
        AccountHistory accountHistory = accountHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("해당 이력을 찾을 수 없습니다."));

        return mapToDTO(accountHistory);
    }

    // AccountHistory -> AccountHistoryDTO 변환
    private AccountHistoryDTO mapToDTO(AccountHistory accountHistory) {
        return AccountHistoryDTO.builder()
                .historyId(accountHistory.getHistoryId())
                .savingsAccountId(accountHistory.getSavingsAccount().getId())
                .accountNumber(accountHistory.getSavingsAccount().getAccountNumber())
                .previousMaturityPoints(accountHistory.getPreviousMaturityPoints())
                .previousInterestRate(accountHistory.getPreviousInterestRate())
                .previousDepositCount(accountHistory.getPreviousDepositCount())
                .previousStatus(String.valueOf(accountHistory.getPreviousStatus()))
                .previousStartDate(accountHistory.getPreviousStartDate())
                .previousEndDate(accountHistory.getPreviousEndDate())
                .build();
    }
}
