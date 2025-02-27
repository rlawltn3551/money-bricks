package com.moneybricks.point.controller;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.point.dto.PointsDTO;
import com.moneybricks.point.dto.PointsHistoryDTO;
import com.moneybricks.point.service.PointsHistoryService;
import com.moneybricks.point.service.PointsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;
    private final PointsHistoryService pointsHistoryService;

    // username을 기준으로 포인트 정보 조회
    @GetMapping("/info")
    public ResponseEntity<PointsDTO> getPointsByUsername(Principal principal) {
        String username = principal.getName();  // 현재 로그인한 사용자 이름 얻기
        PointsDTO pointsDTO = pointsService.getPointsByMember(username);
        return ResponseEntity.ok(pointsDTO);
    }

    // username을 기준으로 포인트 변화 내역 조회
    @GetMapping("/histories")
    public ResponseEntity<PageResponseDTO<PointsHistoryDTO>> getPointsHistory(PageRequestDTO pageRequestDTO, Principal principal) {
        String username = principal.getName();
        PageResponseDTO<PointsHistoryDTO> pointsHistoryList = pointsHistoryService.getPointsHistory(pageRequestDTO, username);
        return ResponseEntity.ok(pointsHistoryList);
    }
}
