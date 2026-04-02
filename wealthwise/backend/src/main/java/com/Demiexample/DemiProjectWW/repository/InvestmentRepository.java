package com.Demiexample.DemiProjectWW.repository;

import com.Demiexample.DemiProjectWW.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserUserId(Long userId);
}