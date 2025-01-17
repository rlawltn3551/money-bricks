package com.moneybricks.product.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Product {

    @Id
    private String finPrdtCd; // 상품 코드 (PK)
    private String dclsMonth;
    private String finCoNo;
    private String korCoNm;
    private String finPrdtNm;
    private String joinWay;
    private String mtrtInt;
    private String spclCnd;
    private String joinDeny;
    private String joinMember;
    private String etcNote;
    private int maxLimit;
    private String dclsStrtDay;
    private String dclsEndDay;
    private String finCoSubmDay;

    @Enumerated(EnumType.STRING)
    private ProductType productType;
}
