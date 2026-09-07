package com.moneymanager.repository;

import com.moneymanager.entity.Expense;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByTransactionDateDesc(Long userId);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId " +
           "AND e.transactionDate BETWEEN :from AND :to")
    BigDecimal sumAmountByUserIdAndDateRange(@Param("userId") Long userId,
                                              @Param("from") LocalDate from,
                                              @Param("to") LocalDate to);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId ORDER BY e.transactionDate DESC")
    List<Expense> findLatestByUserId(@Param("userId") Long userId, Pageable pageable);

        @Query("SELECT e FROM Expense e WHERE e.user.id = :userId " +
            "AND e.transactionDate BETWEEN :from AND :to ORDER BY e.transactionDate DESC")
        List<Expense> findLatestByUserIdAndDateRange(@Param("userId") Long userId,
                                  @Param("from") LocalDate from,
                                  @Param("to") LocalDate to,
                                  Pageable pageable);

    @Query("SELECT e.category AS category, SUM(e.amount) AS total FROM Expense e " +
           "WHERE e.user.id = :userId AND e.transactionDate BETWEEN :from AND :to " +
           "GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<CategoryTotal> findTopCategoryByUserIdAndDateRange(@Param("userId") Long userId,
                                                             @Param("from") LocalDate from,
                                                             @Param("to") LocalDate to);

    interface CategoryTotal {
        com.moneymanager.entity.Category getCategory();
        BigDecimal getTotal();
    }
}
