package com.vtu_java.wealthwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "investments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long investmentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund fund;

    @Enumerated(EnumType.STRING)
    private InvestmentType investmentType; // SIP or LUMPSUM

    private Double amount;
    private Double navAtInvestment;
    private Double unitsPurchased; // Calculated: amount / navAtInvestment [cite: 103]
    private java.time.LocalDate investmentDate;

    public enum InvestmentType { SIP, LUMPSUM }
}