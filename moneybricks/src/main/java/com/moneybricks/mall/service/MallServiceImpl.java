package com.moneybricks.mall.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.mall.domain.Mall;
import com.moneybricks.mall.dto.MallDTO;
import com.moneybricks.mall.repository.MallRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Log4j2
@Service
public class MallServiceImpl implements MallService {

    private final MallRepository mallRepository;
    private final ModelMapper modelMapper;

    // 상품 전체 조회
    @Override
    public PageResponseDTO<MallDTO> getList(PageRequestDTO pageRequestDTO) {

            Pageable pageable =
                    PageRequest.of(
                            pageRequestDTO.getPage() - 1 ,  // 1페이지가 0이므로 주의
                            pageRequestDTO.getSize(),
                            Sort.by("mallId"));

            Page<Mall> result = mallRepository.findAll(pageable);

            List<MallDTO> dtoList = result.getContent().stream()
                    .map(this::mallToDTO)
                    .collect(Collectors.toList());

            long totalCount = result.getTotalElements();
            int totalPages = result.getTotalPages();
            boolean hasNext = pageRequestDTO.getPage() < totalPages;

            PageResponseDTO<MallDTO> responseDTO = PageResponseDTO.<MallDTO>withAll()
                    .dtoList(dtoList)
                    .pageRequestDTO(pageRequestDTO)
                    .totalCount(totalCount)
                    .build();

        try {
            java.lang.reflect.Field nextField = responseDTO.getClass().getDeclaredField("next");
            nextField.setAccessible(true);
            nextField.set(responseDTO, hasNext);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return responseDTO;
    }


    // 상품 상세 조회
    @Override
    public MallDTO getOne(Long id) {
        Mall mall = mallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mall not found"));
        return mallToDTO(mall);
    }

    private MallDTO mallToDTO(Mall mall) {
        MallDTO mallDTO = MallDTO.builder()
                .mallId(mall.getMallId())
                .brand(mall.getBrand())
                .price(mall.getPrice())
                .imageUrl(mall.getImageUrl())
                .productName(mall.getProductName())
                .build();

        return mallDTO;
    }
}
