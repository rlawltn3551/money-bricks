import {useEffect, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import "../styles/ChatbotComponent.scss";
import {Mic, Send} from "lucide-react";
import SpeechToText from "./SpeechToText";

const categories = [
    {
        name: "포인트 조회",
        table: "points",
        instructions: `아래 내역 중 해당하는 내용을 클릭하세요.\n
- [내 포인트 조회](http://localhost:3000/mypage/point)
- [내 포인트 사용 내역](http://localhost:3000/mypage/point-history/list)`,
    },
    {
        name: "적금 조회",
        table: "savings_accounts",
        instructions: `아래 내역 중 해당하는 내용을 클릭하세요.\n
- [내 적금 이자율](http://localhost:3000/mypage/account)
- [적금 횟수](http://localhost:3000/mypage/deposit-history/current/list)`,
    },
    {
        name: "금융 용어 문의",
        table: "dictionary",
        instructions: `궁금한 단어를 입력하면 설명해 드립니다.`,
    },
];

function Chatbot({ userId, username }) {
    const [message, setMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [chatHistory, setChatHistory] = useState([
        { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" } // 챗봇 초기 멘트
    ]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);

    // 최신 메시지가 추가되면 자동으로 스크롤 이동
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chatHistory]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const categoryMessage = `"${category.name}" 카테고리를 선택하셨습니다.\n${category.instructions}`;

        setChatHistory((prev) => [
            ...prev, { sender: "bot", text: categoryMessage },
        ]);
    };

    const sendTextMessage = async (text) => {
        if (!text.trim()) return;

        setChatHistory((prev) => [...prev, { sender: "user", text }]);
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5000/info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    userId,
                    username,
                    category: selectedCategory?.table || null,
                }),
            });

            const data = await res.json();

            setChatHistory((prev) => [
                ...prev,
                { sender: "bot", text: data.response || "죄송합니다. 응답을 받아오지 못했습니다." }
            ]);
        } catch (error) {
            console.error("서버 요청 오류:", error);
            setChatHistory((prev) => [
                ...prev,
                { sender: "bot", text: "응답을 받아오지 못했습니다. 다시 시도해주세요." },
            ]);
        } finally {
            setIsLoading(false);
        }

        setMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendTextMessage(message);
    };

    const handleVoiceInput = (botResponse) => {
        console.log("🎙 음성 응답 수신:", botResponse);

        if (typeof botResponse === "object" && botResponse.text) {
            setChatHistory((prev) => [...prev, botResponse]);
        }

        setIsListening(false);
    };

    const renderers = {
        link: ({href, children}) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="chat-link">
                {children}
            </a>
        )
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">챗봇</div>

            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.sender}`}>
                        <ReactMarkdown className="category-chat-response" components={renderers}>{chat.text}</ReactMarkdown>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message bot loading-message">
                        ⏳ 응답 중 입니다. 잠시만 기다려 주세요...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="category-buttons">
                {categories.map((cat) => (
                    <button
                        key={cat.table}
                        onClick={() => handleCategorySelect(cat)}
                        className={`category-btn ${
                            selectedCategory?.table === cat.table ? "selected" : ""
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={isLoading}>
                    <Send size={18} />
                </button>
                <button type="button" className="mic-btn" onClick={() => setIsListening(true)}>
                    <Mic size={18} />
                </button>
            </form>

            {isListening && <SpeechToText onSend={handleVoiceInput} />}
        </div>
    );
}

export default Chatbot;