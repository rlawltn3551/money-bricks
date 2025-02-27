package com.moneybricks.qna.repository;

import com.moneybricks.qna.domain.QnaBoard;
import com.moneybricks.qna.domain.QnaReply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QnaReplyRepository extends JpaRepository<QnaReply, Long> {
    @Query("select qr from QnaReply qr where qr.qnaBoard.qno = :qno")
    Page<QnaReply> listOfBoard(@Param("qno") Long qno, Pageable pageable);

    // 특정 게시글의 댓글 목록 조회
    Page<QnaReply> findByQnaBoardQno(Long qno, Pageable pageable);

    void deleteByQnaBoard_qno(Long qno);

    // 특정 게시글의 댓글 수를 카운트
    long countByQnaBoard(QnaBoard qnaBoard);
}
