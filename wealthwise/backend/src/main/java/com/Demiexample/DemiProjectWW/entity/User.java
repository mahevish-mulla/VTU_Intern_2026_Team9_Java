package com.Demiexample.DemiProjectWW.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.INVESTOR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "admin_key", unique = true)
    private String adminKey;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        ADMIN, INVESTOR
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}