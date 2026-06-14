package com.springsecurity.controller;

import com.springsecurity.config.JwtUtils;
import com.springsecurity.dto.AuthRequest;
import com.springsecurity.dto.AuthResponse;
import com.springsecurity.dto.RegisterRequest;
import com.springsecurity.dto.VerifyOtpRequest;
import com.springsecurity.model.Admin;
import com.springsecurity.repository.AdminRepository;
import com.springsecurity.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Check if user exists first to give a helpful message
            Admin admin = adminRepository.findByUsername(authRequest.getUsername()).orElse(null);
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found. Please register first."));
            }

            if (!admin.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is not active. Please verify your OTP."));
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
            final String jwt = jwtUtils.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Incorrect password. Please try again."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Username already exists"));
            }

            // Generate 4 digit OTP
            String otp = String.format("%04d", new java.util.Random().nextInt(10000));

            Admin admin = new Admin();
            admin.setUsername(request.getUsername());
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
            admin.setFullName(request.getFullName());
            admin.setEmail(request.getEmail());
            admin.setMobileNumber(request.getMobileNumber());
            admin.setActive(false);
            admin.setOtpCode(otp);
            adminRepository.save(admin);

            if ("mobile".equalsIgnoreCase(request.getOtpPreference())) {
                System.out.println("====== SMS OTP (Simulated) ======");
                System.out.println("To Mobile: " + request.getMobileNumber());
                System.out.println("OTP: " + otp);
                System.out.println("=================================");
            } else {
                emailService.sendOtpEmail(request.getEmail(), otp);
            }

            return ResponseEntity.ok(Map.of("message", "OTP sent successfully. Please verify to activate."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            Admin admin = adminRepository.findByUsername(request.getUsername()).orElse(null);
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            if (admin.isActive()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Account is already active"));
            }

            if (admin.getOtpCode() != null && admin.getOtpCode().equals(request.getOtpCode())) {
                admin.setActive(true);
                admin.setOtpCode(null); // clear OTP after successful verification
                adminRepository.save(admin);
                return ResponseEntity.ok(Map.of("message", "Account activated successfully. You can now login."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid OTP"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "OTP Verification failed: " + e.getMessage()));
        }
    }
}
