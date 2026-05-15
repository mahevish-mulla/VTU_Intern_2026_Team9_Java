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
    
    public void sendFundDeactivationEmail(
            String toEmail, String fundName, String gracePeriodEnd) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Important: " + fundName + " has been deactivated");
        message.setText(
            "Dear Investor,\n\n" +
            "The fund \"" + fundName + "\" has been deactivated on WealthWise.\n\n" +
            "What this means for you:\n" +
            "✓ Your existing investment is SAFE\n" +
            "✓ You can continue your SIP until " + gracePeriodEnd + "\n" +
            "✓ After " + gracePeriodEnd + ", new SIP instalments will be stopped\n" +
            "✓ You can withdraw your investment anytime\n\n" +
            "Please log in to review your portfolio.\n\n" +
            "Team WealthWise"
        );
        mailSender.send(message);
    }
    
    public void sendSipReminderEmail(
            String toEmail, String name,
            String fundName, String amount, String dueDate) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("Reminder: SIP Due in 3 Days - " + fundName);
        msg.setText(
            "Dear " + name + ",\n\n" +
            "This is a reminder that your SIP is due in 3 days.\n\n" +
            "Fund: " + fundName + "\n" +
            "Amount: ₹" + amount + "\n" +
            "Due Date: " + dueDate + "\n\n" +
            "Please ensure sufficient balance in your account.\n\n" +
            "Team WealthWise"
        );
        mailSender.send(msg);
    }

    public void sendGeneralAlert(
            String toEmail, String title, String message) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("WealthWise: " + title);
        msg.setText(
            "Dear Investor,\n\n" +
            message + "\n\n" +
            "Team WealthWise"
        );
        mailSender.send(msg);
    }
}