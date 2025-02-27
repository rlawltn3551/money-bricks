import React, {lazy, Suspense} from "react";

const Loading = <div>Loading...</div>;
const MallList = lazy(() => import("../page/MallPage"));

const mallRouter = () => {
    return [
        { // 목록 페이지
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    <MallList />
                </Suspense>
            ),
        },
    ];
};

export default mallRouter;