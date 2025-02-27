import React from 'react';
import SidebarMenu from "../../common/layout/SidebarMenu";

const MyPageSideBarComponent = () => {

	// 메뉴 항목 정의
	const menuItems = [
		{
			label: 'MY 포인트 적금 계좌',  // 메뉴 제목
			subItems: [
				{
					label: '계좌 조회/변경',
					link: '/mypage/account',
				},
				{
					label: '포인트 입금',
					link: '/mypage/deposit',
				},
				{
					label: '입금 내역 확인',
					link: '/mypage/deposit-history/current/list',
				},
				{
					label: '이전 계좌 내역 확인',
					link: '/mypage/account-history/list',
				},
			],
		},
		{
			label: 'MY 포인트',  // 메뉴 제목
			subItems: [
				{
					label: '보유 포인트 조회',
					link: '/mypage/point',
				},
				{
					label: '포인트 내역 조회',
					link: '/mypage/point-history/list',
				},
			],
		},
		{
			label: 'MY 결제',  // 메뉴 제목
			subItems: [
				{
					label: '결제 내역 조회',
					link: '/mypage/orders',
				},
			],
		},
		{
			label: 'MY 정보',  // 메뉴 제목
			subItems: [
				{
					label: '개인정보확인/수정',
					link: '/mypage/edit-member',
				},
				{
					label: '비밀번호 변경',
					link: '/mypage/change-password',
				},
				{
					label: '회원 탈퇴',
					link: '/mypage/delete-account',
				},
			],
		},
		{
			label: 'MY 알림',  // 메뉴 제목
			subItems: [
				{
					label: '알림 내역 조회',
					link: '/mypage/notifications',
				},
			],
		},
	];

	return (
		<div className="mypage-sidebar">
			<SidebarMenu menuItems={menuItems} />
		</div>
	);
};

export default MyPageSideBarComponent;
