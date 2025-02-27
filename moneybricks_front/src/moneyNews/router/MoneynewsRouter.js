import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MoneynewsPage from "../page/MoneynewsPage";

function MoneynewsRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/moneynews" element={<MoneynewsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MoneynewsRouter;