package com.moneybricks.attendance.controller;

import com.moneybricks.attendance.dto.AttendanceDTO;
import com.moneybricks.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    // 출석 체크 API
    @PostMapping("/check-in")
    public ResponseEntity<String> checkIn(Principal principal) {
        String username = principal.getName();
        attendanceService.checkIn(username);
        return ResponseEntity.ok("출석 체크 완료!");
    }

    // 출석 체크 기록 조회 API
    @GetMapping("/my-record")
    public ResponseEntity<List<AttendanceDTO>> getMyAttendanceRecord(Principal principal) {
        String username = principal.getName();
        List<AttendanceDTO> attendanceRecords = attendanceService.getMyAttendanceRecords(username);
        return ResponseEntity.ok(attendanceRecords);
    }

    // 월초에 출석 기록 초기화는 자동으로 @Scheduled로 처리되므로 API는 필요하지 않습니다.
}

