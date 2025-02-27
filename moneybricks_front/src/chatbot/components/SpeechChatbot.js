import React, {useState} from 'react';
import SpeechToText from "./SpeechToText";

const SpeechChatbot = () => {
    const [chatResponse, setChatResponse] = useState("");

    return (
        <div className="speech-box">
            <SpeechToText onSend={setChatResponse} />
            {chatResponse && (
                <div className="response-box">
                    <p className="response-chatbot-line">챗봇 응답:</p>
                    <p className="response-chatbot">{chatResponse}</p>
                </div>
            )}
        </div>
    );
};

export default SpeechChatbot;