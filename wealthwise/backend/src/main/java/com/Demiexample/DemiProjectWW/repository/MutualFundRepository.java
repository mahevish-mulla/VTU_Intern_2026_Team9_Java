// File: VTU_Intern_2026_Team9_Java/wealthwise/backend/src/main/java/com/Demiexample/DemiProjectWW/repository/MutualFundRepository.java
package com.Demiexample.DemiProjectWW.repository;

import com.Demiexample.DemiProjectWW.entity.MutualFund;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MutualFundRepository extends JpaRepository<MutualFund, Long> {
    List<MutualFund> findByCategoryAndRiskLevel(MutualFund.Category category, MutualFund.RiskLevel riskLevel);
}