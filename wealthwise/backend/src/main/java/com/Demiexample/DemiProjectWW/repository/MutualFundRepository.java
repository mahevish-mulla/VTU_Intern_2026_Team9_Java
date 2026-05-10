package com.Demiexample.DemiProjectWW.repository;

 
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
 
public interface MutualFundRepository
        extends JpaRepository<MutualFund, Long> {
 
    List<MutualFund> findByCategoryAndRiskLevel(
            MutualFund.Category category,
            MutualFund.RiskLevel riskLevel);
 
    List<MutualFund> findByCategory(
            MutualFund.Category category);
 
    List<MutualFund> findByRiskLevel(
            MutualFund.RiskLevel riskLevel);
 
    // Used by scheduler — only fetch funds that have a schemeCode
    List<MutualFund> findBySchemeCodeIsNotNull();

    @Query("SELECT SUM(i.units * m.currentNav) FROM Investment i JOIN i.mutualFund m WHERE i.status = 'ACTIVE'")
    Double calculateTotalAUM();
}
 