package com.moneybricks.attendance.repository;

import com.moneybricks.attendance.domain.Attendance;
import com.moneybricks.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByMemberAndCheckInDate(Member member, LocalDate today);

    long countByMemberAndCheckInDateBefore(Member member, LocalDate today);

    void deleteByCheckInDateBefore(LocalDate firstDayOfCurrentMonth);

    List<Attendance> findByMember(Member member);
}
