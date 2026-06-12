package com.springsecurity.service;

import com.springsecurity.exception.BookingConflictException;
import com.springsecurity.model.Student;
import com.springsecurity.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
    }

    @Override
    public Student createStudent(Student student) {
        validateNoBookingConflicts(student, null);
        Student savedStudent = studentRepository.save(student);
        
        return savedStudent;
    }

    @Override
    public Student updateStudent(Long id, Student student) {
        Student existingStudent = getStudentById(id);
        student.setId(id);
        validateNoBookingConflicts(student, id);
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public List<Student> getExpiringBookings(int days) {
        LocalDate today = LocalDate.now();
        LocalDate limitDate = today.plusDays(days);

        return studentRepository.findAll().stream()
                .filter(s -> s.getEndDate() != null && !s.getEndDate().trim().isEmpty())
                .filter(s -> {
                    try {
                        LocalDate endDate = LocalDate.parse(s.getEndDate());
                        // Return true if booking has expired OR is expiring within the threshold
                        return !endDate.isAfter(limitDate);
                    } catch (DateTimeParseException e) {
                        return false; // ignore invalid dates
                    }
                })
                .collect(Collectors.toList());
    }

    private void validateNoBookingConflicts(Student newStudent, Long excludeId) {
        if (newStudent.getStartDate() == null || newStudent.getEndDate() == null) {
            return;
        }

        // 1. Check Seat Overlap
        if (newStudent.getSeatNo() != null && !newStudent.getSeatNo().trim().isEmpty() &&
                newStudent.getSeatType() != null && !newStudent.getSeatType().trim().isEmpty()) {
            
            List<Student> overlappingSeats = studentRepository.findOverlappingSeats(
                    newStudent.getSeatNo().trim(),
                    newStudent.getSeatType().trim(),
                    newStudent.getStartDate().trim(),
                    newStudent.getEndDate().trim(),
                    excludeId
            );

            if (!overlappingSeats.isEmpty()) {
                Student conflict = overlappingSeats.get(0);
                throw new BookingConflictException("Seat " + newStudent.getSeatNo() + " (" + newStudent.getSeatType() + 
                        ") is already booked by " + conflict.getName() + " from " + 
                        conflict.getStartDate() + " to " + conflict.getEndDate());
            }
        }

    }
}
