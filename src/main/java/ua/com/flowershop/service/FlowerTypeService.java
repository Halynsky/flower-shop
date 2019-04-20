package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.repository.FlowerTypeRepository;

import java.util.List;

@Slf4j
@Service
public class FlowerTypeService {

    @Autowired
    private FlowerTypeRepository flowerTypeRepository;

    public List<FlowerType> getAllFlowerTypes() {
        return flowerTypeRepository.findAll();
    }

    public FlowerType getFlowerType(long id) {
        return flowerTypeRepository.findById(id).get();
    }

}
