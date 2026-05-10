package com.Demiexample.DemiProjectWW.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund mutualFund;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private InvestmentType type;

    @Column(nullable = false)
    private BigDecimal units;
    
    @Column(name = "sip_day")
    private Integer sipDay;  // day of month e.g. 5 = every 5th

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(nullable = false)
    private BigDecimal buyNav;
    
    public enum InvestmentStatus { ACTIVE, PAUSED, STOPPED }

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InvestmentStatus status = InvestmentStatus.ACTIVE;

    private LocalDateTime investmentDate = LocalDateTime.now();

    public enum InvestmentType {
        SIP, LUMP_SUM
    }
}