import React, { useEffect, useState } from "react";
import "../styles/NavDictionaryComponent.scss";
import { getRandomTerms, getTermById } from "../../dictionary/api/dictionaryApi";
import { useLocation, useNavigate } from "react-router-dom";

const SearchIcon = () => (
	<svg
		viewBox="0 0 24 24"
		width="24"
		height="24"
		stroke="currentColor"
		fill="none"
		className="search-icon"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);

const DictionaryList = () => {
	const [terms, setTerms] = useState([]);
	const [currentTermIndex, setCurrentTermIndex] = useState(0);
	const [selectedTermDetails, setSelectedTermDetails] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchTerms = async () => {
			try {
				const data = await getRandomTerms();
				setTerms(data);
			} catch (error) {
				console.error("Error fetching dictionary terms:", error);
			}
		};
		fetchTerms();
	}, []);

	// 롤링 애니메이션
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTermIndex((prevIndex) =>
				terms.length > 0 ? (prevIndex + 1) % terms.length : 0,
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [terms]);

	const handleTermClick = async (dictionaryId) => {
		if (selectedTermDetails && selectedTermDetails.dictionaryId === dictionaryId) {
			// 이미 선택된 용어를 다시 클릭하면 숨기기
			setSelectedTermDetails(null);
		} else {
			// 새 용어 클릭 시 상세 정보 표시
			try {
				const termDetails = await getTermById(dictionaryId);
				setSelectedTermDetails(termDetails);
			} catch (error) {
				console.error("Error fetching term details:", error);
			}
		}
	};

	const handleMoreInfoClick = () => {
		if (location.pathname === "/dictionary") {
			window.location.reload();
		} else {
			navigate("/dictionary");
		}
	};

	const currentTerm = terms.length > 0 ? terms[currentTermIndex] : null;

	return (
		<div className="dictionary-container">
			{currentTerm && (
				<div className="rolling-term-container" onClick={() => handleTermClick(currentTerm.dictionaryId)}>
					<div className="rolling-text-box">
						<div className="dictionary-left">
							<h2 className="dictionary-title">📖 오늘의 금융 용어</h2>
							<hr className="dictionary-line" />
							<span className="rolling-term">{currentTerm.dictionaryTerms}</span>
						</div>
						<SearchIcon onClick={() => navigate("/dictionary")} />
					</div>
				</div>
			)}

			{/* 선택한 용어의 상세 정보 표시 */}
			{selectedTermDetails && (
				<div className="term-details-container">
					<h3 className="term-details-title">{selectedTermDetails.dictionaryTerms}</h3>
					<p className="term-details-description">{selectedTermDetails.dictionaryDefinitions}</p>
					<div className="more-info-container">
						<button className="more-info-button" onClick={handleMoreInfoClick}>금융 용어 더 찾아보기</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DictionaryList;
