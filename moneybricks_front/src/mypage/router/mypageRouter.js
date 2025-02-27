import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../common/components/LoadingSpinner";

const AccountDetailsPage = lazy(() => import("../../savingsAccount/pages/AccountDetailsPage"));
const AccountRenewPage = lazy(() => import("../../savingsAccount/pages/AccountRenewPage"));
const AccountCancelPage = lazy(() => import("../../savingsAccount/pages/AccountCancelPage"));
const AccountHistoryListPage = lazy(() => import("../../savingsAccount/pages/AccountHistoryListPage"));
const DepositPage = lazy(() => import ("../../savingsAccount/pages/DepositPage"));
const CurrentDepositHistoryPage = lazy(() => import ("../../savingsAccount/pages/CurrentDepositHistoryListPage"));
const AllDepositHistoryPage = lazy(() => import("../../savingsAccount/pages/AllDepositHistoryListPage"));
const PointInfoPage = lazy(() => import("../../point/pages/PointInfoPage"));
const PointHistoryPage = lazy(() => import("../../point/pages/PointHistoryListPage"));
const OrdersHistoryPage = lazy(() => import("../../orders/page/MypageOrderHistoryPage"));
const ModifyPage = lazy(() => import("../../member/pages/MemberModifyPage"));
const ChangePasswordPage = lazy(() => import("../../member/pages/ChangePasswordPage"));
const DeletePage = lazy(() => import("../../member/pages/MemberDeletePage"));
const NotificationPage = lazy(() => import("../../notification/page/NotificationPage"));
const mypageRouter = () => {
	return [
		{
			path: "account",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<AccountDetailsPage />
				</Suspense>
			),
		},
		{
			path: "account/renew",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<AccountRenewPage />
				</Suspense>
			),
		},
		{
			path: "account/cancel",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<AccountCancelPage />
				</Suspense>
			),
		},
		{
			path: "account-history/list",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<AccountHistoryListPage />
				</Suspense>
			),
		},
		{
			path: "deposit",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<DepositPage />
				</Suspense>
			),
		},
		{
			path: "deposit-history/current/list",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<CurrentDepositHistoryPage />
				</Suspense>
			),
		},
		{
			path: "deposit-history/all/list",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<AllDepositHistoryPage />
				</Suspense>
			),
		},
		{
			path: "point",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<PointInfoPage />
				</Suspense>
			),
		},
		{
			path: "point-history/list",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}> {/* 로딩 스피너 적용 */}
					<PointHistoryPage />
				</Suspense>
			),
		},
		{
			path: "orders",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
					<OrdersHistoryPage />
				</Suspense>
			),
		},
		{
			path: "edit-member",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
					<ModifyPage />
				</Suspense>
			),
		},
		{
			path: "change-password",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
					<ChangePasswordPage />
				</Suspense>
			),
		},
		{
			path: "delete-account",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
					<DeletePage />
				</Suspense>
			),
		},
		{
			path: "notifications",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true} />}> {/* 로딩 스피너 적용 */}
					<NotificationPage />
				</Suspense>
			),
		},
	];
};

export default mypageRouter;
