package com.wealthwise.notifications.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    public Notification createNotification(Long userId, String type, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setMessage(message);
        return notificationRepository.save(n);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }

    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        n.setRead(true);
        notificationRepository.save(n);
    }

    public void sendAlertWithEmail(Long userId, String userEmail, String type, String message) {
        createNotification(userId, type, message);
        emailService.sendEmail(userEmail, "WealthWise Alert: " + type, message);
    }

    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailySipReminders() {
        System.out.println("Checking SIP reminders...");
    }
 // Admin broadcasts message to ALL users
    public void broadcastToAllUsers(String message, String type) {
        Notification n = new Notification();
        n.setUserId(0L);  // 0 means broadcast to all
        n.setType(type);
        n.setMessage(message);
        notificationRepository.save(n);
        System.out.println("Broadcast saved: " + message);
    }

    // Get all broadcast notifications (userId = 0)
    public List<Notification> getAllBroadcasts() {
        return notificationRepository.findByUserId(0L);
    }
}
