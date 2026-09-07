package com.moneymanager.dto;

import com.moneymanager.entity.Category;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        BigDecimal monthlyIncome,
        BigDecimal monthlyExpense,
        Category topExpenseCategory,
        List<TransactionSummary> recentTransactions
) {}
