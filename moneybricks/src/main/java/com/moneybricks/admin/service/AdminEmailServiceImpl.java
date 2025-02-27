package com.moneybricks.admin.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.io.UnsupportedEncodingException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminEmailServiceImpl implements AdminEmailService {

    private final JavaMailSender mailSender; // Spring의 메일 전송 도구

    @Override
    public void sendEmails(List<String> toAddresses, String subject, String body) {
        for (String to : toAddresses) {
            try {
                sendEmail(to, subject, body);
                log.info("이메일 발송 성공: {}", to);
            } catch (Exception e) {
                log.error("이메일 발송 실패: {}, 에러: {}", to, e.getMessage());
            }
        }
    }

    private void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // 수신자 이메일, 제목, 본문 설정
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);

        // 발신자 이메일 주소와 발신자 이름 설정
        String fromEmail = "rlawltn3551@gmail.com";  // 발신자 이메일 주소
        String companyName = "MONEY BRICKS";    // 회사 이름
        try {
            helper.setFrom(fromEmail, companyName);      // 회사 이름을 발신자 이름으로 설정
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        mailSender.send(message); // 이메일 발송 실행
    }
}
