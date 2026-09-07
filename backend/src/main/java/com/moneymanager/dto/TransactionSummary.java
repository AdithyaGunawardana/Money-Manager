package com.moneymanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionSummary(
        Long id,
        String type,     // "EXPENSE" or "INCOME"
        String label,    // title (expense) or source (income)
        BigDecimal amount,
        LocalDate date
) {}
