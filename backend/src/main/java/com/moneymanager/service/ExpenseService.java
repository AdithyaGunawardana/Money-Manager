package com.moneymanager.service;

import com.moneymanager.dto.ExpenseRequest;
import com.moneymanager.dto.ExpenseResponse;
import com.moneymanager.entity.Expense;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ApiException;
import com.moneymanager.repository.ExpenseRepository;
import com.moneymanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseResponse create(Long userId, ExpenseRequest req) {
        User user = userRepository.getReferenceById(userId);

        Expense expense = Expense.builder()
                .user(user)
                .title(req.title())
                .category(req.category())
                .amount(req.amount())
                .transactionDate(req.transactionDate())
                .note(req.note())
                .build();

        return toResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> findAll(Long userId) {
        return expenseRepository.findByUserIdOrderByTransactionDateDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public ExpenseResponse findOne(Long userId, Long id) {
        return toResponse(getOwned(userId, id));
    }

    public ExpenseResponse update(Long userId, Long id, ExpenseRequest req) {
        Expense expense = getOwned(userId, id);
        expense.setTitle(req.title());
        expense.setCategory(req.category());
        expense.setAmount(req.amount());
        expense.setTransactionDate(req.transactionDate());
        expense.setNote(req.note());
        return toResponse(expenseRepository.save(expense));
    }

    public void delete(Long userId, Long id) {
        Expense expense = getOwned(userId, id);
        expenseRepository.delete(expense);
    }

    private Expense getOwned(Long userId, Long id) {
        return expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException("Expense not found", HttpStatus.NOT_FOUND));
    }

    private ExpenseResponse toResponse(Expense e) {
        return new ExpenseResponse(e.getId(), e.getTitle(), e.getCategory(), e.getAmount(), e.getTransactionDate(), e.getNote());
    }
}
