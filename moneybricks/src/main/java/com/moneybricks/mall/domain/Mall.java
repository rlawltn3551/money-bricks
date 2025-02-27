package com.moneybricks.mall.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Mall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long mallId;
    private String brand;
    private String productName;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int price;

    @Column(length = 2083)
    private String imageUrl;
}
