import React, { useEffect, useState } from "react";
import { getRepliesByComment, createReply, updateReply, deleteReply ,countRepliesByComment} from "../api/replyApi";
import {useSelector} from "react-redux";


const ReplyComponent = ({ commentId, memberId }) => {
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [editingReply, setEditingReply] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [replyCount, setReplyCount] = useState(0);

    const userId = useSelector(state => state.loginSlice.id);
    console.log("현재 로그인한 사용자 ID:", userId);



    //  특정 `commentId`에 대한 대댓글 불러오기
    const loadReplies = async () => {
        if (!commentId) {

            return;
        }
        try {
            console.log(` [API 요청] 대댓글 조회 - commentId=${commentId}`);
            const data = await getRepliesByComment(commentId);

            console.log(" [API 응답 데이터]:", data);

            if (!Array.isArray(data)) {

                return;
            }

            setReplies(data);
        } catch (error) {
            console.error(" 대댓글 조회 실패:", error);
            setReplies([]);
        }
    };

    useEffect(() => {
        if (showReplies) {
            console.log("📡 [useEffect 실행] 댓글 ID:", commentId);
            loadReplies();
        }
    }, [showReplies, commentId]);

    //  대댓글 개수 불러오기
    const loadReplyCount = async () => {
        const count = await countRepliesByComment(commentId);  //  기존 함수 사용
        setReplyCount(count);
    };

    useEffect(() => {
        loadReplyCount();
    }, [commentId]);

    useEffect(() => {
        if (showReplies) {
            console.log("📡 [useEffect 실행] 댓글 ID:", commentId);
            loadReplies();
        }
    }, [showReplies, commentId]);

    //  대댓글 등록

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) {
            console.error(" [ERROR] 대댓글 등록 실패 - 내용이 비어 있음!");
            return;
        }
        try {
            console.log(` [API 요청] 대댓글 등록`);
            await createReply({
                memberId:userId,
                commentId,
                replyContent,
            });
            setReplyContent("");
            loadReplies();
            setReplyCount(replyCount + 1);  //  대댓글 등록 후 개수 증가
        } catch (error) {
            console.error(" 대댓글 등록 실패:", error);
        }
    };


    // ✅ 대댓글 수정
    const handleUpdateReply = async (replyId) => {
        if (!editContent.trim()) {
            console.error(" [ERROR] 대댓글 수정 실패 - 내용이 비어 있음!");
            return;
        }
        try {
            console.log(`📡 [API 요청] 대댓글 수정 - replyId=${replyId}`);
            await updateReply(replyId, editContent);
            setEditingReply(null);
            setEditContent("");
            loadReplies();
        } catch (error) {
            console.error(" 대댓글 수정 실패:", error);
        }
    };

    // ✅ 대댓글 삭제
    const handleDeleteReply = async (replyId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                console.log(`📡 [API 요청] 대댓글 삭제 - replyId=${replyId}`);
                await deleteReply(replyId);
                // ✅ replies 상태에서도 즉시 삭제하여 화면에서 반영
                setReplies((prevReplies) => prevReplies.filter(reply => reply.replyId !== replyId));

                // ✅ replyCount 즉시 반영 (이전 상태 참조)
                setReplyCount(prev => Math.max(prev - 1, 0));  // 최소 0 이하로 내려가지 않도록 설정
                // loadReplies();
            } catch (error) {
                console.error("🚨 대댓글 삭제 실패:", error);
            }
        }
    };

    return (
        <div className="reply-container">
            {/* ✅ "답글 N개" 버튼  */}
            <button onClick={() => setShowReplies(!showReplies)} className="toggle-replies-btn">
                {replyCount === 0 ? "💬 답글 달기" : showReplies ? "▲ 답글 닫기" : `▼ 답글 ${replyCount}개`}

            </button>

            {showReplies && (
                <>
                    {/* ✅ 대댓글 입력창 */}
                    <form onSubmit={handleSubmit} className="reply-form">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="답글을 입력하세요"
                        />
                        <button type="submit">등록</button>
                    </form>

                    {/* ✅ 대댓글 목록 */}
                    <ul className="reply-list">
                        {replies.length > 0 ? (
                            replies.map((reply) => (
                                <li key={reply.replyId} className="reply-item">
                                    {editingReply === reply.replyId ? (
                                        <>
                                            <input
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                placeholder="답글 수정 중..."
                                            />
                                            <button className="btn-edit" onClick={() => handleUpdateReply(reply.replyId)}>✅ 수정 완료</button>
                                            <button className={"btn-delete"} onClick={() => setEditingReply(null)}>❌ 취소</button>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                ㄴ <strong>{reply.writer ?? "익명"}</strong> : {reply.replyContent}
                                            </p>
                                            {/* ✅  본인 작성 대댓글만 수정/삭제 버튼 표시 */}
                                            {reply.memberId === userId && (
                                                <>
                                                    <button className="btn-edit"
                                                        onClick={() => {
                                                            setEditingReply(reply.replyId);
                                                            setEditContent(reply.replyContent);
                                                        }}
                                                    > 수정</button>

                                                    <button className="btn-delete" onClick={() => handleDeleteReply(reply.replyId)}>삭제</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>📭 답글이 없습니다.</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ReplyComponent;















