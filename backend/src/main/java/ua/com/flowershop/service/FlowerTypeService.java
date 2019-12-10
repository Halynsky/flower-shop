package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.FlowerTypeModel;
import ua.com.flowershop.projection.FlowerTypeProjection;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.repository.ImageRepository;

import java.util.List;
import java.util.Objects;

import static java.util.Objects.nonNull;

@Slf4j
@Service
public class FlowerTypeService {

    @Autowired private FlowerTypeRepository flowerTypeRepository;
    @Autowired private ImageService imageService;
    @Autowired private ImageRepository imageRepository;

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

    @Transactional
    public FlowerType save(FlowerTypeModel flowerTypeModel, MultipartFile image) {
        FlowerType flowerType = FlowerType.of(flowerTypeModel);
        if(nonNull(image)) {
            String imageUrl = imageService.saveImage(image);
            flowerType.setImage(imageUrl);
        }
        return flowerTypeRepository.save(flowerType);
    }


    public FlowerType update(Long id, FlowerTypeModel flowerTypeModel, MultipartFile image) {
        FlowerType flowerType = flowerTypeRepository.findById(id).orElseThrow(NotFoundException::new);
        flowerType.setName(flowerTypeModel.getName());
        flowerType.setNameSingle(flowerTypeModel.getNameSingle());
        if(nonNull(image)) {
            String imageUrl = imageService.updateImage(image, flowerType.getImage());
            flowerType.setImage(imageUrl);
        }
        return flowerTypeRepository.save(flowerType);
    }

    @Transactional
    public void delete(Long id) {
        FlowerType flowerType = this.flowerTypeRepository.findById(id).orElseThrow(NotFoundException::new);
        this.imageRepository.deleteByName(flowerType.getImage());
        this.flowerTypeRepository.delete(flowerType);
    }

}
