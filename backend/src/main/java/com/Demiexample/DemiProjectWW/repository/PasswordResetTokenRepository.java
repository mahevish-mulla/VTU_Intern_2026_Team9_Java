package com.Demiexample.DemiProjectWW.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Demiexample.DemiProjectWW.entity.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken>
        findByUser_EmailAndUsedFalse(String email);

    void deleteByUser_UserId(Long userId);
}