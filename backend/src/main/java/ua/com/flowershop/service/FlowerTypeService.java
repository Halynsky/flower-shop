package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.repository.FlowerTypeRepository;

import java.util.List;

@Slf4j
@Service
public class FlowerTypeService {

    @Autowired
    private FlowerTypeRepository flowerTypeRepository;

    public List<FlowerTypeProjection> getAllFlowerTypes() {
        return flowerTypeRepository.findBy();
    }

    public FlowerTypeProjection getFlowerType(Long id) {
        return flowerTypeRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

}
