import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAdminOnly = () => {
	const loginState = useSelector((state) => state.loginSlice); // Redux 상태에서 로그인 정보 가져오기
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (loginState && loginState.memberRoles) {
			setIsAdmin(loginState.memberRoles.includes("ADMIN")); // ADMIN 역할 확인
		}
	}, [loginState]);

	return { isAdmin };
};

export default useAdminOnly;