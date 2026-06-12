package com.springsecurity.model;

import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String gender;
    private String phoneNo;
    private String studentFees;
    private String seatType;
    private String seatNo;
    private String status;
    private String startDate;
    private String endDate;

    public Student() {}

    public Student(Long id, String name, String gender, String phoneNo, String studentFees, String seatType, String seatNo, String status, String startDate, String endDate) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.phoneNo = phoneNo;
        this.studentFees = studentFees;
        this.seatType = seatType;
        this.seatNo = seatNo;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
    public String getStudentFees() { return studentFees; }
    public void setStudentFees(String studentFees) { this.studentFees = studentFees; }
    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }
    public String getSeatNo() { return seatNo; }
    public void setSeatNo(String seatNo) { this.seatNo = seatNo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
