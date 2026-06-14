package com.springsecurity.dto;

public class RegisterRequest {
    private String fullName;
    private String username;
    private String email;
    private String mobileNumber;
    private String password;
    private String otpPreference; // "email" or "mobile"

    // Getters and Setters

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOtpPreference() {
        return otpPreference;
    }

    public void setOtpPreference(String otpPreference) {
        this.otpPreference = otpPreference;
    }
}
