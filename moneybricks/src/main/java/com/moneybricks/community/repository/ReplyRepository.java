package com.moneybricks.community.repository;

import com.moneybricks.community.domain.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {


    //  `fetch join`을 사용하여 `Member` 정보를 같이 가져옴
    @Query("SELECT r FROM Reply r JOIN FETCH r.member WHERE r.comment.cmtId = :commentId")
    List<Reply> findByCommentId(@Param("commentId") Long commentId);


    //  특정 댓글에 달린 대댓글 개수
    @Query("SELECT COUNT(r) FROM Reply r WHERE r.comment.cmtId = :commentId")
    Long countByCommentId(@Param("commentId") Long commentId);










}
