import { Suspense, lazy } from "react";
import LoadingSpinner from "../../common/components/LoadingSpinner";

const Loading = <LoadingSpinner isLoading={true} />;
const CommunityPage = lazy(() => import("../../community/pages/CommunityPage"));

const communityRouter = () => [
    {
        index: true, // ✅ /community 경로로 접속 시 CommunityPage 렌더링
        element: (
            <Suspense fallback={Loading}>
                <CommunityPage view="list" />
            </Suspense>
        ),
    },
    {
        path: "detail/:pstId",
        element: (
            <Suspense fallback={Loading}>
                <CommunityPage view="detail" />
            </Suspense>
        ),
    },
];

export default communityRouter;

