package com.moneybricks.product.controller;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.product.domain.ProductType;
import com.moneybricks.product.dto.ProductDTO;
import com.moneybricks.product.service.ComparisonDepositService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/product")
public class ComparisonDepositController {

    private final ComparisonDepositService comparisonDepositService;

    @GetMapping("/list")
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO,
                                            @RequestParam(required = false) ProductType productType,
                                            @RequestParam(required = false) String sortOption) {

        log.info("PageRequestDTO : {}", pageRequestDTO);
        log.info("ProductType : {}", productType);
        log.info("Sort Option : {}", sortOption);

        // sortOption이 null이면 기본값을 설정하도록 할 수 있습니다.
        if (sortOption == null || sortOption.isEmpty()) {
            sortOption = "finPrdtCd"; // 기본 정렬 기준
        }

        return comparisonDepositService.list(pageRequestDTO, productType, sortOption);
    }

}
