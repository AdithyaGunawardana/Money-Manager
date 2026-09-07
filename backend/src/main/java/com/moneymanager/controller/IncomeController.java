package com.moneymanager.controller;

import com.moneymanager.dto.IncomeRequest;
import com.moneymanager.dto.IncomeResponse;
import com.moneymanager.security.CurrentUser;
import com.moneymanager.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;
    private final CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<IncomeResponse> create(@Valid @RequestBody IncomeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incomeService.create(currentUser.id(), req));
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> findAll() {
        return ResponseEntity.ok(incomeService.findAll(currentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.findOne(currentUser.id(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> update(@PathVariable Long id, @Valid @RequestBody IncomeRequest req) {
        return ResponseEntity.ok(incomeService.update(currentUser.id(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incomeService.delete(currentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
