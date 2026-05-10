package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.entity.Notification;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.NotificationRepository;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getMyNotifications(String email) {
        return notificationRepository
            .findByUserEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository
            .countByUserEmailAndReadFalse(email);
    }

    public void markAllRead(String email) {
        List<Notification> list = notificationRepository
            .findByUserEmailOrderByCreatedAtDesc(email);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }

    public void markOneRead(Long id, String email) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getEmail().equals(email)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public void createNotification(
            User user, String title,
            String message,
            Notification.NotificationType type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        notificationRepository.save(n);
    }
}