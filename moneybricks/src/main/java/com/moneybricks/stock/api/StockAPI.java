package com.moneybricks.stock.api;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;

@Component
public class StockAPI {
    private static final String API_KEY = "PSesBGBg3rb2qFonYfRD2EZ1oqSL9UaGl4MM";
    private static final String API_SECRET = "DeYnaz7SHnNABwaKGJm48ocV0ob6QkXTxsF71Goi8jSBGcbh9E86iooC7jAW+r+Mer6/IPeujBjsJn088EPKaspQo67FqcAl+YDKBDutS7+D1FMh0qfRf5MyoUTz097H13XsKAnqdKb+rf6l5g7KqwZ6ExF+m8nvloyJdgoaJYeX6X5G2RU=";
    private static final String BASE_URL = "https://openapivts.koreainvestment.com:29443";
    private static final String BEARER_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImYwYzdiMTg4LWEyNWQtNDRhYy1hNjU3LTQ3ZGE5NjEyN2ViMCIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTczOTQzNjk2MCwiaWF0IjoxNzM5MzUwNTYwLCJqdGkiOiJQU2VzQkdCZzNyYjJxRm9uWWZSRDJFWjFvcVNMOVVhR2w0TU0ifQ.2tqg0Jf2qbG3VWXlLHV3yyq2KEOhZFQEDP5BMWEpL9nE7mCa9l9c-4QidhwHhoqXx1pdt3ehRuCDhr0fRhtlKA";

    public BigDecimal getCurrentPrice(String stockCode) {
        try {
            String data = "?fid_cond_mrkt_div_code=J&fid_input_iscd=" + stockCode;
            URL url = new URL(BASE_URL + "/uapi/domestic-stock/v1/quotations/inquire-price" + data);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("authorization", "Bearer " + BEARER_TOKEN);
            conn.setRequestProperty("appkey", API_KEY);
            conn.setRequestProperty("appsecret", API_SECRET);
            conn.setRequestProperty("tr_id", "FHKST01010100");

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                String response = readResponse(conn.getInputStream());
                JSONObject json = new JSONObject(response);
                return new BigDecimal(json.getJSONObject("output").getString("stck_prpr"));
            }

            return BigDecimal.ZERO;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get stock price: " + e.getMessage());
        }
    }

    private String readResponse(InputStream stream) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(stream))) {
            return br.readLine();
        }
    }
}