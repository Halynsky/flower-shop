package ua.com.flowershop.service;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.model.Record;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.repository.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static java.time.Period.between;

@Slf4j
@Service
public class StatisticsService {

    private static final String RELEASE_DATE_STRING = "2020-01-01";
    private static final LocalDate RELEASE_DATE = LocalDate.parse(RELEASE_DATE_STRING, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

    private static final int MONTH_IN_QUARTER = 3;
    private static final int MONTH_IN_YEAR = 12;
    private static final int DAYS_IN_MONTH = 30;

    @Autowired private EntityManager em;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public List<Record> getUsersRegistrationStatisticStructural() {
        Integer activeUsersCount = userRepository.countAllByIsActivatedAndIsVirtual(true, false);
        Integer notActiveUsersCount = userRepository.countAllByIsActivatedAndIsVirtual(false, false);
        Integer virtualUsersCount = userRepository.countAllByIsActivatedAndIsVirtual(true, false);

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record(activeUsersCount, "ACTIVATED", "Активовані"));
        statistic.add(new Record(notActiveUsersCount, "NOT_ACTIVATED", "Неактивовані"));
        statistic.add(new Record(virtualUsersCount, "VIRTUAL", "Віртуальні"));

        return statistic;
    }

    public List<Record> getUsersRegistrationStatisticDynamical(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        int interval = period.getInterval();
        String periodName = period.getPeriodName();

        String activatedQueryText =
            "WITH time_units AS (SELECT time_unit FROM generate_series(CURRENT_DATE - INTERVAL '%s', CURRENT_DATE, INTERVAL '%s') time_unit) " +
                "SELECT (SELECT COUNT(u.id) FROM users AS u " +
                "WHERE date_trunc(?1, u.created) = date_trunc(?1, tu.time_unit) AND u.is_activated IS true AND u.is_virtual = false) AS amount, " +
                "date_trunc(?1, tu.time_unit) AS date, 'USERS_ACTIVATED' AS type, 'Зареєстровані' AS name " +
                "FROM time_units tu " +
                "GROUP BY tu.time_unit ORDER BY tu.time_unit";
        activatedQueryText = String.format(activatedQueryText, interval + " " + periodName, "1 " + periodName);

        Query activatedQuery = this.em.createNativeQuery(activatedQueryText, "StatisticDate")
            .setParameter(1, periodName);

        return activatedQuery.getResultList();
    }

    public List<Record> getOrderByStatusCountStatisticStructural(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        LocalDateTime startDate = period.getStartDate();

        Integer activeOrdersCount = orderRepository.countAllByCreatedAfterAndStatusIn(startDate, Order.Status.getActive());
        Integer doneOrdersCount = orderRepository.countAllByCreatedAfterAndStatusIn(startDate, Collections.singletonList(Order.Status.DONE));

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record(activeOrdersCount, "ORDERS_ACTIVE", "Активні (Нові, В обробці)"));
        statistic.add(new Record(doneOrdersCount, "ORDERS_DONE", "Виконані"));

