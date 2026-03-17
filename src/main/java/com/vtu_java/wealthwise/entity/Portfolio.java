package com.vtu_java.wealthwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "portfolio", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "fund_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long portfolioId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund fund;

    private Double totalUnits = 0.0;
    private Double totalInvested = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}