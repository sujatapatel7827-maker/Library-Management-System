package com.springsecurity.repository;

import com.springsecurity.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s WHERE s.seatNo = :seatNo AND s.seatType = :seatType AND s.startDate <= :endDate AND s.endDate >= :startDate AND (:excludeId IS NULL OR s.id <> :excludeId)")
    List<Student> findOverlappingSeats(
        @Param("seatNo") String seatNo,
        @Param("seatType") String seatType,
        @Param("startDate") String startDate,
        @Param("endDate") String endDate,
        @Param("excludeId") Long excludeId
    );

}
