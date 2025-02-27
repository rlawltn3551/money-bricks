package com.moneybricks.moneynews.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MoneynewsDTO {
    private String title;
    private String description;
    private String originallink;
    private String pubDate;

    public void setTitle(String title) {
        this.title = title;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setOriginallink(String originallink) {
        this.originallink = originallink;
    }
    public void setPubDate(String pubDate) {
        this.pubDate = pubDate;
    }
}
