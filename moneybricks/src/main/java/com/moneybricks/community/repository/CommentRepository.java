package com.moneybricks.community.repository;

import com.moneybricks.community.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {




    @Query("SELECT c FROM Comment c JOIN FETCH c.member WHERE c.post.pstId = :postId ORDER BY c.createdAt ASC")
    List<Comment> findAllByPostPstId(@Param("postId") Long postId);


}

