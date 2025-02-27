package com.moneybricks.qna.controller;

import com.moneybricks.common.dto.PageRequestDTO;
import com.moneybricks.common.dto.PageResponseDTO;
import com.moneybricks.member.dto.MemberDTO;
import com.moneybricks.qna.dto.QnaBoardDTO;
import com.moneybricks.qna.dto.QnaBoardListAllDTO;
import com.moneybricks.qna.dto.QnaReplyDTO;
import com.moneybricks.qna.service.QnaBoardService;
import com.moneybricks.qna.service.QnaReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@Log4j2
@RequestMapping("/api/qna")// localhost:8080/board
@RequiredArgsConstructor
public class QnaBoardController {

    private final QnaBoardService qnaBoardService;
    private final QnaReplyService qnaReplyService;


    // 게시글 리스트
    @GetMapping("/list")
    public PageResponseDTO<QnaBoardDTO> list(PageRequestDTO pageRequestDTO){

        log.info(pageRequestDTO);

        return qnaBoardService.list(pageRequestDTO);
    }

    // 댓글 리스트
    @GetMapping(value = "/list/{qno}")
    public PageResponseDTO<QnaReplyDTO> getList(@PathVariable("qno") Long qno,
                                                PageRequestDTO pageRequestDTO){

        PageResponseDTO<QnaReplyDTO> responseDTO = qnaReplyService.getListOfBoard(qno, pageRequestDTO);

        return responseDTO;
    }

    // 고객센터 게시글 등록 페이지 조회
    @PreAuthorize("hasRole('USER')") // 해당 경로에 접근할 때 user의 권한을 체크
    @GetMapping("/register")
    public void registerGET(){
    }

    // 고객센터 게시글 등록
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/register")
    public Map<String, Long> register(@RequestBody QnaBoardDTO qnaBoardDTO, @AuthenticationPrincipal MemberDTO memberDTO){

        if (memberDTO == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        if (memberDTO.getName() == null || memberDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("아이디 정보가 없습니다.");
        }
        qnaBoardDTO.setWriter(memberDTO.getName());

        // 로그인된 사용자 정보 활용
        String name = memberDTO.getUsername();
        qnaBoardDTO.setWriter(name); // 게시글 작성자 설정

        log.info("QnaBoardDTO: " + qnaBoardDTO);

        Long qno = qnaBoardService.register(qnaBoardDTO);

        return Map.of("QNO", qno);
    }

    // 상세 페이지 및 댓글 조회
//    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{qno}")
    public QnaBoardListAllDTO readOne(@PathVariable Long qno, PageRequestDTO pageRequestDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

        log.info("Fetching board details for Qno: {}", qno);

        // 게시글 상세 정보 조회
        QnaBoardDTO qnaBoardDTO = qnaBoardService.readOne(qno);

        // 댓글 목록 조회
        PageResponseDTO<QnaReplyDTO> replyDTOPageResponseDTO = qnaReplyService.getListOfBoard(qno, pageRequestDTO);

        // 통합된 DTO 반환
        return QnaBoardListAllDTO.builder()
                .board(qnaBoardDTO)
                .replies(replyDTOPageResponseDTO)
                .build();
    }

    // 댓글 등록
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/reply")
    public Map<String, Long> registerReply(@RequestBody QnaReplyDTO qnaReplyDTO) {

        log.info("Registering Reply: {}", qnaReplyDTO);

        Long qrno = qnaReplyService.register(qnaReplyDTO);
        return Map.of("QRNO", qrno);
    }

    // 댓글 삭제
    @DeleteMapping("/reply/{qrno}")
    public Map<String, Long> removeReply(@PathVariable("qrno") Long qrno) {
        log.info("Deleting Reply: {}", qrno);
        qnaReplyService.remove(qrno);
        return Map.of("qrno", qrno);
    }

    // 댓글 수정
    @PutMapping("/reply/{qrno}")
    public Map<String, Long> modifyReply(@PathVariable("qrno") Long qrno, @RequestBody QnaReplyDTO qnaReplyDTO) {
        log.info("Modifying Reply: {}", qrno);
        qnaReplyDTO.setQrno(qrno);
        qnaReplyService.modify(qnaReplyDTO);
        return Map.of("qrno", qrno);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/modify/{qno}")
    public QnaBoardDTO getModify(@PathVariable(name = "qno") Long qno, PageRequestDTO pageRequestDTO) {

        // Modify에 대한 별도 처리
        QnaBoardDTO qnaBoardDTO = qnaBoardService.readOne(qno);

        log.info(qnaBoardDTO);

        return qnaBoardDTO;
    }

    @PutMapping("/{qno}")
    public Map<String, String> modify(@PathVariable(name = "qno") Long qno, @RequestBody QnaBoardDTO qnaBoardDTO, @AuthenticationPrincipal MemberDTO memberDTO) {

        qnaBoardDTO.setQno(qno);
        qnaBoardDTO.setWriter(memberDTO.getName());

//        // 로그인된 사용자 정보 활용
//        String id = memberDTO.getId();
//        qnaBoardDTO.setWriter(id); // 게시글 작성자 설정

        log.info("qno from PathVariable: {}", qno);
        log.info("Modifying Board: {}", qnaBoardDTO);

        qnaBoardService.modify(qnaBoardDTO);

        return Map.of("RESULT", "SUCCESS");
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{qno}")
    public Map<String, String> remove(@PathVariable(name = "qno") Long qno) {


        log.info("Removing Board: {}", qno);

        qnaBoardService.remove(qno);

        return Map.of("RESULT", "SUCCESS");
        }
}
