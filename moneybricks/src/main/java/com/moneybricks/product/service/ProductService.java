package com.moneybricks.product.service;

import com.moneybricks.product.domain.Product;
import com.moneybricks.product.domain.ProductType;
import com.moneybricks.product.repository.ProductRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;

    public ProductService(ProductRepository productRepository, RestTemplate restTemplate) {
        this.productRepository = productRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public List<Product> fetchAndSaveProducts(String apiUrl, ProductType productType) {
        // API 호출
        Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);

        // JSON 파싱
        List<Map<String, Object>> productDataList = (List<Map<String, Object>>) ((Map<String, Object>) response.get("result")).get("baseList");

        // 엔티티 변환 및 저장
        List<Product> deposits = new ArrayList<>();
        for (Map<String, Object> data : productDataList) {
            Product deposit = new Product();
            deposit.setDclsMonth((String) data.get("dcls_month"));
            deposit.setFinCoNo((String) data.get("fin_co_no"));
            deposit.setFinPrdtCd((String) data.get("fin_prdt_cd"));
            deposit.setKorCoNm((String) data.get("kor_co_nm"));
            deposit.setFinPrdtNm((String) data.get("fin_prdt_nm"));
            deposit.setJoinWay((String) data.get("join_way"));
            deposit.setMtrtInt((String) data.get("mtrt_int"));
            deposit.setSpclCnd((String) data.get("spcl_cnd"));
            deposit.setJoinDeny((String) data.get("join_deny"));
            deposit.setJoinMember((String) data.get("join_member"));
            deposit.setEtcNote((String) data.get("etc_note"));
//            deposit.setMaxLimit(Integer.parseInt(String.valueOf((Integer) data.get("max_limit"))));
            deposit.setDclsStrtDay((String) data.get("dcls_strt_day"));
            deposit.setDclsEndDay((String) data.get("dcls_end_day"));
            deposit.setFinCoSubmDay((String) data.get("fin_co_subm_day"));
            deposit.setProductType(productType); // 예금/적금 구분

            // spcl_cnd 길이 제한
            String spclCnd = (String) data.get("spcl_cnd");
            if (spclCnd != null && spclCnd.length() > 255) {
                spclCnd = spclCnd.substring(0, 255);
            }
            deposit.setSpclCnd(spclCnd);

            deposits.add(deposit);
        }
        return productRepository.saveAll(deposits);
    }
}
