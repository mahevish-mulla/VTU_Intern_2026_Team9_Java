package com.vtu_java.wealthwise.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "amc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AMC {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long amcId;

    @Column(nullable = false, unique = true, length = 150)
    private String amcName;

    private LocalDateTime createdAt = LocalDateTime.now();
}
