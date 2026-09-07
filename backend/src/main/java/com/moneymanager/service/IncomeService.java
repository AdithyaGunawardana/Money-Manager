package com.moneymanager.service;

import com.moneymanager.dto.IncomeRequest;
import com.moneymanager.dto.IncomeResponse;
import com.moneymanager.entity.Income;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ApiException;
import com.moneymanager.repository.IncomeRepository;
import com.moneymanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeResponse create(Long userId, IncomeRequest req) {
        User user = userRepository.getReferenceById(userId);

        Income income = Income.builder()
                .user(user)
                .source(req.source())
                .amount(req.amount())
                .receivedDate(req.receivedDate())
                .note(req.note())
                .build();

        return toResponse(incomeRepository.save(income));
    }

    public List<IncomeResponse> findAll(Long userId) {
        return incomeRepository.findByUserIdOrderByReceivedDateDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public IncomeResponse findOne(Long userId, Long id) {
        return toResponse(getOwned(userId, id));
    }

    public IncomeResponse update(Long userId, Long id, IncomeRequest req) {
        Income income = getOwned(userId, id);
        income.setSource(req.source());
        income.setAmount(req.amount());
        income.setReceivedDate(req.receivedDate());
        income.setNote(req.note());
        return toResponse(incomeRepository.save(income));
    }

    public void delete(Long userId, Long id) {
        Income income = getOwned(userId, id);
        incomeRepository.delete(income);
    }

    private Income getOwned(Long userId, Long id) {
        return incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException("Income not found", HttpStatus.NOT_FOUND));
    }

    private IncomeResponse toResponse(Income i) {
        return new IncomeResponse(i.getId(), i.getSource(), i.getAmount(), i.getReceivedDate(), i.getNote());
    }
}
