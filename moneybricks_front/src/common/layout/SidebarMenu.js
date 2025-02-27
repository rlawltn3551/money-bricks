import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../styles/SidebarMenu.scss";

const SidebarMenu = ({ menuItems }) => {
	const location = useLocation();

	const [openMenus, setOpenMenus] = useState(() => {
		const saved = localStorage.getItem('openMenus');
		return saved ? JSON.parse(saved) : [];
	});

	const [activeMenu, setActiveMenu] = useState(() => {
		const saved = localStorage.getItem('activeMenu');
		return saved ? JSON.parse(saved) : null;
	});

	// 토글 기능이 있는 메뉴 클릭 핸들러
	const handleMenuClick = (index) => {
		let newOpenMenus;
		if (openMenus.includes(index)) {
			// 이미 열려있으면 닫기
			newOpenMenus = openMenus.filter(item => item !== index);
		} else {
			// 닫혀있으면 열기
			newOpenMenus = [...openMenus, index];
		}
		setOpenMenus(newOpenMenus);
		localStorage.setItem('openMenus', JSON.stringify(newOpenMenus));

		setActiveMenu(index);
		localStorage.setItem('activeMenu', JSON.stringify(index));
	};

	// 현재 경로에 맞는 서브메뉴 항목이 활성화되어 있는지 확인
	const isSubItemActive = (link) => {
		return location.pathname === link;
	};

	return (
		<div className="sidebar-menu">
			{menuItems.map((item, index) => (
				<div key={item.label} className={`menu-item ${activeMenu === index ? 'active' : ''}`}>
					<h3 onClick={() => handleMenuClick(index)}>
						{item.label}
						<span className={`arrow ${openMenus.includes(index) ? 'open' : 'closed'}`}>
               {openMenus.includes(index) ? (
						<span className="arrow-up">▲</span>
					) : (
						<span className="arrow-down">▼</span>
					)}
             </span>
					</h3>
					<ul className={`submenu ${openMenus.includes(index) ? "open" : "closed"}`}>
						{item.subItems.map((subItem) => (
							<li key={subItem.label} className={isSubItemActive(subItem.link) ? 'active' : ''}>
								<Link to={subItem.link}>{subItem.label}</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default SidebarMenu;