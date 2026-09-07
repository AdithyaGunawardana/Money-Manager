package com.moneymanager.service;

import com.moneymanager.dto.DashboardResponse;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.repository.IncomeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private IncomeRepository incomeRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setup() {
        when(expenseRepository.findLatestByUserIdAndDateRange(anyLong(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        when(incomeRepository.findLatestByUserIdAndDateRange(anyLong(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        when(expenseRepository.findTopCategoryByUserIdAndDateRange(anyLong(), any(), any()))
                .thenReturn(Collections.emptyList());
    }

    @Test
    void balance_isIncomeMinusExpenseForSelectedMonth() {
        when(incomeRepository.sumAmountByUserId(1L))
                .thenReturn(new BigDecimal("1000.00"));
        when(expenseRepository.sumAmountByUserId(1L))
                .thenReturn(new BigDecimal("350.00"));
        when(incomeRepository.sumAmountByUserIdAndDateRange(anyLong(), any(), any()))
            .thenReturn(new BigDecimal("400.00"));
        when(expenseRepository.sumAmountByUserIdAndDateRange(anyLong(), any(), any()))
            .thenReturn(new BigDecimal("125.00"));

        DashboardResponse result = dashboardService.getDashboard(1L, YearMonth.now());

        assertEquals(new BigDecimal("650.00"), result.balance());
        assertEquals(new BigDecimal("1000.00"), result.totalIncome());
        assertEquals(new BigDecimal("350.00"), result.totalExpense());
        assertEquals(new BigDecimal("400.00"), result.monthlyIncome());
        assertEquals(new BigDecimal("125.00"), result.monthlyExpense());
    }

    @Test
    void noTransactions_balanceIsZero() {
        when(incomeRepository.sumAmountByUserId(1L)).thenReturn(BigDecimal.ZERO);
        when(expenseRepository.sumAmountByUserId(1L)).thenReturn(BigDecimal.ZERO);
        when(incomeRepository.sumAmountByUserIdAndDateRange(anyLong(), any(), any())).thenReturn(BigDecimal.ZERO);
        when(expenseRepository.sumAmountByUserIdAndDateRange(anyLong(), any(), any())).thenReturn(BigDecimal.ZERO);

        DashboardResponse result = dashboardService.getDashboard(1L, YearMonth.now());

        assertEquals(BigDecimal.ZERO, result.balance());
        assertEquals(0, result.recentTransactions().size());
    }
}
