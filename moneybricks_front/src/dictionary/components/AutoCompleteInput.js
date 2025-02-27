import React, { forwardRef, useEffect, useRef, useState } from "react";

const AutoCompleteInput = forwardRef(({ suggestions, onSearch, value, onChange }, ref) => {	const [filteredCategories, setFilteredCategories] = useState({});
	const [showSuggestions, setShowSuggestions] = useState(false);
	const debounceTimeoutRef = useRef(null);

	// Normalize text to handle spaces, special characters, and case sensitivity
	const normalizeText = (text) => text.replace(/[\s()\-]/g, "").toLowerCase();

	// Handle input change
	const handleInputChange = (e) => {
		const newValue = e.target.value;
		onChange(newValue);
		debounceSearch(newValue);  // Debounce API search

		if (newValue.trim()) {
			filterSuggestionsByCategory(newValue);
			setShowSuggestions(true);
		} else {
			resetSuggestions();
		}
	};

	// Filter suggestions by keyword
	const filterSuggestionsByCategory = (keyword) => {
		const lowerKeyword = normalizeText(keyword);
		console.log("Filtering suggestions with keyword:", lowerKeyword);

		const categorizedResults = suggestions.reduce((acc, suggestion) => {
			console.log("Processing suggestion:", suggestion);
			if (!suggestion.dictionaryTerms) {
				console.warn("Skipping suggestion due to missing dictionaryTerms:", suggestion);
				return acc;
			}

			const term = normalizeText(suggestion.dictionaryTerms);
			// 로그2: 필터링 조건 검사
			const isMatch = term.includes(lowerKeyword);
			console.log(`Checking term: "${term}" vs keyword: "${lowerKeyword}" -> Match: ${isMatch}`);

			if (isMatch) {
				const category = getCategoryName(suggestion.dictionaryCode);
				console.log("Matched category:", category);

				if (!acc[category]) acc[category] = [];
				acc[category].push(suggestion);
			}

			return acc;
		}, {});

		console.log("Filtered categories result:", categorizedResults);
		setFilteredCategories(categorizedResults);
	};

	// Return category name based on code
	const getCategoryName = (code) => {
		switch (code) {
			case 1:
				return "금융";
			case 2:
				return "경제";
			case 3:
				return "경영";
			default:
				return "기타";
		}
	};

	// Debounce API search
	const debounceSearch = (keyword) => {
		if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
		debounceTimeoutRef.current = setTimeout(() => {
			if (keyword.trim() !== "") onSearch(keyword);
		}, 300);
	};

	// Reset suggestions
	const resetSuggestions = () => {
		setFilteredCategories({});
		setShowSuggestions(false);
		console.log("Suggestions reset.");
	};

	// Render suggestions
	const renderSuggestionsByCategory = () => {
		console.log("Rendering suggestions, showSuggestions:", showSuggestions);
		console.log("Filtered categories available:", filteredCategories);
		if (!showSuggestions || Object.keys(filteredCategories).length === 0) {
			console.log("No suggestions to render.");
			return null;
		}

		return (
			<div className="suggestions-list">
				{Object.entries(filteredCategories).map(([category, suggestions]) => (
					<div key={category} className="category-group">
						<h4>{category}</h4>
						<ul>
							{suggestions.map((suggestion) => (
								<li key={suggestion.dictionaryId}>
									{highlightMatch(suggestion.dictionaryTerms, value)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		);
	};

	// Highlight matching text
	const highlightMatch = (text, match) => {
		if (!match.trim()) return text;

		const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(`(${escapedMatch})`, "gi");
		return text.split(regex).map((part, index) => (
			part.toLowerCase() === match.toLowerCase() ? (
				<strong key={index} style={{ color: "blue" }}>{part}</strong>
			) : (
				<span key={index}>{part}</span>
			)
		));
	};

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
		};
	}, []);

	return (
		<div className="autocomplete-input" onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}>
			<input
				ref={ref}
				type="text"
				value={value || ""}
				placeholder="궁금한 금융 용어를 검색해 보세요."
				onChange={handleInputChange}
				onFocus={() => setShowSuggestions(true)}
			/>
			{renderSuggestionsByCategory()}
		</div>
	);
});

export default AutoCompleteInput;

