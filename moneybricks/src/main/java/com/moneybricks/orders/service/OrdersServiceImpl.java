package com.moneybricks.orders.service;

import com.moneybricks.mall.domain.Mall;
import com.moneybricks.mall.repository.MallRepository;
import com.moneybricks.member.domain.Member;
import com.moneybricks.member.dto.MemberDTO;
import com.moneybricks.member.repository.MemberRepository;
import com.moneybricks.notification.dto.NotificationCreateDTO;
import com.moneybricks.notification.service.NotificationService;
import com.moneybricks.orders.domain.Orders;
import com.moneybricks.orders.dto.OrdersDTO;
import com.moneybricks.orders.repository.OrdersRepository;
import com.moneybricks.point.domain.Points;
import com.moneybricks.point.domain.PointsActionType;
import com.moneybricks.point.domain.PointsHistory;
import com.moneybricks.point.repository.PointsHistoryRepository;
import com.moneybricks.point.repository.PointsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {

    private final OrdersRepository ordersRepository;
    private final MallRepository mallRepository;
    private final MemberRepository memberRepository;
    private final PointsRepository pointsRepository;
    private final PointsHistoryRepository pointsHistoryRepository;
    private final NotificationService notificationService;

    // 구매
    @Transactional
    @Override
    public OrdersDTO purchaseProduct(Long memberId, Long mallId, int quantity) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Mall product = mallRepository.findById(mallId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Points points = pointsRepository.findByMember(member);
        // 검증
        if (points == null || points.getAvailablePoints() < product.getPrice() * quantity) {
            throw new IllegalStateException("사용 가능한 포인트가 부족합니다.");
        }
        if (points.isLockedFlag()) {
            throw new IllegalStateException("포인트가 잠겨 있어 결제할 수 없습니다.");
        }

        int totalPrice = product.getPrice() * quantity;

        // 구매 시 포인트 차감
        points.changeTotalPoints(points.getTotalPoints() - totalPrice);
        points.changeAvailablePoints(points.getAvailablePoints() - totalPrice);

        // 히스토리 저장
        PointsHistory history = PointsHistory.builder()
                .points(points)
                .totalPointsChanged(-totalPrice)
                .availablePointsChanged(-totalPrice)
                .finalTotalPoints(points.getTotalPoints())
                .finalAvailablePoints(points.getAvailablePoints())
                .actionType(PointsActionType.PURCHASE)
                .build();
        pointsHistoryRepository.save(history);

        // 주문 정보 저장
        Orders orders = Orders.builder()
                .member(member)
                .mall(product)
                .price(totalPrice)
                .quantity(quantity)
                .build();
        ordersRepository.save(orders);

        // 알림 생성
        NotificationCreateDTO notificationCreateDto = NotificationCreateDTO.builder()
                .memberId(member.getId())
                .title("구매 완료!")
                .message("정상적으로 구매가 되었습니다.")
                .build();

        notificationService.createNotification(notificationCreateDto);  // 알림 생성 메소드 호출

        return new OrdersDTO(orders.getOid(),
                orders.getMember().getId(),
                orders.getMall().getProductName(),
                orders.getMall().getBrand(),
                orders.getMall().getImageUrl(),
                orders.getPrice(),
                orders.getQuantity(),
                orders.getCreatedAt());
    }

    // 주문 내역 조회
    @Transactional(readOnly = true)
    @Override
    public List<OrdersDTO> getOrdersHistory(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return ordersRepository.findByMemberOrderByCreatedAtDesc(member).stream()
                .map(orders -> new OrdersDTO(orders.getOid(),
                        orders.getMember().getId(),
                        orders.getMall().getProductName(),
                        orders.getMall().getBrand(),
                        orders.getMall().getImageUrl(),
                        orders.getPrice(),
                        orders.getQuantity(),
                        orders.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
