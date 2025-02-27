import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import loginRouter from "../login/router/loginRouter";
import mypageRouter from "../../mypage/router/mypageRouter";
import adminRouter from "../../admin/router/adminRouter";
import DictionaryPage from "../../dictionary/pages/DictionaryPage";
import MoneynewsPage from "../../moneyNews/page/MoneynewsPage";
import LoadingSpinner from "../components/LoadingSpinner";
import StockGame from "../../stock/components/StockGame";
import mallRouter from "../../mall/router/mallRouter";
import communityRouter from "../../community/router/communityRouter";
import qnaBoardRouter from "../../qna/router/qnaBoardRouter";
import quizRouter from "../../quiz/router/quizRouter";
import comparisonDepositRouter from "../../comparisonDeposit/router/comparisonDepositRouter";


const Main = lazy(() => import("../pages/MainPage"));
const SignUpPage = lazy(() => import("../../member/pages/MemberSignupPage"));
const SignUpProcedurePage = lazy(() => import("../../member/pages/MemberSignUpProcedurePage"));

const root = createBrowserRouter([
	{
		path: "",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}>
				<Main />
			</Suspense>
		),
	},
	{
		path: "product",
		children: comparisonDepositRouter(),
	},
	{
		path: "dictionary",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}>
				<DictionaryPage />
			</Suspense>
		),
	},
	{
		path: "moneynews",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}>
				<MoneynewsPage />
			</Suspense>
		),
	},
	{
		path: "signup",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
				<SignUpPage />
			</Suspense>
		),
	},
	{
		path: "signup-procedure",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
				<SignUpProcedurePage />
			</Suspense>
		),
	},
	{
		path: "auth",
		children: loginRouter(),
	},
	{
		path: "mypage",
		children: mypageRouter(),
	},
	{
		path: "admin",
		children: adminRouter(),
	},
	{
		path: "mall",
		children: mallRouter(),
	},
	{
		path: "stock",
		element: (
			<Suspense fallback={<LoadingSpinner isLoading={true} />}>
				<StockGame />
			</Suspense>
		),
	},
	{
		path: "board",
		children: qnaBoardRouter(),
	},
	{
		path: "community",
		children: communityRouter(),
	},
	{
		path: "quiz",
		children: quizRouter(),
	},
]);

export default root;