package com.moneybricks.point.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.point.domain.Points;
import com.moneybricks.point.domain.PointsActionType;
import com.moneybricks.point.domain.PointsHistory;
import com.moneybricks.point.dto.PointsHistoryDTO;
import com.moneybricks.point.repository.PointsHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Transactional
@RequiredArgsConstructor
@Service
public class PointsHistoryServiceImpl implements PointsHistoryService {
    private final PointsHistoryRepository pointsHistoryRepository;
    private final MemberRepository memberRepository;

    // 특정 포인트의 변화 내역 조회
    @Override
    public PageResponseDTO<PointsHistoryDTO> getPointsHistory(PageRequestDTO pageRequestDTO, String username) {

        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<PointsHistory> result = pointsHistoryRepository.findByPointsMember(member, pageable);

        List<PointsHistoryDTO> dtoList = result.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<PointsHistoryDTO> responseDTO = PageResponseDTO.<PointsHistoryDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    private PointsHistoryDTO mapToDTO(PointsHistory pointsHistory) {
        return PointsHistoryDTO.builder()
                .id(pointsHistory.getId())
                .pointsId(pointsHistory.getPoints().getId())
                .finalTotalPoints(pointsHistory.getFinalTotalPoints())
                .finalAvailablePoints(pointsHistory.getFinalAvailablePoints())
                .totalPointsChanged(pointsHistory.getTotalPointsChanged())
                .availablePointsChanged(pointsHistory.getAvailablePointsChanged())
                .actionType(pointsHistory.getActionType().name())
                .createdAt(pointsHistory.getCreatedAt())
                .build();
    }

}
