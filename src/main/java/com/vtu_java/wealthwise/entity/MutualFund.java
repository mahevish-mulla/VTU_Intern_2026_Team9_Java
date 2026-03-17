package com.vtu_java.wealthwise.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "mutual_funds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MutualFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fundId;

    @Column(nullable = false, unique = true, length = 200)
    private String fundName;

    @Enumerated(EnumType.STRING)
    private Category category; // EQUITY, DEBT, HYBRID

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel; // LOW, MEDIUM, HIGH

    @Column(precision = 10, scale = 4)
    private Double currentNav = 0.0;

    @Column(unique = true)
    private Integer schemeCode;

    @ManyToOne
    @JoinColumn(name = "amc_id", nullable = false)
    private AMC amc;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Category { EQUITY, DEBT, HYBRID }
    public enum RiskLevel { LOW, MEDIUM, HIGH }
}
