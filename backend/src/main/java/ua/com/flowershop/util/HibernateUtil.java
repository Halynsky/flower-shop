package ua.com.flowershop.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;

import java.util.Iterator;
import java.util.List;

import static java.util.Objects.isNull;

public class HibernateUtil {

    public static List fixEmptyFilter(List list) {
        return isNull(list) || list.isEmpty() ? null : list;
    }

    public static Pageable replaceUnsafeFields (Pageable pageRequest, List<String> unsafeSortingFields) {
        Iterator sortIterator = pageRequest.getSort().iterator();
        Sort sort = null;

        while (sortIterator.hasNext()) {
            Sort.Order sortOrder = ((Sort.Order) sortIterator.next());
            Sort sortPart;

            if (unsafeSortingFields.contains(sortOrder.getProperty())) {
                sortPart = JpaSort.unsafe(sortOrder.getDirection(), "(" + sortOrder.getProperty() + ")");
            } else {
                sortPart = JpaSort.by(sortOrder);
            }

            if(isNull(sort)) {
                sort = sortPart;
            } else {
                sort =  sort.and(sortPart);
            }

        }

        return PageRequest.of(pageRequest.getPageNumber(), pageRequest.getPageSize(), sort);
    }

}
