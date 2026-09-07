package com.moneymanager.repository;

import com.moneymanager.entity.Income;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserIdOrderByReceivedDateDesc(Long userId);

    Optional<Income> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId " +
           "AND i.receivedDate BETWEEN :from AND :to")
    BigDecimal sumAmountByUserIdAndDateRange(@Param("userId") Long userId,
                                              @Param("from") LocalDate from,
                                              @Param("to") LocalDate to);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId ORDER BY i.receivedDate DESC")
    List<Income> findLatestByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId " +
           "AND i.receivedDate BETWEEN :from AND :to ORDER BY i.receivedDate DESC")
    List<Income> findLatestByUserIdAndDateRange(@Param("userId") Long userId,
                                                 @Param("from") LocalDate from,
                                                 @Param("to") LocalDate to,
                                                 Pageable pageable);
}
