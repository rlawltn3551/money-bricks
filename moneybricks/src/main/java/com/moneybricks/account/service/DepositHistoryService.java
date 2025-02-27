package com.moneybricks.account.service;

import com.moneybricks.account.dto.DepositHistoryDTO;
import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;

public interface DepositHistoryService {
    // 특정 계좌의 모든 입금 내역 조회
    PageResponseDTO<DepositHistoryDTO> getDepositHistory(PageRequestDTO pageRequestDTO, String username);

    // 현재 계좌의 입금 내역 조회
    PageResponseDTO<DepositHistoryDTO> getCurrentDepositHistory(PageRequestDTO pageRequestDTO, String username);
}
