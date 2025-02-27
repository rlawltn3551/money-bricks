package com.moneybricks.community.repository;

import com.moneybricks.community.domain.CommunityPost;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    @EntityGraph(attributePaths = {"member"})
    @Query("SELECT p FROM CommunityPost p JOIN FETCH p.member WHERE p.pstId = :pstId")
    Optional<CommunityPost> findByPstId(@Param("pstId") Long pstId);

    //  특정 게시글 삭제 시, **대댓글 → 댓글 → 게시글** 순서로 한 번에 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM Reply r WHERE r.comment.cmtId IN (SELECT c.cmtId FROM Comment c WHERE c.post.pstId = :postId)")
    void deleteRepliesByPostId(@Param("postId") Long postId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.post.pstId = :postId")
    void deleteCommentsByPostId(@Param("postId") Long postId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CommunityPost p WHERE p.pstId = :postId")
    void deletePostByPostId(@Param("postId") Long postId);
}