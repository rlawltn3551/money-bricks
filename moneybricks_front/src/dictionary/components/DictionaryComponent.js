import React, { useCallback, useEffect, useRef, useState } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import { getAllTerms, searchTerms } from "../api/dictionaryApi";
import { useNavigate } from "react-router-dom";

const DictionaryComponent = () => {
	const [terms, setTerms] = useState([]);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [code, setCode] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [activeButton, setActiveButton] = useState("all");
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const observerRef = useRef(null);
	const inputRef = useRef(null);
	const navigate = useNavigate();

	const fetchData = async (page = 0, reset = false) => {
		if (loading) return;
		setLoading(true);
		setError("");

		try {
			let data;
			if (code !== null) {
				data = await searchTerms(searchKeyword, page, code, 50);
			} else if (isSearching && searchKeyword.trim()) {
				data = await searchTerms(searchKeyword, page, null, 50);
			} else {
				data = await getAllTerms(page, 50);
			}

			setTerms((prevTerms) => reset ? data.content : [...prevTerms, ...data.content]);
			setTotalPages(data.totalPages || 1);
			setCurrentPage(page);
		} catch (err) {
			setError("데이터를 가져오는 중 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(0, true);
	}, [code, searchKeyword, isSearching]);

	// 페이지가 로드되면 입력창에 자동으로 포커스
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

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

	const handleSearch = (keyword) => {
		if (searchKeyword !== keyword) {
			setSearchKeyword(keyword);
			setIsSearching(true);
			setCurrentPage(0);
			if (activeButton === "all") {
				setCode(null);
			}
		}
	};

	const filterSuggestions = (keyword) => {
		if (!Array.isArray(terms) || !keyword.trim()) {
			setFilteredSuggestions([]);
			return;
		}
		const filtered = terms.filter((term) =>
			term.dictionaryTerms?.toLowerCase().includes(keyword.toLowerCase()),
		);
		setFilteredSuggestions(filtered);
	};

	const handleButtonClick = (categoryCode, buttonName = "all") => {
		setCode(categoryCode);
		setCurrentPage(0);
		setIsSearching(searchKeyword.trim() ? true : false);
		setActiveButton(buttonName);
		setSearchKeyword("");
	};

	const lastElementRef = useCallback(
		(node) => {
			if (loading || currentPage >= totalPages - 1) return;

			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						fetchData(currentPage + 1);
					}
				},
				{ threshold: 1.0 },
			);

			if (node) observerRef.current.observe(node);
		},
		[loading, currentPage, totalPages],
	);

	return (
		<div className="dictionary-container">
			<div className="dictionary-category-buttons">
				<button onClick={() => handleButtonClick(null, "all")} className={activeButton === "all" ? "active" : ""}>
					전체
				</button>
				<button onClick={() => handleButtonClick(1, 1)} className={activeButton === 1 ? "active" : ""}>
					금융
				</button>
				<button onClick={() => handleButtonClick(2, 2)} className={activeButton === 2 ? "active" : ""}>
					경제
				</button>
				<button onClick={() => handleButtonClick(3, 3)} className={activeButton === 3 ? "active" : ""}>
					경영
				</button>
			</div>

			<div className="autocomplete-wrapper">
				<AutoCompleteInput
					ref={inputRef}
					value={searchKeyword}
					suggestions={filteredSuggestions}
					onSearch={(keyword) => {
						handleSearch(keyword);
						filterSuggestions(keyword);
					}}
					onChange={setSearchKeyword}
				/>
			</div>

			{error && <div className="error-message">{error}</div>}

			<div className="terms-list">
				<ul>
					{Array.isArray(terms) && terms.length > 0 ? (
						terms.map((term, index) => (
							<li key={term.dictionaryId} className="term-item"
								 ref={index === terms.length - 1 ? lastElementRef : null}>
								<div className="term-content">
									<span className="term-title">{term.dictionaryTerms}</span>
									<p className="term-definition">{term.dictionaryDefinitions}</p>
								</div>
							</li>
						))
					) : (
						!loading && <div className="no-terms">해당하는 단어가 없습니다.</div>
					)}
				</ul>
			</div>

			{loading && <div className="loading">Loading...</div>}

			{/* 맨 위로 이동 버튼 */}
			{showScrollButton && (
				<button className="scroll-to-top" onClick={scrollToTop}>
					↑
				</button>
			)}
		</div>
	);
};

export default DictionaryComponent;
