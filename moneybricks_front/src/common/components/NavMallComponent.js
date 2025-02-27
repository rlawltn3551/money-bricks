import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { getMallList } from "../../mall/api/mallApi";
import "../styles/NavMallComponent.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import MallDetailModal from "../../mall/component/MallDetailModal";

const itemsPerPage = 10;
const rankingItemsCount = 10;

const NavMallComponent = () => {
	const [rankedMalls, setRankedMalls] = useState([]);
	const [selectedMallId, setSelectedMallId] = useState(null); // 모달 상태
	const [isDragging, setIsDragging] = useState(false); // 드래그 상태
	const navigate = useNavigate();
	const sliderRef = useRef(null); // 슬라이더 참조

	useEffect(() => {
		getMallList({ page: 1, size: itemsPerPage }).then((data) => {
			const ranked = data.dtoList.slice(0, rankingItemsCount);
			setRankedMalls(ranked);
		}).catch((err) => {
			console.error("데이터 불러오기 실패: ", err);
		});
	}, []);

	// 슬라이드 설정
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 2,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: true,
		swipeToSlide: true,
		draggable: true,
		responsive: [
			{ breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
			{ breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
			{ breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
		],
		beforeChange: () => setIsDragging(true), // 슬라이드가 변할 때 드래그 시작
		afterChange: () => setIsDragging(false), // 슬라이드가 끝나면 드래그 종료
	};

	const handleMallClick = (mallId, e) => {
		if (isDragging) return; // 드래그 중이면 클릭 이벤트 무시
		setSelectedMallId(mallId); // 클릭 시 모달 열기
	};

	return (
		<div className="nav-mall-container">
			<div className="header-container">
				<h2>포인트샵 Top 10 상품</h2>
				<button className="more-button" onClick={() => navigate("/mall")}>
					더보기
				</button>
			</div>

			<Slider {...settings} ref={sliderRef}>
				{rankedMalls.map((mall, index) => (
					<div key={mall.mallId} className="product-card">
						<div className={`rank-badge ${
							index + 1 === 1 ? 'rank-1' :
								index + 1 === 2 ? 'rank-2' :
									index + 1 === 3 ? 'rank-3' :
										'rank-other'
						}`}>
							{index + 1}
						</div>
						{/* 순위 표시 */}
						<img
							src={mall.imageUrl}
							alt={mall.productName}
							onClick={(e) => handleMallClick(mall.mallId, e)} // 이미지 클릭 시 모달
						/>
						<h3
							onClick={(e) => handleMallClick(mall.mallId, e)} // 상품 이름 클릭 시 모달
						>
							{mall.brand}
						</h3>
						<p>{mall.productName}</p>
						<p>{mall.price.toLocaleString()} P</p>
					</div>
				))}
			</Slider>

			{/* 모달 */}
			{selectedMallId && (
				<MallDetailModal mallId={selectedMallId} onClose={() => setSelectedMallId(null)} />
			)}
		</div>
	);
};

export default NavMallComponent;
