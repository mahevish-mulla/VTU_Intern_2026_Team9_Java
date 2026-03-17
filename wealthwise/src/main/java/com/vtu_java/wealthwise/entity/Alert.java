package com.vtu_java.wealthwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @ManyToOne
    @JoinColumn(name = "sent_by") // Admin user
    private User sentBy;

    @ManyToOne
    @JoinColumn(name = "sent_to") // Investor user
    private User sentTo;

    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    private String message;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AlertType { SIP_DUE, MISSED_SIP, SIP_COMPLETION, GENERAL }
}