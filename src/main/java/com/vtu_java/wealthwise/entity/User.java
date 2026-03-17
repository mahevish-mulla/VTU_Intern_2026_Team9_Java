package com.vtu_java.wealthwise.entity;

import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true, length = 15)
    private String phone;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.INVESTOR; // ADMIN or INVESTOR [cite: 112]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE; // ACTIVE or INACTIVE [cite: 112]

    @Column(unique = true, length = 100)
    private String adminKey;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { ADMIN, INVESTOR }
    public enum Status { ACTIVE, INACTIVE }
}