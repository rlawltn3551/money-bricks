package com.moneybricks.moneynews.service;

import com.moneybricks.moneynews.dto.MoneynewsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MoneynewsService {
    Page<MoneynewsDTO> getMoneyNews(String query, Pageable pageable, String sort);
}
