import React, { useState, useEffect } from "react";
import { checkPassword } from "../api/memberApi"; // checkPassword 함수 가져오기
import "../styles/PasswordConfirmationComponent.scss";

const PasswordConfirmationComponent = ({ onSuccess }) => {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const passwordInputRef = React.createRef(); // 입력 필드에 대한 참조를 추가

	useEffect(() => {
		passwordInputRef.current.focus(); // 컴포넌트가 렌더링될 때 자동으로 커서 포커스
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// 서버에 비밀번호 확인 요청
			const passwordRequestDTO = { password }; // DTO 형식으로 데이터 준비
			await checkPassword(passwordRequestDTO); // checkPassword 함수 호출
			onSuccess(); // 비밀번호 확인 성공 시 콜백 실행
		} catch (err) {
			console.error(err);
			setError("비밀번호가 일치하지 않습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<form className="password-confirm-form" onSubmit={handleSubmit}>
				<h1>비밀번호 확인</h1>
				<div className="password-confirm-form-group">
					<label htmlFor="password">비밀번호</label>
					<input
						type="password"
						id="password"
						ref={passwordInputRef} // ref를 사용하여 입력 필드에 접근
						placeholder="비밀번호를 입력해 주세요."
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p className="error-message">{error}</p>}
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "확인 중..." : "확인"}
				</button>
			</form>
		</div>
	);
};

export default PasswordConfirmationComponent;
