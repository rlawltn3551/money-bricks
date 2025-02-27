import React, { useState, useEffect } from 'react';
import {
	getNotifications,
	updateNotificationStatus,
	deleteNotification,
	deleteAllNotifications
} from '../api/notificationApi';
import '../styles/NotificationComponent.scss';
import LoadingSpinner from "../../common/components/LoadingSpinner";

const NotificationComponent = () => {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [filter, setFilter] = useState('all');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		// 날짜 입력이 둘 다 있거나, 둘 다 없을 때만 API 호출
		if ((startDate && endDate) || (!startDate && !endDate)) {
			fetchNotifications();
		}
	}, [filter, startDate, endDate]); // 의존성 배열에 날짜들도 추가

	const fetchNotifications = async () => {
		setIsLoading(true);
		try {
			let params = {};

			// 날짜 필터가 있는 경우
			if (startDate && endDate) {
				params.startDate = startDate;
				params.endDate = endDate;
			}

			// 읽음 상태 필터
			if (filter === 'unread') {
				params.isRead = false;
			}
			// 'all'인 경우는 isRead 파라미터를 보내지 않음

			const data = await getNotifications(
				params.startDate || null,
				params.endDate || null,
				params.isRead
			);
			setNotifications(data);
		} catch (error) {
			setError('알림목록을 불러오는 데 실패했습니다.');
			console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNotificationClick = async (notification) => {
		if (!notification.readStatus) {
			try {
				await updateNotificationStatus(notification.id, true);
				setNotifications(prev =>
					prev.map(n =>
						n.id === notification.id ? { ...n, readStatus: true } : n
					)
				);
				window.location.reload();
			} catch (error) {
				console.error('알림 상태 업데이트 실패:', error);
			}
		}
	};

	const handleDeleteAll = async () => {
		if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
			try {
				await deleteAllNotifications();
				setNotifications([]);
			} catch (error) {
				console.error('전체 알림 삭제 실패:', error);
			}
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteNotification(id);
			setNotifications(prev => prev.filter(n => n.id !== id));
		} catch (error) {
			console.error('알림 삭제 실패:', error);
		}
	};

	if (isLoading) return <LoadingSpinner isLoading={true} />;
	if (error) return <div className="error-message">{error}</div>;

	return (
		<div className="notification-page">
			<div className="page-header">
				<h1></h1>
				<div className="header-actions">
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					>
						<option value="all">전체 알림</option>
						<option value="unread">읽지 않은 알림</option>
					</select>
					<button className="delete-all-button" onClick={handleDeleteAll}>
						전체 삭제
					</button>
				</div>
			</div>

			<div className="date-filter">
				<input
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
				/>
				<span>~</span>
				<input
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
				/>
				<button className="search-button" onClick={fetchNotifications}>
					조회
				</button>
			</div>

			{notifications.length === 0 ? (
				<div className="empty">알림이 없습니다</div>
			) : (
				<div className="notification-list">
					{notifications.map(notification => (
						<div
							key={notification.id}
							className={`notification-item ${!notification.readStatus ? 'unread' : ''}`}
						>
							<div
								className="notification-content"
								onClick={() => handleNotificationClick(notification)}
							>
								<p className="title">{notification.title}</p>
								<p className="message">{notification.message}</p>
								<p className="timestamp">
									{notification.createdAt}
								</p>
							</div>
							<button
								className="delete-button"
								onClick={() => handleDelete(notification.id)}
							>
								삭제
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default NotificationComponent;