package com.Demiexample.DemiProjectWW.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "mutual_funds")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MutualFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fund_id;

    @Column(name = "fund_name", nullable = false, unique = true)
    private String fundName;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    @Column(name = "current_nav")
    private BigDecimal currentNav = BigDecimal.ZERO;

    @Column(name = "scheme_code", unique = true)
    private Integer schemeCode;

    @ManyToOne
    @JoinColumn(name = "amc_id", nullable = false)
    private Amc amc;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Category { EQUITY, DEBT, HYBRID }
    public enum RiskLevel { LOW, MEDIUM, HIGH }
}