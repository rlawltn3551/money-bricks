import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMoneyNews } from "../api/moneyNewsApi";
import "../style/MoneynewsComponent.scss";

// HTML 태그 및 엔티티 제거 함수
const stripHTML = (htmlString) => htmlString.replace(/<[^>]*>/g, '').replace(/&quot;/g, '');

function MoneynewsComponent() {
   const [query, setQuery] = useState('경제');
   const [news, setNews] = useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
   const [refresh, setRefresh] = useState(0);
   const [showScrollButton, setShowScrollButton] = useState(false);

   const observer = useRef();

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

   const changeCategory = (newsQuery) => {
      setQuery(newsQuery);
      setNews([]);
      setPage(1);
      setHasMore(true);
      setRefresh((prev) => prev + 1);
   };

   useEffect(() => {
      const fetchNews = async (pageNum) => {
         setLoading(true);
         try {
            const data = await getMoneyNews(query, pageNum);
            setNews((prevNews) => [...prevNews, ...data.content]);
            if (pageNum >= data.totalPages) {
               setHasMore(false);
            }
         } catch (error) {
            console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchNews(page);
   }, [page, query, refresh]);

   const lastNewsElementRef = useCallback(
      (node) => {
         if (loading) return;
         if (observer.current) observer.current.disconnect();
         observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
               setPage((prevPage) => prevPage + 1);
            }
         });
         if (node) observer.current.observe(node);
      },
      [loading, hasMore]
   );

   const handleLinkClick = (url) => {
      window.open(url, '_blank');
   };

   return (
      <div className="moneynews-component">
         {/* 카테고리 버튼 영역 */}
         <div className="news-category-buttons">
            <button className={query === "경제" ? "active" : ""} onClick={() => changeCategory("경제")}>경제</button>
            <button className={query === "청년" ? "active" : ""} onClick={() => changeCategory("청년")}>청년</button>
            <button className={query === "복지" ? "active" : ""} onClick={() => changeCategory("복지")}>복지</button>
         </div>
         <ul>
            {news.map((item, index) => (
               <li key={index} ref={index === news.length - 1 ? lastNewsElementRef : null}>
                  <h3 onClick={() => handleLinkClick(item.originallink)} style={{ cursor: 'pointer' }}>
                     {stripHTML(item.title)}
                  </h3>
                  <p onClick={() => handleLinkClick(item.originallink)} style={{ cursor: 'pointer' }}>
                     {stripHTML(item.description)}
                  </p>
               </li>
            ))}
         </ul>
         {loading && <div className="loading">로딩중...</div>}
         {!hasMore && <div className="no-more">더 이상 뉴스가 없습니다.</div>}

         {/* 맨 위로 이동 버튼 */}
         {showScrollButton && (
            <button className="scroll-to-top" onClick={scrollToTop}>
               ↑
            </button>
         )}
      </div>
   );
}

export default MoneynewsComponent;
