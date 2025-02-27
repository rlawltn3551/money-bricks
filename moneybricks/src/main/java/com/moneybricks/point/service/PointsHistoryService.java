package com.moneybricks.point.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.point.dto.PointsHistoryDTO;


public interface PointsHistoryService {

    // 특정 포인트의 변화 내역 조회
    PageResponseDTO<PointsHistoryDTO> getPointsHistory(PageRequestDTO pageRequestDTO, String username);
}
