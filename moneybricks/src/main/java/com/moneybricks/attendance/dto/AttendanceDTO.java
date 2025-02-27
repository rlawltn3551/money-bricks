package com.moneybricks.attendance.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private LocalDate checkInDate;  // 출석 체크 날짜
}