        return statistic;
    }

    public List<Record> getOrderByStatusCountStatisticDynamical(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        int interval = period.getInterval();
        String periodName = period.getPeriodName();

        String activeQueryText =
            "WITH time_units AS (SELECT time_unit FROM generate_series(CURRENT_DATE - INTERVAL '%s', CURRENT_DATE, INTERVAL '%s') time_unit) " +
                "SELECT (SELECT COUNT(o.id) FROM orders AS o " +
                "WHERE o.status <> 'CANCELED' AND date_trunc(?1, o.created) = date_trunc(?1, tu.time_unit)) AS amount, " +
                "date_trunc(?1, tu.time_unit) AS date, 'ORDERS_CREATED' AS type, 'Створені' AS name " +
                "FROM time_units tu " +
                "GROUP BY tu.time_unit ORDER BY tu.time_unit";
        activeQueryText = String.format(activeQueryText, interval + " " + periodName, "1 " + periodName);

        String notActiveQueryText =
            "WITH time_units AS (SELECT time_unit FROM generate_series(CURRENT_DATE - INTERVAL '%s', CURRENT_DATE, INTERVAL '%s') time_unit) " +
                "SELECT (SELECT COUNT(o.id) FROM orders AS o " +
                "WHERE date_trunc(?1, o.created) = date_trunc(?1, tu.time_unit) AND (o.status = 'DONE' OR o.status = 'DELIVERING')) AS amount, " +
                "date_trunc(?1, tu.time_unit) AS date, 'ORDERS_DONE' AS type, 'Виконані' AS name " +
                "FROM time_units tu " +
                "GROUP BY tu.time_unit ORDER BY tu.time_unit";
        notActiveQueryText = String.format(notActiveQueryText, interval + " " + periodName, "1 " + periodName);

        Query activeQuery = this.em.createNativeQuery(activeQueryText, "StatisticDate")
            .setParameter(1, periodName);

        Query notActiveQuery = this.em.createNativeQuery(notActiveQueryText, "StatisticDate")
            .setParameter(1, periodName);

        List<Record> statistic = activeQuery.getResultList();
        statistic.addAll(notActiveQuery.getResultList());

        return statistic;
    }

    public List<Record> getOrderByPaidCountStatisticStructural(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        LocalDateTime startDate = period.getStartDate();

        Integer paidOrdersCount = orderRepository.countAllByCreatedAfterAndPaidIsNotNullAndStatusIn(startDate, Order.Status.getActive());
        Integer notPaidOrdersCount = orderRepository.countAllByCreatedAfterAndPaidIsNullAndStatusIn(startDate, Order.Status.getActive());

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record(paidOrdersCount, "ORDERS_PAID", "Оплачені"));
        statistic.add(new Record(notPaidOrdersCount, "ORDERS_NOT_PAID", "Не оплачені"));

        return statistic;
    }

    public List<Record> getOrderByPaidAmountStatisticStructural(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        LocalDateTime startDate = period.getStartDate();

        Integer paidOrdersCount = orderRepository.countAmountByCreatedAfterAndPaidIsNotNullAndStatusIn(startDate, Order.Status.getActive());
        Integer notPaidOrdersCount = orderRepository.countAmountByCreatedAfterAndPaidIsNullAndStatusIn(startDate, Order.Status.getActive());

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record(paidOrdersCount, "ORDERS_PAID", "Оплачені"));
        statistic.add(new Record(notPaidOrdersCount, "ORDERS_NOT_PAID", "Не оплачені"));

        return statistic;
    }

    public List<Record> getWarehouseItemsAmountStatisticStructural(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        LocalDateTime startDate = period.getStartDate();

        Object[][] queryResult = flowerSizeRepository.countWarehouseItems();
        Integer soldCount = orderRepository.countSoldAmountByCreatedAfterAndStatusIn(startDate, Arrays.asList(Order.Status.DONE, Order.Status.DELIVERING));

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record((Long) queryResult[0][0], "AVAILABLE", "Доступно"));
        statistic.add(new Record((Long) queryResult[0][1], "RESERVED", "Зарезервовано"));
        statistic.add(new Record(soldCount, "SOLD", "Продано"));

        return statistic;
    }

    public List<Record> getWarehouseItemsPriceStatisticStructural(Record.Period recordPeriod) {
        Period period = new Period(recordPeriod);
        LocalDateTime startDate = period.getStartDate();

        Object[][] queryResult = flowerSizeRepository.countWarehouseItemsPrice();
        Integer soldCount = orderRepository.countSoldPriceByCreatedAfterAndStatusIn(startDate, Arrays.asList(Order.Status.DONE, Order.Status.DELIVERING));

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record((Long) queryResult[0][0], "AVAILABLE", "Доступно"));
        statistic.add(new Record((Long) queryResult[0][1], "RESERVED", "Зарезервовано"));
        statistic.add(new Record(soldCount, "SOLD", "Продано"));

        return statistic;
    }

    @Getter
    private class Period {
        private int interval;
        private String periodName;
        private LocalDateTime startDate;

        public Period(Record.Period period) {
            switch (period) {
                case MONTH:
                    interval = DAYS_IN_MONTH;
                    periodName = "day";
                    startDate = LocalDateTime.now().minusDays(interval);
                    break;
                case QUARTER:
                    interval = MONTH_IN_QUARTER;
                    periodName = "month";
                    startDate = LocalDateTime.now().minusMonths(interval);
                    break;
                case YEAR:
                    interval = MONTH_IN_YEAR;
                    periodName = "month";
                    startDate = LocalDateTime.now().minusMonths(interval);
                    break;
                default:
                    interval = between(RELEASE_DATE, LocalDate.now()).getMonths() + 1;
                    periodName = "month";
                    startDate = LocalDateTime.now().minusMonths(interval);
                    break;
            }
            // Offset 1 period to get correct data in sql
            interval--;
        }
    }

}
