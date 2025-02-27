package com.moneybricks.account.controller;

import com.moneybricks.account.dto.DepositHistoryDTO;
import com.moneybricks.account.service.DepositHistoryServiceImpl;
import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/deposits")
@RequiredArgsConstructor
public class DepositHistoryController {

    private final DepositHistoryServiceImpl depositHistoryService;

    // 특정 username의 모든 입금 내역 조회
    @GetMapping("/history")
    public ResponseEntity<PageResponseDTO<DepositHistoryDTO>> getDepositHistory(PageRequestDTO pageRequestDTO, Principal principal) {
        String username = principal.getName();
        PageResponseDTO<DepositHistoryDTO> depositHistory = depositHistoryService.getDepositHistory(pageRequestDTO,username);
        return ResponseEntity.ok(depositHistory);
    }

    // 특정 username의 입금 내역 (startDate 부터) 조회
    @GetMapping("/current-history")
    public ResponseEntity<PageResponseDTO<DepositHistoryDTO>> getCurrentDepositHistory(PageRequestDTO pageRequestDTO, Principal principal) {
        String username = principal.getName();
        PageResponseDTO<DepositHistoryDTO> currentDepositHistory = depositHistoryService.getCurrentDepositHistory(pageRequestDTO, username);
        return ResponseEntity.ok(currentDepositHistory);
    }
}
