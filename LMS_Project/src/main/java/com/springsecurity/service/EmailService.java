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
        if (mailSender == null) {
            System.out.println("⚠️ MailSender is not initialized. Skipping email alert.");
            return;
        }

        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            System.out.println("ℹ️ No email address provided for student " + student.getName() + ". Skipping email alert.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(student.getEmail());
            helper.setSubject("Seat Booking Confirmation - Library Management System");

            String htmlContent = "<h3>Dear " + student.getName() + ",</h3>" +
                    "<p>Your seat booking at the Library/Study Hall has been confirmed successfully!</p>" +
                    "<table border='1' cellpadding='8' style='border-collapse: collapse;'>" +
                    "<tr><td><b>Seat Number</b></td><td>" + student.getSeatNo() + "</td></tr>" +
                    "<tr><td><b>Seat Type</b></td><td>" + student.getSeatType() + "</td></tr>" +
                    "<tr><td><b>Locker Number</b></td><td>" + (student.getLockerNo() != null ? student.getLockerNo() : "None") + "</td></tr>" +
                    "<tr><td><b>Start Date</b></td><td>" + student.getStartDate() + "</td></tr>" +
                    "<tr><td><b>End Date</b></td><td>" + student.getEndDate() + "</td></tr>" +
                    "<tr><td><b>Fees Status</b></td><td>" + student.getStatus() + " (" + student.getStudentFees() + " Paid)</td></tr>" +
                    "</table>" +
                    "<p>Thank you for using our Library Management System!</p>" +
                    "<br/><p>Best Regards,<br/><b>Library Administration</b></p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✉️ Booking confirmation email sent successfully to " + student.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send booking confirmation email: " + e.getMessage());
            // We do not rethrow, to prevent database transactions from rolling back if SMTP fails
        }
    }
}
