package com.moneybricks.product.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // RestTemplate 빈 설정을 위한 config 클래스 생성
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
