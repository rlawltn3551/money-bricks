package com.moneybricks.attendance.service;

import com.moneybricks.attendance.domain.Attendance;
import com.moneybricks.attendance.dto.AttendanceDTO;
import com.moneybricks.attendance.repository.AttendanceRepository;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.notification.dto.NotificationCreateDTO;
import com.moneybricks.notification.service.NotificationService;
import com.moneybricks.point.domain.Points;
import com.moneybricks.point.domain.PointsActionType;
import com.moneybricks.point.domain.PointsHistory;
import com.moneybricks.point.repository.PointsHistoryRepository;
import com.moneybricks.point.repository.PointsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Transactional
@RequiredArgsConstructor
@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;
    private final PointsRepository pointsRepository;
    private final PointsHistoryRepository pointsHistoryRepository;
    private final NotificationService notificationService;

    // 출석 체크
    @Override
    public void checkIn(String username) {
        LocalDate today = LocalDate.now();

        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 오늘 출석 체크가 이미 되어 있는지 확인
        if (attendanceRepository.existsByMemberAndCheckInDate(member, today)) {
            throw new IllegalStateException("오늘은 이미 출석하셨습니다.");
        }

        // 출석 기록 추가
        Attendance attendance = Attendance.builder()
                .member(member)
                .checkInDate(today)
                .build();

        attendanceRepository.save(attendance);

        // 출석 체크 후 기본 포인트 지급
        Points points = pointsRepository.findByMember(member);

        int amount = 10; // 기본 포인트

        points.changeTotalPoints(points.getTotalPoints() + amount);
        points.changeAvailablePoints(points.getAvailablePoints() + amount);

        // 누적 출석 일수 계산
        long totalAttendanceDays = attendanceRepository.countByMemberAndCheckInDateBefore(member, today) + 1; // 오늘 포함

        // 누적 출석 일수에 따른 보너스 포인트 지급
        int bonus = giveBonusPoints(points, totalAttendanceDays);

        int total = amount + bonus;

        //포인트 히스토리 저장
        PointsHistory pointsHistory = PointsHistory.builder()
                .points(points)
                .finalTotalPoints(points.getTotalPoints() + total)
                .finalAvailablePoints(points.getAvailablePoints() + total)
                .availablePointsChanged(total)
                .totalPointsChanged(total)
                .actionType(PointsActionType.CHECK_IN)
                .build();

        pointsHistoryRepository.save(pointsHistory);

        // 알림 생성
        NotificationCreateDTO notificationCreateDto = NotificationCreateDTO.builder()
                .memberId(member.getId())
                .title("출석 체크!")
                .message("출석 체크가 완료되었습니다!")
                .build();

        notificationService.createNotification(notificationCreateDto);  // 알림 생성 메소드 호출
    }

    // 보너스 포인트 지급 로직
    private int giveBonusPoints(Points points, long totalAttendanceDays) {
        if (totalAttendanceDays == 5) {
            points.changeTotalPoints(points.getTotalPoints() + 50);
            points.changeAvailablePoints(points.getAvailablePoints() + 50); // 5일 출석 보너스 50포인트
            return 50;
        } else if (totalAttendanceDays == 10) {
            points.changeTotalPoints(points.getTotalPoints() + 100);
            points.changeAvailablePoints(points.getAvailablePoints() + 100); // 10일 출석 보너스 100포인트
            return 100;
        } else if (totalAttendanceDays == 15) {
            points.changeTotalPoints(points.getTotalPoints() + 150);
            points.changeAvailablePoints(points.getAvailablePoints() + 150); // 15일 출석 보너스 150포인트
            return 150;
        } else if (totalAttendanceDays == 20) {
            points.changeTotalPoints(points.getTotalPoints() + 200);
            points.changeAvailablePoints(points.getAvailablePoints() + 200); // 20일 출석 보너스 200포인트
            return 200;
        } else if (totalAttendanceDays == 25) {
            points.changeTotalPoints(points.getTotalPoints() + 250);
            points.changeAvailablePoints(points.getAvailablePoints() + 250); // 25일 출석 보너스 250포인트
            return 250;
        } else if (totalAttendanceDays == 30) {
            points.changeTotalPoints(points.getTotalPoints() + 300);
            points.changeAvailablePoints(points.getAvailablePoints() + 300); // 30일 출석 보너스 300포인트
            return 300;
        }
        return 0;
    }

    // 본인의 출석 기록 조회
    @Override
    public List<AttendanceDTO> getMyAttendanceRecords(String username) {
        Member member = memberRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 사용자의 출석 기록 가져오기
        List<Attendance> attendanceList = attendanceRepository.findByMember(member);

        // Attendance -> AttendanceDTO 변환
        return attendanceList.stream()
                .map(attendance -> new AttendanceDTO(attendance.getCheckInDate()))
                .collect(Collectors.toList());
    }

    // 매월 1일 출석 기록 초기화
    @Scheduled(cron = "0 0 0 1 * ?")
    @Override
    public void resetMonthlyAttendance() {
        LocalDate firstDayOfCurrentMonth = LocalDate.now().withDayOfMonth(1);
        attendanceRepository.deleteByCheckInDateBefore(firstDayOfCurrentMonth); // 이 날짜 이전의 기록 삭제
    }
}
