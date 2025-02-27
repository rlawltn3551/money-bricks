import React, { useEffect, useState } from "react";
import "../styles/CommunityPage.scss";
import CommunityComponent from "../components/CommunityComponent";
import CommentComponent from "../components/CommentComponent";
import {
	addComment,
	createPost,
	deleteComment,
	deletePost,
	fetchComments,
	fetchPost,
	fetchPosts,
	updateComment,
	updatePost,
} from "../api/communityApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import loginSlice from "../../common/slices/loginSlice";
import BasicMenu from "../../common/components/BasicMenu";

const CommunityPage = () => {
	const { pstId } = useParams();
	const [view, setView] = useState("list");
	const [posts, setPosts] = useState([]);


	// 페이징 관련 상태 추가
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(10);
	const [totalPosts, setTotalPosts] = useState(0);

	const [currentPost, setCurrentPost] = useState(null);
	const [comments, setComments] = useState([]);
	const userId = useSelector((state) => loginSlice.id);
	const username = useSelector((state) => loginSlice.name);

	//  게시글 목록 조회
	useEffect(() => {
		if (view === "list") {
			fetchPosts()
				.then(data => {
					const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
					setPosts(sortedPosts);
					setTotalPosts(sortedPosts.length);
				})
				.catch(console.error);
		}
	}, [view]);
	//  게시물 상세 조회
	useEffect(() => {
		if (pstId && view === "detail") {
			handleViewPost(pstId);
		}
	}, [pstId, view]);

	//  게시물 상세 조회 핸들러
	const handleViewPost = async (postId) => {
		try {
			const post = await fetchPost(postId);
			const comments = await fetchComments(postId);
			setCurrentPost(post);
			setComments(Array.isArray(comments) ? comments : []);
			setView("detail");
		} catch (error) {

		}
	};

	//  게시물 등록 핸들러
	const handleCreatePost = async (postData) => {
		try {
			//  새 게시글 등록 요청
			const newPost = await createPost(postData);
			console.log("[등록된 게시물]:", newPost);

			//  서버에서 최신 목록을 가져와 UI 업데이트
			const updatedPosts = await fetchPosts();
			const sortedPosts = updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			setPosts(sortedPosts);
			setTotalPosts(sortedPosts.length);

			alert("✅ 게시물이 등록되었습니다.");
			setView("list");  // 등록 후 목록 화면으로 전환
			setCurrentPage(1); // 첫 페이지로 이동
		} catch (error) {
			console.error("🚨 게시물 등록 실패:", error);
			alert("🚨 게시물 등록 중 오류가 발생했습니다.");
		}
	};

	// 게시물 수정 핸들러
	const handleUpdatePost = async (postId, postData) => {
		try {
			await updatePost(postId, postData);
			alert("✅ 게시물이 수정되었습니다.");

			// 게시물 수정 후에도 최신 목록을 다시 가져와 업데이트
			const updatedPosts = await fetchPosts();
			const sortedPosts = updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			setPosts(sortedPosts);
			setTotalPosts(sortedPosts.length);

			setView("list");
		} catch (error) {

		}
	};

	//  게시물 삭제 핸들러
	const handleDeletePost = async (postId) => {
		if (window.confirm("정말 삭제하시겠습니까?")) {
			try {
				await deletePost(postId);

				// 게시물 삭제 후 목록을 다시 가져와 업데이트
				const updatedPosts = await fetchPosts();
				const sortedPosts = updatedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				setPosts(sortedPosts);
				setTotalPosts(sortedPosts.length);

				alert("🗑️ 게시물이 삭제되었습니다.");
				setView("list");

				// 현재 페이지에 게시물이 없는 경우 이전 페이지로 이동
				const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
				if (currentPage > totalPages && currentPage > 1) {
					setCurrentPage(totalPages);
				}
			} catch (error) {

			}
		}
	};

	//  댓글 등록 핸들러
	const handleAddComment = async (commentData) => {
		try {
			await addComment(commentData);
			const updatedComments = await fetchComments(commentData.pstId);
			setComments(Array.isArray(updatedComments) ? updatedComments : []);
		} catch (error) {
			console.error(" 댓글 등록 실패:", error.response?.data || error.message);
			alert("🚨 댓글 등록 중 오류가 발생했습니다.");
		}
	};

	// 페이징 처리 - 현재 페이지에 표시할 게시물 계산
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

	// 페이지 변경 핸들러
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// 페이지네이션 렌더링 함수
	const renderPagination = () => {
		const totalPages = Math.ceil(totalPosts / postsPerPage);
		const maxPageButtons = 5;
		const pageNumbers = [];

		let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
		let endPage = startPage + maxPageButtons - 1;

		if (endPage > totalPages) {
			endPage = totalPages;
			startPage = Math.max(1, endPage - maxPageButtons + 1);
		}

		// 이전 페이지 버튼
		if (currentPage > 1) {
			pageNumbers.push(
				<button
					key="prev"
					onClick={() => handlePageChange(currentPage - 1)}
					className="pagination-button"
				>
					이전
				</button>,
			);
		}

		// 페이지 번호 버튼
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`pagination-button ${currentPage === i ? "active" : ""}`}
				>
					{i}
				</button>,
			);
		}

		// 다음 페이지 버튼
		if (currentPage < totalPages) {
			pageNumbers.push(
				<button
					key="next"
					onClick={() => handlePageChange(currentPage + 1)}
					className="pagination-button"
				>
					다음
				</button>,
			);
		}

		return (
			<div className="pagination">
				{pageNumbers}
				<div className="page-info">
					{totalPosts > 0 ? `${currentPage} / ${totalPages} 페이지 (총 ${totalPosts}건)` : "게시물이 없습니다"}
				</div>
			</div>
		);
	};

	// 한 페이지당 게시물 수 변경 핸들러
	const handlePostsPerPageChange = (e) => {
		setPostsPerPage(Number(e.target.value));
		setCurrentPage(1); // 페이지 크기 변경 시 1페이지로 리셋
	};

	return (
		<>
			<BasicMenu />
			<div className="community-page">


				{/*  LIST */}
				{view === "list" && (
					<>
						<div className="posts-per-page-selector">
							<label>
								페이지당 게시물 수:
								<select value={postsPerPage} onChange={handlePostsPerPageChange}>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>

								</select>
							</label>
						</div>

						<CommunityComponent
							view="list"
							posts={currentPosts} // 전체 posts 대신 현재 페이지의 posts만 전달
							onViewPost={handleViewPost}
							onChangeView={(newView) => {
								if (newView === "form") {
									setCurrentPost(null);  // ✅ 새 게시물 작성 시 기존 데이터 초기화
								}
								setView(newView);
							}}
						/>

						{/* 페이지네이션 컴포넌트 */}
						{renderPagination()}
					</>
				)}

				{/*  Detail */}
				{view === "detail" && currentPost && (
					<>
						<CommunityComponent
							className="post-detail"
							view="detail"
							post={currentPost}
							onUpdatePost={() => setView("form")}
							onDeletePost={handleDeletePost}
						/>
						<CommentComponent
							className="comment-section"
							pstId={currentPost.pstId}
							comments={comments}
							onAddComment={handleAddComment}
							onUpdateComment={updateComment}
							onDeleteComment={deleteComment}
						/>
					</>
				)}

				{/*  게시글 작성 및 수정 */}
				{view === "form" && (
					<div className="form-container">
						<CommunityComponent
							view="form"
							post={currentPost}
							onSubmitPost={handleCreatePost}  // 등록 핸들러
							onUpdatePost={handleUpdatePost}  // 수정 핸들러
							onChangeView={setView}           // 뷰 전환 핸들러
						/>
					</div>
				)}

				{/* 🔙 목록으로 버튼 */}
				{view !== "list" && (
					<button type="button" onClick={() => setView("list")} className="btn btn-cancel">
						🔙 목록으로
					</button>
				)}
			</div>
		</>
	);
};

export default CommunityPage;

