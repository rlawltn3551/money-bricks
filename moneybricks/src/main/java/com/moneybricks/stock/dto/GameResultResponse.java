package com.moneybricks.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResultResponse {
    private boolean success;
    private String message;
    private GameResultDTO data;

    public static GameResultResponse of(boolean success, String message, GameResultDTO data) {
        return GameResultResponse.builder()
                .success(success)
                .message(message)
                .data(data)
                .build();
    }

    public static GameResultResponse success(GameResultDTO data) {
        return of(true, "게임 결과가 성공적으로 처리되었습니다.", data);
    }

    public static GameResultResponse error(String message) {
        return of(false, message, null);
    }
}