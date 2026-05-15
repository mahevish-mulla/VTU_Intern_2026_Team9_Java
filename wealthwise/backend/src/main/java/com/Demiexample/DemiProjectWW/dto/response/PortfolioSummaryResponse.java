package com.Demiexample.DemiProjectWW.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
@AllArgsConstructor
public class PortfolioSummaryResponse {
    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private BigDecimal totalGainLoss;
    private Double gainLossPercentage;
    private Map<String, BigDecimal> assetAllocation; // Equity vs Debt
}