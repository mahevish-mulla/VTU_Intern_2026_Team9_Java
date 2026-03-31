package com.Demiexample.DemiProjectWW.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "amc")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Amc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long amc_id;

    // Map camelCase Java field to snake_case DB column
    @Column(name = "amc_name", nullable = false, unique = true)
    private String amcName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}