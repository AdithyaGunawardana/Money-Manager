package com.moneymanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email(message = "Valid email is required") String email,
        @NotBlank(message = "Password is required") String password
) {}
