package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.entity.Notification;
import com.Demiexample.DemiProjectWW.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications(Authentication auth) {
        return notificationService.getMyNotifications(auth.getName());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication auth) {
        return ResponseEntity.ok(
            Map.of("count",
                notificationService.getUnreadCount(auth.getName())));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<?> markAllRead(Authentication auth) {
        notificationService.markAllRead(auth.getName());
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<?> markOneRead(@PathVariable Long id, Authentication auth) {
        notificationService.markOneRead(id, auth.getName());
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
}