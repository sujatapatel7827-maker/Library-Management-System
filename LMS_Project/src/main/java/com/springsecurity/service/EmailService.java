package com.springsecurity.service;

import com.springsecurity.model.Student;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendBookingConfirmationEmail(Student student) {
        // Email functionality has been disabled as email field is removed from the system.
    }

    public void sendOtpEmail(String to, String otp) {
        if (mailSender == null) {
            System.err.println("MailSender is not configured. Falling back to console.");
            System.out.println("====== OTP EMAIL (Simulated) ======");
            System.out.println("To: " + to);
            System.out.println("OTP: " + otp);
            System.out.println("===================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Your Admin Registration OTP");
            helper.setText("<h3>Your OTP for Admin Registration is: <strong>" + otp + "</strong></h3><p>Please enter this to activate your account.</p>", true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }
}
