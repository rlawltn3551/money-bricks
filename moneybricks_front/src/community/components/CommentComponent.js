import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReplyComponent from "./ReplyComponent"
import {useSelector} from "react-redux";

const CommentComponent = ({
                              comments = [],
                              pstId,
                              memberId = 1,
                              onAddComment,
                              onUpdateComment,
                              onDeleteComment,
                          }) => {
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [localComments, setLocalComments] = useState(comments); //  로컬 상태 추가
    const userId = useSelector(state => state.loginSlice.id);  // 현재 로그인한 사용자 ID
    console.log("현재 로그인한 사용자 ID:", userId);

    //  useEffect로 props.comments 변경 시 자동 업데이트
    useEffect(() => {

        setLocalComments(Array.isArray(comments) ? comments : []);
    }, [comments]);

    //  댓글 등록
    const handleAddComment = () => {
        if (!pstId) {
            alert(" 게시글 정보(pstId)가 없습니다.");
            return;
        }
        if (newComment.trim()) {
            const newCommentData = {
                cmtId: Date.now(),
                cmtContent: newComment,
                memberNickname: "나",
                memberId: userId,
                pstId,
            };

            //  즉시 로컬 업데이트 (새로고침 없이 실시간 반영)
            setLocalComments([...localComments, newCommentData]);

            // 부모 컴포넌트(API 호출)
            onAddComment({ cmtContent: newComment, pstId, memberId });
            console.log("✅ [프론트엔드] 댓글 등록 요청:", newCommentData);

            setNewComment("");
        } else {
            alert("댓글 내용을 입력해주세요.");
        }
    };

    //  댓글 수정
    const handleUpdateComment = (cmtId) => {
        if (!editContent.trim()) {
            alert("수정할 내용을 입력해주세요.");
            return;
        }

        //  즉시 로컬 업데이트
        setLocalComments(localComments.map(comment =>
            comment.cmtId === cmtId ? { ...comment, cmtContent: editContent } : comment
        ));

        //  부모 컴포넌트(API 호출)
        onUpdateComment(cmtId, { cmtContent: editContent, pstId, memberId });
        console.log(" [프론트엔드] 댓글 수정 요청:", { cmtId, cmtContent: editContent });

        setEditCommentId(null);
        setEditContent("");
    };

    //  댓글 삭제
    const handleDeleteComment = (cmtId) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            //  즉시 로컬 업데이트
            setLocalComments(localComments.filter(comment => comment.cmtId !== cmtId));

            // 부모 컴포넌트(API 호출)
            onDeleteComment(cmtId);
            console.log(" [프론트엔드] 댓글 삭제 요청: cmtId=", cmtId);
        }
    };

    return (
        <div className="comment-section">
            <h3>💬 댓글</h3>

            {/*  댓글 입력창 */}
            <div className="comment-input">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={handleAddComment}>댓글 등록</button>
            </div>

            {/*  댓글 목록 */}
            {localComments.length === 0 ? (
                <p>📭 댓글이 없습니다.</p>
            ) : (
                localComments.map((comment) => (
                    <div key={comment.cmtId} className="comment-item">
                        {editCommentId === comment.cmtId ? (
                            <>
                                {/*  댓글 수정 폼 */}
                                <input
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="댓글 수정 중..."
                                />
                                <button className="btn-edit" onClick={() => handleUpdateComment(comment.cmtId)}>
                                    ✅ 수정 완료
                                </button>
                                <button className="btn-cancel" onClick={() => setEditCommentId(null)}>
                                    ❌ 취소
                                </button>
                            </>
                        ) : (
                            <>
                                {/*  댓글 표시 */}

                                <p>
                                    <strong>{comment.writer ?? "익명"}</strong>: {comment.cmtContent}
                                </p>

                                {/*  본인 댓글만 수정/삭제 버튼 표시 */}
                                {comment.memberId === userId && (
                                    <>
                                        <button className="btn-edit" onClick={() => {
                                            setEditCommentId(comment.cmtId);
                                            setEditContent(comment.cmtContent);
                                        }}>
                                             수정
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteComment(comment.cmtId)}>
                                             삭제
                                        </button>
                                    </>
                                )}

                                {/* ✅ 댓글 아래에 대댓글 추가 */}
                                <ReplyComponent commentId={comment.cmtId} memberId={memberId} />
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

CommentComponent.propTypes = {
    comments: PropTypes.array.isRequired,
    pstId: PropTypes.number.isRequired,
    memberId: PropTypes.number,
    onAddComment: PropTypes.func.isRequired,
    onUpdateComment: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
};

export default CommentComponent;



