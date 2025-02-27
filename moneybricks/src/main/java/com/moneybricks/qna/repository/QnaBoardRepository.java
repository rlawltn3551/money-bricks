package com.moneybricks.qna.repository;

import com.moneybricks.qna.domain.QnaBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaBoardRepository extends JpaRepository<QnaBoard, Long> {
}
