package com.moneymanager.dto;

import com.moneymanager.entity.Category;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        String title,
        Category category,
        BigDecimal amount,
        LocalDate transactionDate,
        String note
) {}
