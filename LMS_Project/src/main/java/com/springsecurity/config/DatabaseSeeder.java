package com.springsecurity.config;

import com.springsecurity.model.Admin;
import com.springsecurity.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin - always ensure correct password on every startup
        String defaultUsername = "admin";
        String defaultPassword = "1234";

        Optional<Admin> existingAdmin = adminRepository.findByUsername(defaultUsername);

        if (existingAdmin.isPresent()) {
            // Admin exists - update password to ensure it's correct
            Admin admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode(defaultPassword));
            adminRepository.save(admin);
            System.out.println("✅ Admin password reset to default: admin / 1234");
        } else {
            // Admin doesn't exist - create new
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername(defaultUsername);
            defaultAdmin.setPassword(passwordEncoder.encode(defaultPassword));
            adminRepository.save(defaultAdmin);
            System.out.println("✅ Default admin account created: admin / 1234");
        }
    }
}
