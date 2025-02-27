// src/quiz/router/quizRouter.js
import { lazy } from "react";
import { Suspense } from "react";
import LoadingSpinner from "../../common/components/LoadingSpinner";

const QuizPage = lazy(() => import("../pages/QuizPage"));
const QuizHistoryPage = lazy(() => import("../pages/QuizHistoryPage"));

const quizRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={<LoadingSpinner isLoading={true} />}>
        <QuizPage />
      </Suspense>
    ),
  },
  {
    path: "history",
    element: (
      <Suspense fallback={<LoadingSpinner isLoading={true} />}>
        <QuizHistoryPage />
      </Suspense>
    ),
  },
];

export default quizRouter;
