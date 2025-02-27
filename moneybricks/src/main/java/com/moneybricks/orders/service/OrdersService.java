package com.moneybricks.orders.service;

import com.moneybricks.member.dto.MemberDTO;
import com.moneybricks.orders.dto.OrdersDTO;

import java.util.List;

public interface OrdersService {
    OrdersDTO purchaseProduct(Long memberId, Long mallId, int quantity);
    List<OrdersDTO> getOrdersHistory(Long memberId);
}
