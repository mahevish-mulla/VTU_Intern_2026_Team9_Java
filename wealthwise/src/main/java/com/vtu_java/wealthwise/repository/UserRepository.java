package com.vtu_java.wealthwise.repository;

import com.vtu_java.wealthwise.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Required to locate the user by email
}