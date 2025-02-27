import React, {useEffect, useState} from 'react';
import {getMallProduct} from "../api/mallApi";
import MallDetailComponent from "./MallDetailComponent";
import "../style/MallDetailModal.scss"

const MallDetailModal = ({mallId, onClose}) => {
    const [mall, setMall] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMall = async () => {
            try {
                const data = await getMallProduct(Number(mallId));
                setMall(data);
            } catch (err) {
                setError(err);
            }
        };
        fetchMall();
    }, [mallId]);

    if (error)
        return <div className="error">상품 정보를 불러오는 중 오류 발생</div>;
    if (!mall)
        return <div className="loading">로딩 중...</div>;

    return (
        <div className="mall-modal-overlay">
            <div className="mall-modal-content">
                <button className="mall-close-button" onClick={onClose}>x</button>
                {mall ? <MallDetailComponent mall={mall}/> : <p>로딩 중...</p>}
            </div>
        </div>
    );
};

export default MallDetailModal;