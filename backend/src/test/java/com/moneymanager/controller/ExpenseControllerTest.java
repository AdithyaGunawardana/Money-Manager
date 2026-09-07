package com.moneymanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moneymanager.dto.AuthResponse;
import com.moneymanager.dto.ExpenseRequest;
import com.moneymanager.dto.RegisterRequest;
import com.moneymanager.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerAndGetToken(String email) throws Exception {
        RegisterRequest req = new RegisterRequest("User " + email, email, "Addr", "password123");
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readValue(body, AuthResponse.class).token();
    }

    @Test
    void create_withoutToken_returnsUnauthorized() throws Exception {
        ExpenseRequest req = new ExpenseRequest("Lunch", Category.FOOD, new BigDecimal("10.50"), LocalDate.now(), "note");

        mockMvc.perform(post("/api/expenses")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void create_thenFindAll_returnsCreatedExpense() throws Exception {
        String token = registerAndGetToken("expense-user1@example.com");
        ExpenseRequest req = new ExpenseRequest("Lunch", Category.FOOD, new BigDecimal("10.50"), LocalDate.now(), "note");

        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Lunch"));

        mockMvc.perform(get("/api/expenses").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Lunch"));
    }

    @Test
    void update_andDelete_workCorrectly() throws Exception {
        String token = registerAndGetToken("expense-user2@example.com");
        ExpenseRequest req = new ExpenseRequest("Groceries", Category.FOOD, new BigDecimal("50.00"), LocalDate.now(), null);

        String created = mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(created).get("id").asLong();

        ExpenseRequest updateReq = new ExpenseRequest("Groceries Updated", Category.SHOPPING, new BigDecimal("60.00"), LocalDate.now(), null);
        mockMvc.perform(put("/api/expenses/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Groceries Updated"))
                .andExpect(jsonPath("$.category").value("SHOPPING"));

        mockMvc.perform(delete("/api/expenses/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/expenses/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void userCannotAccessAnotherUsersExpense() throws Exception {
        String tokenA = registerAndGetToken("owner-a@example.com");
        String tokenB = registerAndGetToken("owner-b@example.com");

        ExpenseRequest req = new ExpenseRequest("Private", Category.OTHER, new BigDecimal("5.00"), LocalDate.now(), null);
        String created = mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(created).get("id").asLong();

        mockMvc.perform(get("/api/expenses/" + id).header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound());
    }
}
