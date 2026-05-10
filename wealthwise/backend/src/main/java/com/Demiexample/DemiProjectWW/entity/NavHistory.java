package com.Demiexample.DemiProjectWW.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
 
@Entity
@Table(name = "nav_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NavHistory {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund mutualFund;
 
    @Column(nullable = false)
    private BigDecimal nav;
 
    @Column(name = "nav_date", nullable = false)
    private LocalDate navDate;
}
