package com.Demiexample.DemiProjectWW.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "goals")
@Data
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    

 // AFTER — add cascade and orphanRemoval:
 @ElementCollection(fetch = FetchType.EAGER)
 @CollectionTable(
   name = "goal_linked_investments",
   joinColumns = @JoinColumn(name = "goal_id")
 )
 @Column(name = "investment_id")
 private List<Long> linkedInvestmentIds = new ArrayList<>();
 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String emoji;
    
    @Column(name = "target_amount", nullable = false)
    private BigDecimal targetAmount;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "current_saved", nullable = false)
    private BigDecimal currentSaved = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String description;
}


