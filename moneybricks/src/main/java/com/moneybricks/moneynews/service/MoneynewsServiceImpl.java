package com.moneybricks.moneynews.service;

import com.moneybricks.moneynews.dto.MoneynewsDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoneynewsServiceImpl implements MoneynewsService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Page<MoneynewsDTO> getMoneyNews(String query, Pageable pageable, String sort) {

        if("경제".equals(query)) {
            query = "경제 경영 금리 주식 코인";
        }else if("청년".equals((query))){
            query = "청년 학생 알바 ";
        }else if("복지".equals(query)) {
            query = "지원 우대 지원금 보조금  우대 대출";
        }

        int page = pageable.getPageNumber() + 1; // Convert 0-based index to 1-based for API
        int size = pageable.getPageSize();
        int start = (page - 1) * size + 1;

        String apiUrl = "https://openapi.naver.com/v1/search/news.json?query=" + query + "&start=" + start + "&display=" + size + "&sort=" + sort;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", "_nNvaWbywJUp0n6QIN5F");
        headers.set("X-Naver-Client-Secret", "Xc6MbYzrNG");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);
        return parseResponse(response.getBody(),page,size);
    }

    private Page<MoneynewsDTO> parseResponse(String responseBody, int page, int size) {
        JSONObject jsonObject = new JSONObject(responseBody);

        int total = jsonObject.getInt("total");
        JSONArray items = jsonObject.getJSONArray("items");

        List<MoneynewsDTO> newsList = items.toList().stream().map(item -> {
                    JSONObject obj = new JSONObject((java.util.Map<?, ?>) item);
                    MoneynewsDTO news = new MoneynewsDTO();
                    news.setTitle(obj.getString("title"));
                    news.setDescription(obj.getString("description"));
                    news.setOriginallink(obj.getString("originallink"));
                    news.setPubDate(obj.getString("pubDate"));
                    return news;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(newsList, PageRequest.of(page - 1, size), total);
    }
}
