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

    private static final List<String> unsafeSortingFields =  Arrays.asList("available", "isAvailable", "f.price", "f.isPopular", "f.isNew", "f.popularity");

    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public Page<FlowerSizeFullProjectionWithAvailable> findForAdminProjectedByFilters(Long id, String codePart, String flowerNamePart, List<String> flowerTypeNames, Integer priceFrom, Integer priceTo, String colorNamePart, Pageable pageRequest) {
        return flowerSizeRepository.findForAdminProjectedByFilters(id, codePart, flowerNamePart, flowerTypeNames, priceFrom, priceTo,
            colorNamePart, HibernateUtil.replaceUnsafeFields(pageRequest, unsafeSortingFields));
    }

    public Page<FlowerSizeFullProjectionWithAvailable> getForShop (String searchTerm, List<Long> flowerTypeFilters, List<Long> sizeFilters,
                                                          List<Long> colorFilters, Pageable pageRequest) {

        flowerTypeFilters = HibernateUtil.fixEmptyFilter(flowerTypeFilters);
        sizeFilters = HibernateUtil.fixEmptyFilter(sizeFilters);
        colorFilters = HibernateUtil.fixEmptyFilter(colorFilters);

        return flowerSizeRepository.findProjectedByFilters(searchTerm, flowerTypeFilters, colorFilters, sizeFilters,
            HibernateUtil.replaceUnsafeFields(pageRequest, unsafeSortingFields));

    }

}
