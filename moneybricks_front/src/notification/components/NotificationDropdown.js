import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, X} from 'lucide-react';
import {
	getNotifications,
	updateNotificationStatus,
	deleteNotification,
	deleteAllNotifications
} from '../api/notificationApi'
import '../styles/NotificationDropdown.scss';
import LoadingSpinner from "../../common/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../common/components/CustomModal";

const NotificationDropdown = ({ unreadCount, setUnreadCount }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [expandedNotificationId, setExpandedNotificationId] = useState(null);
	const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchNotifications();
		}
	}, [isOpen]);

	const openDeleteAllModal = () => setIsDeleteAllModalOpen(true);
	const closeDeleteAllModal = () => setIsDeleteAllModalOpen(false);

	const fetchNotifications = async () => {
		setIsLoading(true);
		try {
			const endDate = new Date(); // 오늘 날짜
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - 6); // 6일 전으로 설정

			// 날짜를 "yyyy-MM-dd" 형식으로 변환
			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');

				return `${year}-${month}-${day}`;
			};

			const startDateStr = formatDate(startDate);
			const endDateStr = formatDate(endDate);

			const data = await getNotifications(startDateStr, endDateStr, null);
			setNotifications(data);
		} catch (error) {
			console.error('알림 로드 실패:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNotificationClick = async (notification) => {
		if (!notification.readStatus) {
			try {
				await updateNotificationStatus(notification.id, true);
				setUnreadCount(prev => Math.max(0, prev - 1));
				setNotifications(prev =>
					prev.map(n =>
						n.id === notification.id ? { ...n, readStatus: true } : n
					)
				);
			} catch (error) {
				console.error('알림 상태 업데이트 실패:', error);
			}
		}

		// 클릭하면 펼쳐지는 알림 ID 업데이트
		setExpandedNotificationId(prevId => (prevId === notification.id ? null : notification.id));
	};


	const confirmDeleteAll = async () => {
		try {
			await deleteAllNotifications();
			setNotifications([]);
			setUnreadCount(0);
			closeDeleteAllModal();
		} catch (error) {
			console.error('전체 알림 삭제 실패:', error);
		}
	};


	const handleDelete = async (e, id) => {
		e.stopPropagation();
		try {
			await deleteNotification(id);
			const deletedNotification = notifications.find(n => n.id === id);
			if (deletedNotification && !deletedNotification.isRead) {
				setUnreadCount(prev => Math.max(0, prev - 1));
			}
			setNotifications(prev => prev.filter(n => n.id !== id));
		} catch (error) {
			console.error('알림 삭제 실패:', error);
		}
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;

	return (
		<div className="notification-dropdown" ref={dropdownRef}>
			<button className="notification-button" onClick={() => setIsOpen(!isOpen)}>
				<Bell />
				{unreadCount > 0 && (
					<span className="notification-badge">{unreadCount}</span>
				)}
			</button>

			{isOpen && (
				<div className="dropdown-content">
					<div className="dropdown-header">
						<h3>알림</h3>
						<div className="header-actions">
							<button onClick={openDeleteAllModal}>
								<Trash2 />
							</button>
							<button onClick={() => setIsOpen(false)}>
								<X />
							</button>
						</div>
					</div>

					<div className="notification-list">
						{notifications === 0 ? (
							<div className="empty">알림이 없습니다.</div>
						) : (
							notifications.map(notification => (
								<div
									key={notification.id}
									className={`notification-item ${!notification.readStatus ? 'unread' : ''}`}
									onClick={() => handleNotificationClick(notification)}
								>
									<div className="notification-content">
										<p className="title">{notification.title}</p>
										<p className="timestamp">{notification.createdAt}</p>

										{expandedNotificationId === notification.id && (
											<p className="message">{notification.message}</p>
										)}
									</div>
									<button
										className="delete-button"
										onClick={(e) => handleDelete(e, notification.id)}
									>
										<X />
									</button>
								</div>
							))
						)}
					</div>

					<div className="dropdown-footer">
						<button onClick={() => navigate('/mypage/notifications')}>
							전체 알림 보기
						</button>
					</div>
				</div>
			)}

			<CustomModal
				isOpen={isDeleteAllModalOpen}
				onClose={closeDeleteAllModal}
				title="알림 삭제"
				buttons={
					<>
						<button onClick={confirmDeleteAll} className="confirm-btn">삭제</button>
						<button onClick={closeDeleteAllModal} className="cancel-btn">취소</button>
					</>
				}
			>
				<p>정말 모든 알림을 삭제하시겠습니까?</p>
			</CustomModal>

		</div>
	);
};

export default NotificationDropdown;