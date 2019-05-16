package ua.com.flowershop.util;

import java.util.List;

import static java.util.Objects.isNull;

public class HibernateUtil {

    public static List fixEmptyFilter(List list) {
       return isNull(list) || list.isEmpty() ? null : list;
    }

}
