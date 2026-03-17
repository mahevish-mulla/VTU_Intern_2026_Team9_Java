package com.vtu_java.wealthwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SIP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sipId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund fund;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private Frequency frequency = Frequency.MONTHLY;

    private java.time.LocalDate startDate;
    private java.time.LocalDate nextDueDate;
    private java.time.LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private SIPStatus status = SIPStatus.ACTIVE;

    public enum Frequency { MONTHLY, QUARTERLY }
    public enum SIPStatus { ACTIVE, PAUSED, COMPLETED }
}
