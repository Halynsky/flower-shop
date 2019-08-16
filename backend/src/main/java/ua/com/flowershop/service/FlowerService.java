package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.repository.FlowerRepository;


import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class FlowerService {

    @Autowired private FlowerRepository flowerRepository;

    public Page<FlowerFullProjection> findForAdmin(Long id, String flowerNamePart, String flowerOriginalNamePart, List<String> flowerTypeNames, String groupNamePart,
                                                   Integer sizeFrom, Integer sizeTo, Integer heightFrom, Integer heightTo,
                                                   Integer popularityFrom, Integer popularityTo, String colorNamePart,
                                                   LocalDateTime createdFrom, LocalDateTime createdTo,
                                                   Pageable pageRequest) {
        return flowerRepository.findForAdminProjectedByFilters(id, flowerNamePart, flowerOriginalNamePart, flowerTypeNames, groupNamePart, sizeFrom, sizeTo, heightFrom,
            heightTo, popularityFrom, popularityTo, colorNamePart, createdFrom, createdTo, pageRequest );
    }

    public FlowerFullProjection getFlowerById(Long id) {
        return flowerRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public FlowerFullProjection getFlowerFullById(Long id) {
        return flowerRepository.findFullProjectedById(id).orElseThrow(NotFoundException::new);
    }

}
