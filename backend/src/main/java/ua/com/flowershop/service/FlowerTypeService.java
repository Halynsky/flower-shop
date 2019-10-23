package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.FlowerTypeModel;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.repository.FlowerTypeRepository;

import java.util.List;

@Slf4j
@Service
public class FlowerTypeService {

    @Autowired private FlowerTypeRepository flowerTypeRepository;

    public Boolean isNameFree(String name) {
        return !flowerTypeRepository.existsByName(name);
    }

    public List<FlowerTypeProjection> getAllFlowerTypes() {
        return flowerTypeRepository.findProjectedBy();
    }

    public FlowerTypeProjection getFlowerType(Long id) {
        return flowerTypeRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public FlowerTypeProjection getFlowerTypeByName(String name) {
        return flowerTypeRepository.findProjectedByName(name).orElseThrow(NotFoundException::new);
    }

    public FlowerType update(Long id, FlowerTypeModel flowerTypeModel) {
        FlowerType flowerType = flowerTypeRepository.findById(id).orElseThrow(NotFoundException::new);
        flowerType.setName(flowerTypeModel.getName());
        flowerType.setNameSingle(flowerTypeModel.getNameSingle());
        return flowerTypeRepository.save(flowerType);
    }

}
