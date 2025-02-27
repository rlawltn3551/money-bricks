package com.moneybricks.moneynews.controller;

import com.moneybricks.moneynews.dto.MoneynewsDTO;
import com.moneybricks.moneynews.service.MoneynewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moneynews")
@RequiredArgsConstructor
public class MoneynewsController {

    private final MoneynewsService newsService;

    @GetMapping
    public ResponseEntity<Page<MoneynewsDTO>> getMoneyNews(@RequestParam String query,
                                                           @RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(defaultValue = "date")String sort) {
        PageRequest pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, sort));
        Page<MoneynewsDTO> newsList = newsService.getMoneyNews(query, pageable, sort);
        return ResponseEntity.ok(newsList);
    }
}
