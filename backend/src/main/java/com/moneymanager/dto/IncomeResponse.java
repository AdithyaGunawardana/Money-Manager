package com.moneymanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeResponse(
        Long id,
        String source,
        BigDecimal amount,
        LocalDate receivedDate,
        String note
) {}
