package com.Demiexample.DemiProjectWW.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation
    .Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(
            String toEmail, String otp) {

        SimpleMailMessage message =
            new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(
            "WealthWise - Password Reset OTP");
        message.setText(
            "Hello,\n\n" +
            "Your OTP for password reset is:\n\n" +
            "        " + otp + "\n\n" +
            "This OTP is valid for 10 minutes.\n" +
            "Do not share this OTP with anyone.\n\n" +
            "If you did not request this, " +
            "please ignore this email.\n\n" +
            "Team WealthWise"
        );
        mailSender.send(message);
    }
}