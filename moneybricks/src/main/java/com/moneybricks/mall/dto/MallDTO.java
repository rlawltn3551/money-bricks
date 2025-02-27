package com.moneybricks.mall.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MallDTO {
    private Long mallId;
    private String brand;
    private String productName;
    private String imageUrl;
    private int price;
}
