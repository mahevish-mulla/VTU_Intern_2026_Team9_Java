package com.Demiexample.DemiProjectWW.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Demiexample.DemiProjectWW.entity.Investment;

public interface InvestmentRepository
        extends JpaRepository<Investment, Long> {

    List<Investment> findByUserUserId(Long userId);

    List<Investment> findByUserEmail(String email);

    List<Investment> findByMutualFundFundId(Long fundId);

    List<Investment> findByStatusAndMutualFundGracePeriodEndsBefore(
            Investment.InvestmentStatus status, LocalDateTime now);

    List<Investment> findByNextDueDateAndTypeAndStatus(
            LocalDate nextDueDate,
            Investment.InvestmentType type,
            Investment.InvestmentStatus status
    );

    // ✅ keep this (from remote changes)
    List<Investment> findByNextDueDateBetweenAndTypeAndStatus(
            LocalDate from,
            LocalDate to,
            Investment.InvestmentType type,
            Investment.InvestmentStatus status
    );

    List<Investment> findByUserEmailAndTypeAndStatus(
            String email,
            Investment.InvestmentType type,
            Investment.InvestmentStatus status
    );
}