
import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";



const CommunityComponent = ({
                                className,
                                view,
                                posts,
                                post,
                                onViewPost,
                                onSubmitPost,
                                onUpdatePost,
                                onDeletePost,
                                onChangeView = () => {},

                            }) => {
    const [form, setForm] = useState({
        pstTitle: "",
        pstContent: "",
        memberNickname: "",
        imagePaths: []
    });
    const memberInfo = useSelector((state) => state.loginSlice);
    const userId = useSelector(state => state.loginSlice.id);
    console.log("현재 로그인한 사용자 ID:", userId);
    const nickname = useSelector(state => state.loginSlice.nickname);

    //  게시글 수정 시 기존 값 불러오기
    useEffect(() => {
        if (post) {
            setForm({
                pstTitle: post.pstTitle || "",
                pstContent: post.pstContent || "",
                memberNickname: post.memberNickname || "",
                imagePaths: post.imagePaths || []
            });
        }else {
            setForm({
                pstTitle: "",
                pstContent: "",
                memberNickname: "",
                imagePaths: []
            });
        }
    }, [post]);

    //  입력값 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };


    //  등록 및 수정 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        if (post?.pstId) {
            onUpdatePost(post.pstId, form);
        } else {
            onSubmitPost(form);
        }
        //제출 후 입력 필드 초기화
        setForm({
            pstTitle: "",
            pstContent: "",
            memberNickname: "",
            imagePaths: []
        });

        onChangeView("list");
    };

    //  게시글 목록 뷰
    if (view === "list") {
        return (
            <div className="community-page">
                <h1>Community</h1>

                <button className="btn-submit" onClick={() => {
                    setForm({  // 새 게시글 작성 시 초기화
                        pstTitle: "",
                        pstContent: "",
                        memberNickname: "",
                        imagePaths: []
                    });
                    onChangeView("form");
                }}>
                     게시글 등록
                </button>

                {/* 게시글 리스트 */}
                <div className="post-list">  {/*  게시글 목록 스타일 적용 */}
                    {posts?.length ? (
                        posts.map(item => (

                            <div
                                key={item?.pstId ?? Math.random()}
                                className="post-item"  //  게시글 스타일 적용
                                onClick={() => item?.pstId ? onViewPost(item.pstId) : console.warn("🚨 pstId 없음:", item)}
                            >
                                <h3>{item?.pstTitle ?? "제목 없음"}</h3>
                                <p>{item?.pstContent ?? "내용 없음"}</p>
                                <small className="post-meta">🧍‍♂️작성자: {item?.memberNickname ?? "알 수 없음"}</small>
                                <small className="post-meta">
                                    📅
                                    등록일: {new Date(item?.createdAt).toLocaleDateString()}
                                </small>
                                <small className="post-meta">📝 수정일: {new Date(item?.updatedAt).toLocaleString()}</small>
                            </div>
                        ))
                    ) : (
                        <p>📭 게시글이 없습니다.</p>
                    )}
                </div>
            </div>
        );
    }

//  게시글 상세 뷰
    if (view === "detail") {
        console.log("📝 현재 게시글 데이터:", post);
        console.log("📝 현재 게시글 작성자 ID:", post?.memberId);
        console.log("📝 현재 로그인한 사용자 ID:", userId);
        console.log("📝 비교 결과:", post?.memberId === userId);
        return (
            <div className="post-detail">  {/* ✅ 게시글 상세 페이지 스타일 적용 */}
                <h2>{post?.pstTitle}</h2>
                <p>{post?.pstContent}</p>
                <p className="post-meta">작성자: {post?.memberNickname}</p>
                <small>
                <p className="post-meta">등록일: {new Date(post?.createdAt).toLocaleString()}</p>
                <p className="post-meta">수정일: {new Date(post?.updatedAt).toLocaleString()}</p>
                </small>

                {/*//0227 수정*/}

                {/* ✅ 로그인한 사용자(userId)와 게시글 작성자(post.memberId)를 비교하여 수정/삭제 버튼 표시 */}
                {post?.memberId === userId && (
                    <>
                        <button className="btn-edit" onClick={() => onUpdatePost(post.pstId)}> 수정</button>
                        <button className="btn-delete" onClick={() => onDeletePost(post.pstId)}> 삭제</button>
                    </>
                )}

            </div>
        );
    }

//  게시글 작성 및 수정 뷰
    if (view === "form") {
        return (
            <form className="post-form" onSubmit={handleSubmit}>  {/* ✅ 게시글 폼 스타일 적용 */}
                <input
                    name="pstTitle"
                    placeholder="제목"
                    value={form.pstTitle}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="pstContent"
                    placeholder="내용"
                    value={form.pstContent}
                    onChange={handleChange}
                    required
                />

                {/*✅ 버튼 스타일 적용 *!/*/}
                <div className="button-group">
                    <button type="submit" className="btn btn-submit">
                        {post?.pstId ? " 수정" : " 등록"}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => {
                        onChangeView("list");
                    }}>
                         취소
                    </button>
                </div>
            </form>
        );
    }

    return <p>🚧 화면을 준비 중입니다...</p>;
};

export default CommunityComponent;

