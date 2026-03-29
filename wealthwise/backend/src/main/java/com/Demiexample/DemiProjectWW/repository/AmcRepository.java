package com.Demiexample.DemiProjectWW.repository;

import com.Demiexample.DemiProjectWW.entity.Amc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AmcRepository extends JpaRepository<Amc, Long> {
    Optional<Amc> findByAmcName(String amcName);
}