package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.projection.OrderAdminProjection;
import ua.com.flowershop.projection.OrderProjection;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findById(Long id);

    @Query("SELECT DISTINCT(o.id) as id, o.created as created, o.closed as closed, o.sent as sent, o.status as status, o.user as user, " +
        "o.comment as comment, o.note as note, o.deliveryAddress as deliveryAddress, o.postDeclaration as postDeclaration, " +
        "o.paid as paid, o.phone as phone, o.totalPrice as totalPrice, o.discount as discount, (o.totalPrice - o.discount) as priceToPay FROM Order o " +
        "LEFT JOIN o.user u " +
        "WHERE (:id IS null OR o.id = :id) " +
        "AND (:userId IS null OR u.id = :userId) " +
        "AND (u IS null OR :userNamePart IS null OR lower(u.name) LIKE '%' || lower(CAST(:userNamePart as string)) || '%' ) " +
        "AND (:phonePart IS null OR lower(o.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%' ) " +
        "AND (COALESCE(:statusNames, NULL) IS NULL OR CAST(o.status as string) IN :statusNames) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR o.created BETWEEN :createdFrom AND :createdTo) " +
        "AND ((CAST(:closedFrom AS date) IS null OR CAST(:closedTo AS date) IS null) OR o.closed BETWEEN :closedFrom AND :closedTo) " +
        "AND ((CAST(:sentFrom AS date) IS null OR CAST(:sentTo AS date) IS null) OR o.sent BETWEEN :sentFrom AND :sentTo) " +
        "AND (:priceToPayFrom IS null OR (o.totalPrice - o.discount) BETWEEN :priceToPayFrom AND :priceToPayTo) " +
        "AND (:paid IS null OR :paid = true AND o.paid IS NOT NULL OR :paid = false AND o.paid IS NULL) " +
        "GROUP BY o.id, o.created, o.closed, o.status, o.user, o.comment, o.note, o.deliveryAddress, o.postDeclaration, o.paid, o.phone, o.totalPrice, o.discount, u")
    Page<OrderAdminProjection> findForAdminProjectedByFilters(Long id, List<String> statusNames, Long userId, String userNamePart, String phonePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo, LocalDateTime closedFrom, LocalDateTime closedTo,
                                                              LocalDate sentFrom, LocalDate sentTo, Integer priceToPayFrom, Integer priceToPayTo, Boolean paid,
                                                              Pageable pageRequest);

    @Query("SELECT o FROM Order o " +
        "LEFT JOIN o.user u " +
        "WHERE (:id IS null OR o.id = :id) " +
        "AND (:userId IS null OR u.id = :userId) " +
        "AND (u IS null OR :userNamePart IS null OR lower(u.name) LIKE '%' || lower(CAST(:userNamePart as string)) || '%' ) " +
        "AND (:phonePart IS null OR lower(o.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%' ) " +
        "AND (COALESCE(:statusNames, NULL) IS NULL OR CAST(o.status as string) IN :statusNames) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR o.created BETWEEN :createdFrom AND :createdTo) " +
        "AND ((CAST(:closedFrom AS date) IS null OR CAST(:closedTo AS date) IS null) OR o.closed BETWEEN :closedFrom AND :closedTo) " +
        "AND (:priceToPayFrom IS null OR (o.totalPrice - o.discount) BETWEEN :priceToPayFrom AND :priceToPayTo) " +
        "AND (:paid IS null OR :paid = true AND o.paid IS NOT NULL OR :paid = false AND o.paid IS NULL) ")
    Page<Order> findForAdminByFilters(Long id, List<String> statusNames, Long userId, String userNamePart, String phonePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo, LocalDateTime closedFrom, LocalDateTime closedTo,
                                                              Integer priceToPayFrom, Integer priceToPayTo, Boolean paid,
                                                              Pageable pageRequest);

    @Query("SELECT o FROM Order o " +
        "LEFT JOIN o.user u " +
        "WHERE (:id IS null OR o.id = :id) " +
        "AND (:userId IS null OR u.id = :userId) " +
        "AND (u IS null OR :userNamePart IS null OR lower(u.name) LIKE '%' || lower(CAST(:userNamePart as string)) || '%' ) " +
        "AND (:phonePart IS null OR lower(o.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%' ) " +
        "AND (COALESCE(:statusNames, NULL) IS NULL OR CAST(o.status as string) IN :statusNames) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR o.created BETWEEN :createdFrom AND :createdTo) " +
        "AND ((CAST(:closedFrom AS date) IS null OR CAST(:closedTo AS date) IS null) OR o.closed BETWEEN :closedFrom AND :closedTo) " +
        "AND (:priceToPayFrom IS null OR (o.totalPrice - o.discount) BETWEEN :priceToPayFrom AND :priceToPayTo) " +
        "AND (:paid IS null OR :paid = true AND o.paid IS NOT NULL OR :paid = false AND o.paid IS NULL) ")
    List<Order> findAllForAdminByFilters(Long id, List<String> statusNames, Long userId, String userNamePart, String phonePart,
                                      LocalDateTime createdFrom, LocalDateTime createdTo, LocalDateTime closedFrom, LocalDateTime closedTo,
                                      Integer priceToPayFrom, Integer priceToPayTo, Boolean paid, Sort sort);

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

    @Query("SELECT sum(oi.amount) FROM Order o " +
        "LEFT JOIN o.orderItems oi " +
        "WHERE o.created > :createdAfter " +
        "AND o.status in :statuses")
    Integer countSoldAmountByCreatedAfterAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    @Query("SELECT sum(o.totalPrice - o.discount) / 100 FROM Order o " +
        "WHERE o.created > :createdAfter " +
        "AND o.status in :statuses")
    Integer countSoldPriceByCreatedAfterAndStatusIn(LocalDateTime createdAfter, List<Order.Status> statuses);

    @Modifying
    @Query("UPDATE Order o SET o.status = :newStatus " +
        "WHERE o.sent < :sentBefore " +
        "AND o.status in :statuses")
    void updateStatusForSentBeforeAndStatusIn(LocalDateTime sentBefore, List<Order.Status> statuses, Order.Status newStatus);

    @Modifying
    @Query("UPDATE Order o SET o.status = :newStatus " +
        "WHERE o.sent < :createdBefore " +
        "AND o.status in :statuses")
    void updateStatusForCreatedBeforeAndStatusIn(LocalDateTime createdBefore, List<Order.Status> statuses, Order.Status newStatus);

}
