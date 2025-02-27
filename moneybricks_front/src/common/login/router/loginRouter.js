import {Suspense, lazy} from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const LogoutPage = lazy(() => import("../pages/LogoutPage"));

const loginRouter = () => {
    return [
        {
            path: "login",
            element: (
                <Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
                    <LoginPage/>
                </Suspense>
            ),
        },
        {
            path: "logout",
            element: (
                <Suspense fallback={<LoadingSpinner isLoading={true}/>}>
                    <LogoutPage/>
                </Suspense>
            ),
        },
    ];
};

export default loginRouter;