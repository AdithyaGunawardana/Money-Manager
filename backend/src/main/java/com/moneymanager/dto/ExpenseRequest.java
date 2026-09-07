package com.moneymanager.dto;

import com.moneymanager.entity.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank(message = "Title is required") String title,
        @NotNull(message = "Category is required") Category category,
        @NotNull @DecimalMin(value = "0.01", message = "Amount must be positive") BigDecimal amount,
        @NotNull(message = "Transaction date is required")
        @PastOrPresent(message = "Transaction date cannot be in the future") LocalDate transactionDate,
        String note
) {}
