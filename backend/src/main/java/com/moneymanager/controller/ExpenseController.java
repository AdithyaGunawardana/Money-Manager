package com.moneymanager.controller;

import com.moneymanager.dto.ExpenseRequest;
import com.moneymanager.dto.ExpenseResponse;
import com.moneymanager.security.CurrentUser;
import com.moneymanager.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody ExpenseRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> findAll() {
        return ResponseEntity.ok(expenseService.findAll(currentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.findOne(currentUser.id(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable Long id, @Valid @RequestBody ExpenseRequest req) {
        return ResponseEntity.ok(expenseService.update(currentUser.id(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(currentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
