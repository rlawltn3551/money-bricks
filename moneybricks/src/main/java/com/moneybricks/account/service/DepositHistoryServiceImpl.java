package com.moneybricks.account.service;

import com.moneybricks.account.domain.DepositHistory;
import com.moneybricks.account.domain.SavingsAccount;
import com.moneybricks.account.dto.DepositHistoryDTO;
import com.moneybricks.account.repository.DepositHistoryRepository;
import com.moneybricks.account.repository.SavingsAccountRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Transactional
@RequiredArgsConstructor
@Service
public class DepositHistoryServiceImpl implements DepositHistoryService {

    private final DepositHistoryRepository depositHistoryRepository;
    private final SavingsAccountRepository savingsAccountRepository;
    
    // 특정 계좌의 모든 입금 내역 조회
    @Override
    public PageResponseDTO<DepositHistoryDTO> getDepositHistory(PageRequestDTO pageRequestDTO, String username) {

        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<DepositHistory> result = depositHistoryRepository.findBySavingsAccountMemberUsername(username, pageable);

        return createPageResponseDTO(result, pageRequestDTO);
    }

    // 현재 계좌의 입금 내역 조회
    @Override
    public PageResponseDTO<DepositHistoryDTO> getCurrentDepositHistory(PageRequestDTO pageRequestDTO, String username) {

        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() -1, pageRequestDTO.getSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        SavingsAccount currentAccount = savingsAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("해당 계좌를 찾을 수 없습니다."));

        // 현재 계좌의 startDate 이후로 이루어진 입금 내역만 조회
        LocalDate startDate = currentAccount.getStartDate();

        // 페이징 적용하여 조회 (startDate 포함)
        Page<DepositHistory> result = depositHistoryRepository
                .findBySavingsAccountIdAndDepositDateGreaterThanEqual(currentAccount.getId(), startDate.atStartOfDay(), pageable);

        return createPageResponseDTO(result, pageRequestDTO);
    }

    // DepositHistory 객체를 DepositHistoryDTO로 변환
    private DepositHistoryDTO mapToDTO(DepositHistory depositHistory) {
        return DepositHistoryDTO.builder()
                .id(depositHistory.getId())
                .savingsAccountId(depositHistory.getSavingsAccount().getId())
                .accountNumber(depositHistory.getSavingsAccount().getAccountNumber())
                .depositDate(depositHistory.getDepositDate())
                .depositAmount(depositHistory.getDepositAmount())
                .balanceAfterDeposit(depositHistory.getBalanceAfterDeposit())
                .depositCount(depositHistory.getSavingsAccount().getDepositCount())
                .build();
    }

    // Page<DepositHistory>를 받아서 PageResponseDTO<DepositHistoryDTO>를 생성하는 메소드
    private PageResponseDTO<DepositHistoryDTO> createPageResponseDTO(Page<DepositHistory> result, PageRequestDTO pageRequestDTO) {
        List<DepositHistoryDTO> dtoList = result.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<DepositHistoryDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }
}
