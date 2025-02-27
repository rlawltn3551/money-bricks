package com.moneybricks.qna.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.qna.dto.QnaReplyDTO;

public interface QnaReplyService {

    Long register(QnaReplyDTO qnaReplyDTO);
    QnaReplyDTO read(Long qrno);

    void modify(QnaReplyDTO qnaReplyDTO);

    void remove(Long qrno);

    // 특정 게시물의 댓글 목록을 페이징 처리해서 조회
    PageResponseDTO<QnaReplyDTO> getListOfBoard(Long qno, PageRequestDTO pageRequestDTO);
}
