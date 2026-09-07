package com.moneymanager.dto;

import java.time.Instant;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String address,
        Instant createdAt
) {}
