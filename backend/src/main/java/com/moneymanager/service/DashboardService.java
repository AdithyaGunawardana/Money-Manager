package com.moneymanager.service;

import com.moneymanager.dto.DashboardResponse;
import com.moneymanager.dto.TransactionSummary;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.Expense;
import com.moneymanager.entity.Income;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int RECENT_LIMIT = 5;

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public DashboardResponse getDashboard(Long userId, YearMonth month) {
        YearMonth targetMonth = month != null ? month : YearMonth.now();
        LocalDate from = targetMonth.atDay(1);
        LocalDate to = targetMonth.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.sumAmountByUserIdAndDateRange(userId, from, to);
        BigDecimal totalExpense = expenseRepository.sumAmountByUserIdAndDateRange(userId, from, to);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        BigDecimal monthlyIncome = totalIncome;
        BigDecimal monthlyExpense = totalExpense;

        Category topCategory = expenseRepository.findTopCategoryByUserIdAndDateRange(userId, from, to)
                .stream().findFirst()
                .map(ExpenseRepository.CategoryTotal::getCategory)
                .orElse(null);

        List<TransactionSummary> recent = recentTransactions(userId);

        return new DashboardResponse(
                totalIncome, totalExpense, balance,
                monthlyIncome, monthlyExpense,
                topCategory, recent
        );
    }

    private List<TransactionSummary> recentTransactions(Long userId) {
        List<Expense> recentExpenses = expenseRepository.findLatestByUserId(userId, PageRequest.of(0, RECENT_LIMIT));
        List<Income> recentIncomes = incomeRepository.findLatestByUserId(userId, PageRequest.of(0, RECENT_LIMIT));

        Stream<TransactionSummary> expenseStream = recentExpenses.stream()
                .map(e -> new TransactionSummary(e.getId(), "EXPENSE", e.getTitle(), e.getAmount(), e.getTransactionDate()));

        Stream<TransactionSummary> incomeStream = recentIncomes.stream()
                .map(i -> new TransactionSummary(i.getId(), "INCOME", i.getSource(), i.getAmount(), i.getReceivedDate()));

        return Stream.concat(expenseStream, incomeStream)
                .sorted(Comparator.comparing(TransactionSummary::date).reversed())
                .limit(RECENT_LIMIT)
                .toList();
    }
}
