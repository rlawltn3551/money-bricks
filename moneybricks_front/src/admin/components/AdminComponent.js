import React, { useEffect, useState } from "react";
import { deleteAdminMember, getAdminMembers, sendEmail } from "../api/adminApi";
import "../styles/AdminComponent.scss";
import CustomModal from "../../common/components/CustomModal";
import AdminStatsChart from "./AdminStatsChart";

const AdminComponent = () => {
	const [members, setMembers] = useState([]);
	const [filteredMembers, setFilteredMembers] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [onlyAgreeEmail, setOnlyAgreeEmail] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [selectAll, setSelectAll] = useState(false);

	// 이메일 발송 모달 관련 상태
	const [emailModal, setEmailModal] = useState(false);
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");

	// 경고 모달 관련 상태
	const [warningModal, setWarningModal] = useState({
		isOpen: false,
		message: "",
		onConfirm: null,
	});

	// 통계 표시 상태
	const [showStats, setShowStats] = useState(false);

	// 회원 목록 가져오기
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const data = await getAdminMembers();
				setMembers(data);
				setFilteredMembers(data);
				console.log(data);
			} catch (error) {
				console.error("Failed to fetch members:", error.message);
			}
		};

		fetchMembers();
	}, []);

	// 검색 및 필터 처리
	const handleSearch = () => {
		const lowerKeyword = searchKeyword.toLowerCase();

		const filtered = members.filter((member) => {
			const matchesKeyword =
				member.username.toLowerCase().includes(lowerKeyword) ||
				member.email.toLowerCase().includes(lowerKeyword);

			// 이메일 수신 동의 필터
			const matchesAgreeEmail = onlyAgreeEmail ? !!member.emailAgreed : true;

			return matchesKeyword && matchesAgreeEmail;
		});

		setFilteredMembers(filtered);

		// 선택된 회원 상태를 필터링된 결과와 동기화
		const updatedSelected = selectedMembers.filter((m) =>
			filtered.some((member) => member.id === m.id),
		);
		setSelectedMembers(updatedSelected);
	};

	// 전체 회원 보기
	const handleShowAll = () => {
		setSearchKeyword("");
		setOnlyAgreeEmail(false);
		setFilteredMembers(members);
		setSelectedMembers([]);
	};

	// 이메일 수신 동의 필터 적용
	const handleEmailAgreedFilter = (checked) => {
		setOnlyAgreeEmail(checked);

		if (checked) {
			const filtered = members.filter(
				(member) =>
					member.emailAgreed &&
					(searchKeyword
						? member.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
						member.email.toLowerCase().includes(searchKeyword.toLowerCase())
						: true),
			);
			setFilteredMembers(filtered);
		} else {
			// 필터링 해제 시 전체 회원을 다시 보여줌
			setFilteredMembers(members);
		}
	};

	// 회원 삭제
	const handleDelete = (id) => {
		// 삭제 확인 모달 띄우기
		showWarningModal(
			"정말로 이 회원을 삭제하시겠습니까?", // 경고 메시지
			() => { // 확인 버튼 클릭 시 처리
				// 실제 삭제 처리
				deleteMember(id);
				setWarningModal({ isOpen: false, message: "", onConfirm: null });
			},
		);
	};

	// 실제 삭제 처리 함수
	const deleteMember = async (id) => {
		try {
			await deleteAdminMember(id);
			setMembers((prev) => prev.filter((member) => member.id !== id));
			setFilteredMembers((prev) => prev.filter((member) => member.id !== id));
			setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
			alert("회원 삭제 성공!");
		} catch (error) {
			console.error("Failed to delete member:", error.message);
			alert("회원 삭제 실패: " + error.message);
		}
	};


	// 회원 선택 처리 (id와 email 모두 저장)
	const handleSelectMember = (member) => {
		if (selectedMembers.some((m) => m.id === member.id)) {
			setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
		} else {
			setSelectedMembers((prev) => [
				...prev,
				{ id: member.id, email: member.email },
			]);
		}
	};

	// 전체 선택 처리
	const handleSelectAll = (checked) => {
		setSelectAll(checked);
		if (checked) {
			const allMembers = filteredMembers.map((member) => ({
				id: member.id,
				email: member.email,
			}));
			setSelectedMembers(allMembers);
		} else {
			setSelectedMembers([]);
		}
	};

	// 경고 모달 표시
	const showWarningModal = (message, onConfirm) => {
		setWarningModal({
			isOpen: true,
			message,
			onConfirm,
		});
	};

	// 이메일 발송 모달 열기
	const openEmailModal = () => {
		if (selectedMembers.length === 0) {
			alert("이메일을 발송할 회원을 선택해주세요.");
			return;
		}

		// 선택된 회원 중 이메일 수신 동의한 회원만 필터링
		const emailAgreeMembers = selectedMembers.filter(selectedMember => {
			const member = members.find(m => m.id === selectedMember.id);
			return member && member.emailAgreed;
		});

		if (emailAgreeMembers.length === 0) {
			alert("선택된 회원 중 이메일 수신에 동의한 회원이 없습니다.");
			return;
		}

		if (emailAgreeMembers.length < selectedMembers.length) {
			const notAgreed = selectedMembers.length - emailAgreeMembers.length;
			showWarningModal(
				`선택된 회원 중 ${notAgreed}명은 이메일 수신 동의를 하지 않았습니다. 동의한 ${emailAgreeMembers.length}명에게만 발송하시겠습니까?`,
				() => {
					setSelectedMembers(emailAgreeMembers);
					setWarningModal({ isOpen: false, message: "", onConfirm: null });
					setEmailModal(true);
				},
			);
		} else {
			setEmailModal(true);
		}
	};

	// 이메일 발송
	const handleSendEmails = async () => {
		if (!emailSubject || !emailBody) {
			alert("이메일 제목과 본문을 입력해주세요.");
			return;
		}

		const emailAgreeMembers = selectedMembers.filter(selectedMember => {
			const member = members.find(m => m.id === selectedMember.id);
			return member && member.emailAgreed;
		});

		const emailRequestDTO = {
			memberEmails: emailAgreeMembers.map((m) => m.email),
			subject: emailSubject,
			body: emailBody,
		};

		try {
			await sendEmail(emailRequestDTO);
			alert("이메일 발송 성공!");
			setEmailModal(false);
			setEmailSubject("");
			setEmailBody("");
		} catch (error) {
			console.error("Failed to send emails:", error.message);
			alert("이메일 발송 실패: " + error.message);
		}
	};

	// 전체 선택 상태 동기화
	useEffect(() => {
		setSelectAll(
			filteredMembers.length > 0 &&
			filteredMembers.every((member) =>
				selectedMembers.some((m) => m.id === member.id),
			),
		);
	}, [filteredMembers, selectedMembers]);

	// 이메일 수신 동의한 회원 수 계산
	const emailAgreedCount = members.filter(member => member.emailAgreed).length;

	// 통계 차트 표시 토글
	const toggleStats = () => {
		setShowStats(!showStats);
	};

	return (
		<div className="admin-container">
			<h2>회원 관리</h2>

			<div className="member-chart">
				<button
					className="toggle-stats-btn"
					onClick={toggleStats}
				>
					{showStats ? "통계 차트 숨기기" : "회원 통계 차트 보기"}
				</button>
			</div>
			{/* 통계 차트 섹션 */}
			{showStats && <AdminStatsChart members={members} />}

			{/* 검색 및 필터링 섹션 */}
			<div className="search-and-email-section">
				<div className="search-section">
					<input
						type="text"
						placeholder="아이디 또는 이메일 검색"
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
					/>
					<button onClick={handleSearch}>검색</button>
					<button onClick={handleShowAll}>전체 회원 보기</button>
				</div>

				{/* 이메일 필터 및 발송 버튼 */}
				<div className="email-filter-section">
					<div className="checkbox-wrapper">
						<input
							type="checkbox"
							checked={onlyAgreeEmail}
							onChange={(e) => handleEmailAgreedFilter(e.target.checked)}
							id="email-agreement-filter"
						/>
						<label htmlFor="email-agreement-filter">이메일 수신 동의 회원만 보기</label>
					</div>

					<button
						className="send-email-btn"
						onClick={openEmailModal}
					>
						선택한 회원 이메일 발송하기
					</button>
				</div>
			</div>

			<table className="members-table">
				<thead>
				<tr>
					<th className="checkbox-cell">
						<input
							type="checkbox"
							checked={selectAll}
							onChange={(e) => handleSelectAll(e.target.checked)}
						/>
					</th>
					<th>회원 번호</th>
					<th>아이디</th>
					<th>닉네임</th>
					<th>이메일</th>
					<th>권한</th>
					<th>수신 동의</th>
					<th>탈퇴 여부</th>
					<th>관리</th>
				</tr>
				</thead>
				<tbody>
				{filteredMembers.map((member) => (
					<tr key={member.id} className={member.emailAgreed ? "email-agreed" : ""}>
						<td>
							<input className="checkbox-cell"
									 type="checkbox"
									 checked={selectedMembers.some((m) => m.id === member.id)}
									 onChange={() => handleSelectMember(member)}
							/>
						</td>
						<td>{member.id}</td>
						<td>{member.username}</td>
						<td>{member.nickname}</td>
						<td>{member.email}</td>
						<td>{member.roles.join(", ")}</td>
						<td className="status-cell">{member.emailAgreed ? "✔️" : "❌"}</td>
						<td className="status-cell">{member.deleted ? "✔️" : "❌"}</td>
						<td className="action-cell">
							<button onClick={() => handleDelete(member.id)}>삭제</button>
						</td>
					</tr>
				))}
				</tbody>
			</table>

			{/* 경고 모달 */}
			<CustomModal
				isOpen={warningModal.isOpen}
				onClose={() => setWarningModal({ isOpen: false, message: "", onConfirm: null })}
				title="알림"
				buttons={
					<>
						<button className="confirm-btn" onClick={warningModal.onConfirm}>
							확인
						</button>
						<button className="cancel-btn"
								  onClick={() => setWarningModal({ isOpen: false, message: "", onConfirm: null })}>
							취소
						</button>
					</>
				}
			>
				<p>{warningModal.message}</p>
			</CustomModal>

			{/* 이메일 발송 모달 */}
			<CustomModal
				isOpen={emailModal}
				onClose={() => setEmailModal(false)}
				title="이메일 발송"
				buttons={
					<>
						<button className="cancel-btn" onClick={() => setEmailModal(false)}>취소</button>
						<button className="confirm-btn" onClick={handleSendEmails}>발송하기</button>
					</>
				}
			>
				<div className="email-modal-content">
					<p className="recipient-count">
						받는 사람: {selectedMembers.length}명
					</p>
					<div className="email-form">
						<div className="form-group">
							<label htmlFor="email-subject">제목</label>
							<input
								id="email-subject"
								type="text"
								placeholder="이메일 제목"
								value={emailSubject}
								onChange={(e) => setEmailSubject(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email-body">내용</label>
							<textarea
								id="email-body"
								placeholder="이메일 내용"
								value={emailBody}
								onChange={(e) => setEmailBody(e.target.value)}
								rows={10}
							/>
						</div>
					</div>
				</div>
			</CustomModal>
		</div>
	);
};

export default AdminComponent;