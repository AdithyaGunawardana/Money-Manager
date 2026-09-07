package com.moneymanager.controller;

import com.moneymanager.dto.DashboardResponse;
import com.moneymanager.security.CurrentUser;
import com.moneymanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUser currentUser;

    // month format: yyyy-MM, e.g. 2026-09. Defaults to current month if omitted.
    @GetMapping
    public ResponseEntity<DashboardResponse> get(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month
    ) {
        return ResponseEntity.ok(dashboardService.getDashboard(currentUser.id(), month));
    }
}
