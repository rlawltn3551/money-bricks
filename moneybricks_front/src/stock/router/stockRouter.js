import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StockGame from "../components/StockGame";

function StockRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/stock" element={<StockGame />} />
      </Routes>
    </Router>
  );
}

export default StockRouter;
