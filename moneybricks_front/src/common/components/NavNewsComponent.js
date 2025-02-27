import React, { useState, useEffect } from 'react';
import {getMoneyNews} from "../../moneyNews/api/moneyNewsApi";
import "../styles/NavNewsComponent.scss"

// HTML 태그 제거 함수
const stripHTML = (htmlString) => htmlString.replace(/<[^>]*>/g, '').replace(/&quot;/g, '');

const newsImages = [
    "/images/news/news1.jpg",
    "/images/news/news2.jpg",
    "/images/news/news3.jpg",
    "/images/news/news4.jpg",
    "/images/news/news5.jpg",
    "/images/news/news6.jpg",
    "/images/news/news7.jpg",
    "/images/news/news8.jpg",
    "/images/news/news9.jpg",
    "/images/news/news10.jpg",
    "/images/news/news11.jpg",
    "/images/news/news12.jpg",
    "/images/news/news13.jpg",
    "/images/news/news14.jpg",
    "/images/news/news15.jpg",
    "/images/news/news16.jpg",
    "/images/news/news17.jpg",
    "/images/news/news18.jpg"
];

function CategoryNews() {
    const categories = ['경제', '청년', '복지']; // 카테고리 목록
    const [selectedCategory, setSelectedCategory] = useState('경제'); // 선택된 카테고리
    const [news, setNews] = useState([]); // 현재 카테고리 뉴스 데이터
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 선택된 카테고리가 변경될 때마다 데이터를 가져옴
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await getMoneyNews(selectedCategory, 1); // 첫 페이지 데이터만 가져옴
                setNews(response.content.slice(0, 6)); // 상위 5개 뉴스만 저장
            } catch (error) {
                console.error('뉴스 데이터를 불러오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [selectedCategory]);

    return (
        <div className="container">
            {/* 카테고리 버튼 */}
            <div className="categoryButtons">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`categoryButton ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 뉴스 리스트 */}
            <div className="newsList">
                {loading ? (
                    <div className="loading">로딩중...</div>
                ) : (
                   news.map((item, index) => (
                      <div
                         key={index}
                         className="newsItem cursor-pointer"
                         onClick={() => window.open(item.originallink, "_blank", "noopener,noreferrer")}
                      >
                          <h4>{stripHTML(item.title)}</h4>
                          <img
                             src={newsImages[Math.floor(Math.random() * newsImages.length)]}
                             alt="뉴스 이미지"
                             className="newsImage"
                          />
                      </div>
                   ))

                )}
            </div>
        </div>
    );
}

export default CategoryNews;