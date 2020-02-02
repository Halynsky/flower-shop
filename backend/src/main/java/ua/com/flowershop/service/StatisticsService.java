package ua.com.flowershop.service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.model.Record;
import ua.com.flowershop.repository.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static java.time.Period.between;


@Service
public class StatisticsService {

    private static final String RELEASE_DATE_STRING = "2020-01-01";
    private static final LocalDate RELEASE_DATE = LocalDate.parse(RELEASE_DATE_STRING, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

    private static final int MONTH_IN_QUARTER = 3;
    private static final int MONTH_IN_YEAR = 12;
    private static final int DAYS_IN_MONTH = 30;

    @Autowired private EntityManager em;
    @Autowired private UserRepository userRepository;

    public List<Record> getUserRegistrationStatisticStructural() {
        Integer activeUsersCount = this.userRepository.countAllByIsActivatedAndIsVirtual(true, false);
        Integer notActiveUsersCount = this.userRepository.countAllByIsActivatedAndIsVirtual(false, false);
        Integer virtualUsersCount = this.userRepository.countAllByIsActivatedAndIsVirtual(true, false);

        List<Record> statistic = new ArrayList<>();
        statistic.add(new Record(activeUsersCount, "ACTIVATED", "Активовані"));
        statistic.add(new Record(notActiveUsersCount, "NOT_ACTIVATED", "Не активовані"));
        statistic.add(new Record(virtualUsersCount, "VIRTUAL", "Віртуальні"));

        return statistic;
    }

    public List<Record> getUsersRegistrationStatisticDynamical(Record.Period period) {
        Period period1 = new Period(period);
        int interval = period1.getInterval();
        String periodName = period1.getPeriodName();

        String activatedQueryText =
            "WITH time_units AS (SELECT time_unit FROM generate_series(CURRENT_DATE - INTERVAL '%s', CURRENT_DATE, INTERVAL '%s') time_unit) " +
                "SELECT (SELECT COUNT(u.id) FROM users AS u " +
                "WHERE date_trunc(?1, u.created) = date_trunc(?1, tu.time_unit) AND u.is_activated IS true AND u.is_virtual = false) AS amount, " +
                "date_trunc(?1, tu.time_unit) AS date, 'ACTIVATED' AS type, 'Зареєстровані' AS name " +
                "FROM time_units tu " +
                "GROUP BY tu.time_unit ORDER BY tu.time_unit";
        activatedQueryText = String.format(activatedQueryText, interval + " " + periodName, "1 " + periodName);

        Query activatedQuery = this.em.createNativeQuery(activatedQueryText, "StatisticDate")
            .setParameter(1, periodName);

        return activatedQuery.getResultList();
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
