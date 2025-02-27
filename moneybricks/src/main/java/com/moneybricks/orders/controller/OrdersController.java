package com.moneybricks.orders.controller;

import com.moneybricks.member.dto.MemberDTO;
import com.moneybricks.orders.dto.OrdersDTO;
import com.moneybricks.orders.service.OrdersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrdersService ordersService;

    @PostMapping("/purchase")
    public ResponseEntity<OrdersDTO> purchaseProduct(@RequestParam Long memberId,
                                                     @RequestParam Long mallId,
                                                     @RequestParam int quantity) {
        log.info("상품 구매 요청 : memberId={}, mallId={}, quantity={}", memberId, mallId, quantity);
        OrdersDTO ordersDTO = ordersService.purchaseProduct(memberId, mallId, quantity);
        return ResponseEntity.ok(ordersDTO);
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrdersDTO>> getOrderHistory(@RequestParam Long memberId) {
        log.info("주문 내역 조회 요청 : memberId={}", memberId);

        List<OrdersDTO> ordersHistory = ordersService.getOrdersHistory(memberId);
        return ResponseEntity.ok(ordersHistory);
    }
}
