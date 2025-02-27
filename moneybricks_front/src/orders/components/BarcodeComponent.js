import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";  // 기본 임포트

const BarcodeComponent = ({ orderId }) => {
	const barcodeRef = useRef(null);
	const [barcodeValue, setBarcodeValue] = useState("");

	useEffect(() => {
		// 바코드 생성 (랜덤 문자열)
		const generateBarcode = () => {
			// 바코드를 위한 랜덤 문자열 생성 (영문, 숫자 포함)
			const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			let barcodeStr = "";
			for (let i = 0; i < 12; i++) {
				barcodeStr += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return barcodeStr;
		};

		const generatedBarcode = generateBarcode();
		setBarcodeValue(generatedBarcode);

		if (barcodeRef.current) {
			try {
				JsBarcode(barcodeRef.current, generatedBarcode, {
					format: "CODE128",  // 바코드 포맷 (CODE128)
					displayValue: true,  // 바코드 아래에 숫자/문자 표시
					fontSize: 16,  // 숫자 크기
					width: 2,  // 바코드의 각 막대의 너비 (얇게 설정)
					height: 80,  // 바코드 높이 (세로 길이)
					margin: 10,  // 여백
					background: "#ffffff",  // 배경색
					lineColor: "#000000",  // 바코드 막대의 색상
				});
			} catch (error) {
				console.error("바코드 생성 오류:", error);
			}
		}
	}, [orderId]);

	return (
		<div className="barcode-container">
			<svg ref={barcodeRef}></svg>
		</div>
	);
};

export default BarcodeComponent;
