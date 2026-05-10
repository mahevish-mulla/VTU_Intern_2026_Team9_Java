package com.Demiexample.DemiProjectWW.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Demiexample.DemiProjectWW.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByAdminKey(String adminKey);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    // Fetch all users by role (e.g., INVESTOR)
    List<User> findByRole(User.Role role);

    // Search for investors by name or email
    List<User> findByRoleAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            User.Role role, String name, String email);
}