package com.Demiexample.DemiProjectWW.repository;

import com.Demiexample.DemiProjectWW.entity.MutualFund;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MutualFundRepository extends JpaRepository<MutualFund, Long> {
    List<MutualFund> findByCategoryAndRiskLevel(MutualFund.Category category, MutualFund.RiskLevel riskLevel);
}