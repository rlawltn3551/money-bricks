package com.moneybricks.qna.service;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.qna.domain.QnaBoard;
import com.moneybricks.qna.domain.QnaReplyStatus;
import com.moneybricks.qna.dto.QnaBoardDTO;
import com.moneybricks.qna.repository.QnaBoardRepository;
import com.moneybricks.qna.repository.QnaReplyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class QnaBoardServiceImpl implements QnaBoardService {

    private final ModelMapper modelMapper;
    private final QnaBoardRepository qnaBoardRepository;
    private final QnaReplyRepository qnaReplyRepository;

    @Override
    public Long register(QnaBoardDTO qnaBoardDTO) {

        QnaBoard qnaBoard = dtoToEntity(qnaBoardDTO);

        Long qno = qnaBoardRepository.save(qnaBoard).getQno();

        return qno;
    }

    @Override
    public QnaBoardDTO readOne(Long qno) {

        Optional<QnaBoard> result = qnaBoardRepository.findById(qno);

        QnaBoard qnaBoard = result.orElseThrow();

        // 쿼리문에 직접 접근하지 않는다.
        QnaBoardDTO qnaBoardDTO = entityToDTO(qnaBoard);

        return qnaBoardDTO;
    }

    @Override
    public void modify(QnaBoardDTO qnaBoardDTO) {

        Optional<QnaBoard> result = qnaBoardRepository.findById(qnaBoardDTO.getQno());

        QnaBoard qnaBoard = result.orElseThrow(() ->
                new RuntimeException("QnaBoard not found with qno: " + qnaBoardDTO.getQno())
        );

        qnaBoard.change(
                qnaBoardDTO.getTitle(),
                qnaBoardDTO.getContent(),
                qnaBoardDTO.isNotice(),
                qnaBoardDTO.isSecret()
        );

        qnaBoardRepository.save(qnaBoard);
    }

    @Override
    public void remove(Long qno) {

        // 게시글과 연결된 댓글 삭제
        qnaReplyRepository.deleteByQnaBoard_qno(qno);

        // 게시글 삭제
        qnaBoardRepository.deleteById(qno);
    }


    @Override
    public PageResponseDTO<QnaBoardDTO> list(PageRequestDTO pageRequestDTO) {

            Pageable pageable =
                    PageRequest.of(
                            pageRequestDTO.getPage() - 1 ,  // 1페이지가 0이므로 주의
                            pageRequestDTO.getSize(),
                            Sort.by("qno").descending());

            // 전체 게시글 조회
            Page<QnaBoard> result = qnaBoardRepository.findAll(pageable);

        // DTO 리스트 생성 (댓글 상태 추가)
        List<QnaBoardDTO> dtoList = result.getContent().stream()
                .map(qna -> {
                    QnaBoardDTO dto = modelMapper.map(qna, QnaBoardDTO.class);

                    // 댓글 상태 계산
                    long replyCount = qnaReplyRepository.countByQnaBoard(qna);
                    dto.setQnaReplyStatus(replyCount > 0 ? QnaReplyStatus.COMPLETED : QnaReplyStatus.WAITING);

                    return dto;
                })
                .collect(Collectors.toList());

            long totalCount = result.getTotalElements();

            PageResponseDTO<QnaBoardDTO> responseDTO = PageResponseDTO.<QnaBoardDTO>withAll()
                    .dtoList(dtoList)
                    .pageRequestDTO(pageRequestDTO)
                    .totalCount(totalCount)
                    .build();

            return responseDTO;
    }

}
