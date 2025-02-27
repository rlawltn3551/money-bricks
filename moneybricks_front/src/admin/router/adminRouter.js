import React, { Suspense, lazy } from "react";
import LoadingSpinner from "../../common/components/LoadingSpinner";

const Admin = lazy(() => import("../../admin/page/AdminPage"));

const adminRouter = () => {
	return [
		{
			path: "",
			element: (
				<Suspense fallback={<LoadingSpinner isLoading={true}/>}>
					<Admin />
				</Suspense>
			),
		},
	];
};

export default adminRouter;