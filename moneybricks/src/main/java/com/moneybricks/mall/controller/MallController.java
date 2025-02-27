package com.moneybricks.mall.controller;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.mall.dto.MallDTO;
import com.moneybricks.mall.service.MallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/mall")
public class MallController {

    private final MallService mallService;

    // 상품 전체 조회
    @GetMapping("/list")
    public PageResponseDTO<MallDTO> getlist(PageRequestDTO pageRequestDTO) {

        log.info("getlist");

        return mallService.getList(pageRequestDTO);
    }

    // 상품 상세 조회
    @GetMapping("/{mallId}")
    public MallDTO get(@PathVariable("mallId") Long mallId) {
        return mallService.getOne(mallId);
    }
}
