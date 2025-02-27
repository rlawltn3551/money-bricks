package com.moneybricks.mall.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.mall.dto.MallDTO;

public interface MallService {
    MallDTO getOne(Long mallId);
    PageResponseDTO<MallDTO> getList(PageRequestDTO pageRequestDTO);
}
