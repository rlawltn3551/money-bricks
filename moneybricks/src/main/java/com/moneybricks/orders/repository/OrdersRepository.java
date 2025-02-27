package com.moneybricks.orders.repository;

import com.moneybricks.member.domain.Member;
import com.moneybricks.orders.domain.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByMemberOrderByCreatedAtDesc(Member member);
}
