package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.com.flowershop.projection.FlowerSizeFullProjectionWithAvailable;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.util.HibernateUtil;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class FlowerSizeService {

    private static final List<String> unsafeSortingFields =  Arrays.asList("available");

    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public Page<FlowerSizeFullProjectionWithAvailable> findForAdminProjectedByFilters(Long id, String flowerNamePart, List<String> flowerTypeNames, Integer priceFrom, Integer priceTo, String colorNamePart, Pageable pageRequest) {
        return flowerSizeRepository.findForAdminProjectedByFilters(id, flowerNamePart, flowerTypeNames, priceFrom, priceTo,
            colorNamePart, HibernateUtil.replaceUnsafeFields(pageRequest, unsafeSortingFields));
    }


}
