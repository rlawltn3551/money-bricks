package com.moneybricks.point.repository;

import com.moneybricks.member.domain.Member;
import com.moneybricks.point.domain.PointsHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointsHistoryRepository extends JpaRepository<PointsHistory, Integer> {
    @EntityGraph(attributePaths = {"points"})
    Page<PointsHistory> findByPointsMember(Member pointsMember, Pageable pageable);
}
