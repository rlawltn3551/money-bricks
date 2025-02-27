package com.moneybricks.orders.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdersDTO {
    private Long oid;
    private Long memberId;
    private String productName;
    private String brand;
    private String imageUrl;
    private int price;
    private int quantity;
    private LocalDateTime createdAt;
}
