package com.moneybricks.product.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.product.domain.Product;
import com.moneybricks.product.domain.ProductType;
import com.moneybricks.product.dto.ProductDTO;
import com.moneybricks.product.repository.ProductRepository;
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

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ComparisonDepositServiceImpl implements ComparisonDepositService {

    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;

    @Override
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO, ProductType productType, String sortOption) {
        // 정렬 옵션에 따른 Sort 설정
        Sort sort = Sort.by("finPrdtCd").descending();  // 기본 정렬은 "finPrdtCd"
        if ("bankName".equals(sortOption)) {
            sort = Sort.by("korCoNm").ascending();  // 은행명 기준 정렬
        } else if ("basicRate".equals(sortOption)) {
            sort = Sort.by("intrRate").descending();  // 기본 금리 기준 내림차순 정렬
        } else if ("maxRate".equals(sortOption)) {
            sort = Sort.by("intrRate2").descending();  // 최고 금리 기준 내림차순 정렬
        }

        Pageable pageable =
                PageRequest.of(
                        pageRequestDTO.getPage() - 1 ,  // 1페이지가 0이므로 주의
                        pageRequestDTO.getSize(),
                        sort);

        Page<Product> result = productType == null
                ? productRepository.findAll(pageable)
                : productRepository.findByProductType(productType, pageable);

        List<ProductDTO> dtoList = result.getContent().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<ProductDTO> responseDTO = PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }
}
