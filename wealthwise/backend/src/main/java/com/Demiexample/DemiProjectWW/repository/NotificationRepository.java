package com.Demiexample.DemiProjectWW.repository;

import com.Demiexample.DemiProjectWW.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String email);
    long countByUserEmailAndReadFalse(String email);
}