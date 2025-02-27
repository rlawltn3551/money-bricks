import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMallList } from "../api/mallApi";
import "../style/MallListComponent.scss";
import useCustomMove from "../../common/hooks/useCustomMove";
import MallDetailModal from "./MallDetailModal";
import OrdersHistoryComponent from "../../orders/components/OrdersHistoryComponent";

const initState = {
	dtoList: [],
	pageNumList: [],
	pageRequestDTO: null,
	prev: false,
	next: false,
	totalCount: 0,
	prevPage: 0,
	nextPage: 0,
	totalPage: 0,
	current: 0,
};

const MallListComponent = () => {
	const [mall, setMall] = useState([]); // 상품 목록
	const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
	const { refresh } = useCustomMove();
	const [serverData, setServerData] = useState(initState);
	const itemsPerPage = 8; // 한 번에 불러올 데이터 개수
	const currentPage = useRef(1);
	const [selectedMallId, setSelectedMallId] = useState(null); // 모달 상태
	const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false); // 구매 내역 상태
	const [showScrollButton, setShowScrollButton] = useState(false);

	// 스크롤 감지해서 버튼 표시 여부 업데이트
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setShowScrollButton(true);
			} else {
				setShowScrollButton(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// 맨 위로 스크롤하는 함수
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// 상품 데이터 불러오기
	useEffect(() => {
		loadMore();
	}, [refresh]);

	const loadMore = () => {

		getMallList({ page: currentPage.current, size: itemsPerPage })
			.then((data) => {
				setMall((prevMall) => [...prevMall, ...data.dtoList]);
				setServerData(data);

				if (data.next) {
					currentPage.current += 1;
					setHasMore(true);
				} else {
					setHasMore(false); // 데이터가 없으면 스크롤 중단
				}
			})
			.catch((err) => {
				console.error("데이터 불러오기 실패: ", err);
			});
	};

	return (
		<div className="mall-container">
			<button
				className="order-history-button"
				onClick={() => setIsOrderHistoryOpen(!isOrderHistoryOpen)}
			>
				구매 내역
			</button>

			<>
				{isOrderHistoryOpen && <OrdersHistoryComponent onClose={() => setIsOrderHistoryOpen(false)} />}
			</>

			<InfiniteScroll
				dataLength={mall.length}
				next={loadMore}
				hasMore={hasMore}
				loader={<h4>로딩 중...</h4>}
				endMessage={<p className="no-more">더 이상 상품이 없습니다.</p>}
				scrollableTarget="mall-container"
			>
				<div className="mall-product-grid">
					{mall.map((mall) => (
						<div
							key={mall.mallId}
							className="mall-product-card"
							onClick={() => setSelectedMallId(mall.mallId)}
						>
							<img src={mall.imageUrl} alt={mall.productName} />
							<h3>{mall.brand}</h3>
							<p>{mall.productName}</p>
							<p>{mall.price.toLocaleString()} P</p>
						</div>
					))}
				</div>
			</InfiniteScroll>

			{selectedMallId && (
				<MallDetailModal mallId={selectedMallId} onClose={() => setSelectedMallId(null)} />
			)}

			{/* 맨 위로 이동 버튼 */}
			{showScrollButton && (
				<button className="scroll-to-top" onClick={scrollToTop}>
					↑
				</button>
			)}
		</div>
	);
};

export default MallListComponent;
