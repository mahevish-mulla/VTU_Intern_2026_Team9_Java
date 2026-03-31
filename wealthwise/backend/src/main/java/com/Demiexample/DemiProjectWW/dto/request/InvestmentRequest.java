package com.Demiexample.DemiProjectWW.dto.request;

import com.Demiexample.DemiProjectWW.entity.Investment;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvestmentRequest {
    private Long userId;
    private Long fundId;
    private BigDecimal amount;
    private String type;

    public Investment.InvestmentType getParsedType() {
        return "SIP".equalsIgnoreCase(type)
                ? Investment.InvestmentType.SIP
                : Investment.InvestmentType.LUMP_SUM;
    }
}