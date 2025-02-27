import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const QnaIndex = lazy(() => import("../page/IndexPage"));
const QnaBoardList = lazy(() => import("../page/QnaBoardListPage"));
const QnaBoardRead = lazy(() => import("../page/QnaBoardDetailPage"));
const QnaBoardAdd = lazy(() => import("../page/QnaBoardAddPage"));
const QnaBoardModify = lazy(() => import("../page/QnaBoardModifyPage"));

const qnaBoardRouter = () => [
	{
		path: "",
		element: (
			<Suspense fallback={Loading}>
				<QnaIndex />
			</Suspense>
		),
	},
	{
		path: "list",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardList />
			</Suspense>
		),
	},
	{
		path: "read/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardRead />
			</Suspense>
		),
	},
	{
		path: "add",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardAdd />
			</Suspense>
		),
	},
	{
		path: "list/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardRead />
			</Suspense>
		),
	},
	{
		path: "modify/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardModify />
			</Suspense>
		),
	},
];

export default qnaBoardRouter;