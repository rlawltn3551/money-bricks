package com.moneybricks.attendance.service;

import com.moneybricks.attendance.dto.AttendanceDTO;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

public interface AttendanceService {
    // 출석 체크
    void checkIn(String username);

    // 본인의 출석 기록 조회
    List<AttendanceDTO> getMyAttendanceRecords(String username);

    // 매월 1일 출석 기록 초기화
    @Scheduled(cron = "0 0 0 1 * ?") // 매월 1일 0시 0분에 실행
    void resetMonthlyAttendance();
}
