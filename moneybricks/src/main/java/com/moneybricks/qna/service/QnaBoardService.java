package com.moneybricks.qna.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.qna.domain.QnaBoard;
import com.moneybricks.qna.dto.QnaBoardDTO;

public interface QnaBoardService {

    Long register(QnaBoardDTO qnaBoardDTO);
    QnaBoardDTO readOne(Long qno);
    void modify(QnaBoardDTO qnaBoardDTO);
    void remove(Long qno);
    PageResponseDTO<QnaBoardDTO> list(PageRequestDTO pageRequestDTO);

    default QnaBoard dtoToEntity(QnaBoardDTO qnaBoardDTO){

        QnaBoard qnaBoard = QnaBoard.builder()
                .qno(qnaBoardDTO.getQno())
                .title(qnaBoardDTO.getTitle())
                .content(qnaBoardDTO.getContent())
                .writer(qnaBoardDTO.getWriter())
                .notice(qnaBoardDTO.isNotice())
                .secret(qnaBoardDTO.isSecret())
                .build();

        return qnaBoard;
    }

    // qnaBoard -> qnaBoardDTO
    default QnaBoardDTO entityToDTO(QnaBoard qnaBoard){

        QnaBoardDTO qnaBoardDTO = QnaBoardDTO.builder()
                .qno(qnaBoard.getQno())
                .title(qnaBoard.getTitle())
                .content(qnaBoard.getContent())
                .writer(qnaBoard.getWriter())
                .notice(qnaBoard.isNotice())
                .secret(qnaBoard.isSecret())
                .createdAt(qnaBoard.getCreatedAt())
                .updatedAt(qnaBoard.getUpdatedAt())
                .build();

        return qnaBoardDTO;
    }
}
