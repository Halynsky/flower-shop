package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.projection.OrderAdminProjection;
import ua.com.flowershop.projection.OrderProjection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findById(Long id);

    @Query("SELECT o FROM Order o " +
        "LEFT JOIN o.user u " +
        "WHERE (:id IS null OR o.id = :id) " +
        "AND (:userId IS null OR u.id = :userId) " +
        "AND (u IS null OR :userNamePart IS null OR lower(u.name) LIKE '%' || lower(CAST(:userNamePart as string)) || '%' ) " +
        "AND (:phonePart IS null OR lower(o.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%' ) " +
        "AND (COALESCE(:statusNames, NULL) IS NULL OR CAST(o.status as string) IN :statusNames) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR o.created BETWEEN :createdFrom AND :createdTo) " +
        "AND ((CAST(:closedFrom AS date) IS null OR CAST(:closedTo AS date) IS null) OR o.closed BETWEEN :closedFrom AND :closedTo) ")
    Page<OrderAdminProjection> findForAdminProjectedByFilters(Long id, List<String> statusNames, Long userId, String userNamePart, String phonePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo, LocalDateTime closedFrom, LocalDateTime closedTo,
                                                              Pageable pageRequest);

    @Query("SELECT o FROM Order o " +
        "LEFT JOIN o.user u " +
        "WHERE (:id IS null OR o.id = :id) " +
        "AND (:userId IS null OR u.id = :userId) " +
        "AND (u IS null OR :userNamePart IS null OR lower(u.name) LIKE '%' || lower(CAST(:userNamePart as string)) || '%' ) " +
        "AND (:phonePart IS null OR lower(o.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%' ) " +
        "AND (COALESCE(:statusNames, NULL) IS NULL OR CAST(o.status as string) IN :statusNames) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR o.created BETWEEN :createdFrom AND :createdTo) " +
        "AND ((CAST(:closedFrom AS date) IS null OR CAST(:closedTo AS date) IS null) OR o.closed BETWEEN :closedFrom AND :closedTo) ")
    Page<Order> findForAdminByFilters(Long id, List<String> statusNames, Long userId, String userNamePart, String phonePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo, LocalDateTime closedFrom, LocalDateTime closedTo,
                                                              Pageable pageRequest);

    Page<OrderProjection> findProjectedByUserEmailOrderByCreatedDesc(String userEmail, Pageable pageRequest);

    Integer countAllByCreatedAfterAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    Integer countAllByCreatedAfterAndPaidIsNotNullAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    Integer countAllByCreatedAfterAndPaidIsNullAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    @Query("SELECT sum(o.totalPrice - o.discount) / 100 FROM Order o " +
        "WHERE o.created > :createdAfter " +
        "AND o.paid IS NOT null " +
        "AND o.status in :statuses")
    Integer countAmountByCreatedAfterAndPaidIsNotNullAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    @Query("SELECT sum(o.totalPrice - o.discount) / 100 FROM Order o " +
        "WHERE o.created > :createdAfter " +
        "AND o.paid IS null " +
        "AND o.status in :statuses")
    Integer countAmountByCreatedAfterAndPaidIsNullAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

}
