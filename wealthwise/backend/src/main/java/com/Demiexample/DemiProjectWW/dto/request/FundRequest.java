package com.Demiexample.DemiProjectWW.dto.request;

import com.Demiexample.DemiProjectWW.entity.MutualFund.Category;
import com.Demiexample.DemiProjectWW.entity.MutualFund.RiskLevel;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundRequest {
    private String fundName;
    private Category category;
    private RiskLevel riskLevel;
    private Integer schemeCode;
    private Long amcId;
}