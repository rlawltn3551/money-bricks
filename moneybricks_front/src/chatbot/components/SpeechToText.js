import { useState, useRef } from "react";
import "../styles/SpeechToText.scss";

const SpeechToText = ({ onSend }) => {
    const [isListening, setIsListening] = useState(false);
    const [statusMessage, setStatusMessage] = useState("음성을 말해주세요.");
    const timeoutId = useRef(null);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        setStatusMessage("음성 인식 중...");
    };

    recognition.onresult = async (event) => {
        clearTimeout(timeoutId.current);
        const transcript = event.results[0][0].transcript;
        setIsListening(false);

        try {
            setStatusMessage("응답 처리 중...");

            const response = await fetch("http://localhost:5000/info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: transcript }),
            });

            const data = await response.json();

            onSend({ sender: "bot", text: data.response });

            setStatusMessage("인식 완료!");
        } catch (error) {
            console.error("음성 API 오류:", error);
            setStatusMessage("오류 발생! 다시 시도하세요.");
        }
    };

    recognition.onerror = (event) => {
        console.error("음성 인식 오류:", event.error);
        setIsListening(false);
        setStatusMessage("음성 인식 실패, 다시 시도하세요.");
    };

    recognition.onend = () => {
        setIsListening(false);
        setStatusMessage("음성을 말하세요...");
    };

    const handleSpeechRecognition = () => {
        if (isListening) {
            recognition.stop();
            clearTimeout(timeoutId.current);
            setStatusMessage("음성 인식 중지됨");
        } else {
            recognition.start();
            timeoutId.current = setTimeout(() => {
                recognition.stop();
                setStatusMessage("입력 시간 초과");
            }, 10000);
        }
        setIsListening(!isListening);
    };

    return (
        <div className="speech-header">
            <button
                onClick={handleSpeechRecognition}
                className={`px-4 py-2 rounded-lg text-white ${isListening ? "bg-red-500" : "bg-blue-500"} transition`}>
                {isListening ? "음성 인식 중지" : "음성 인식 시작"}
            </button>
            <p className="speech-text">{statusMessage}</p>
        </div>
    );
};

export default SpeechToText;