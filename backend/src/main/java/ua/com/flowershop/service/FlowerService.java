package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.FlowerModel;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.repository.FlowerRepository;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.Objects.nonNull;

@Slf4j
@Service
public class FlowerService {

    @Autowired private FlowerRepository flowerRepository;
    @Autowired private ImageService imageService;

    public Page<FlowerFullProjection> findForAdmin(Long id, String flowerNamePart, String flowerOriginalNamePart, List<String> flowerTypeNames, String groupNamePart,
                                                   Integer sizeFrom, Integer sizeTo, Integer heightFrom, Integer heightTo,
                                                   Integer popularityFrom, Integer popularityTo, String colorNamePart,
                                                   LocalDateTime createdFrom, LocalDateTime createdTo,
                                                   Pageable pageRequest) {
        return flowerRepository.findForAdminProjectedByFilters(id, flowerNamePart, flowerOriginalNamePart, flowerTypeNames, groupNamePart, sizeFrom, sizeTo, heightFrom,
            heightTo, popularityFrom, popularityTo, colorNamePart, createdFrom, createdTo, pageRequest);
    }

    public Boolean isNameOriginalFree(String name) {
        return !flowerRepository.existsByNameOriginal(name);
    }

    public Boolean isNameFree(String name) {
        return !flowerRepository.existsByName(name);
    }

    public FlowerFullProjection getFlowerById(Long id) {
        return flowerRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public FlowerFullProjection getFlowerFullById(Long id) {
        return flowerRepository.findFullProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public void create(FlowerModel flower, MultipartFile image) {
        Flower flowerToCreate = new Flower();
        if(nonNull(image)) {
            String imageUrl = imageService.saveImage(image);
            flower.setImage(imageUrl);
        }
        flowerToCreate.setColor(flower.getColor())
            .setName(flower.getName())
            .setNameOriginal(flower.getNameOriginal())
            .setImage(flower.getImage())
            .setGroupName(flower.getGroupName())
            .setFlowerHeightMax(flower.getFlowerHeightMax())
            .setFlowerHeightMin(flower.getFlowerHeightMin())
            .setFlowerSizeMax(flower.getFlowerSizeMax())
            .setFlowerSizeMin(flower.getFlowerSizeMin())
            .setIsNew(flower.getIsNew())
            .setIsPopular(flower.getIsPopular())
            .setCreated(flower.getCreated())
            .setFlowerType(flower.getFlowerType()).setColor(flower.getColor())
            .setFlowerSizes(flower.getFlowerSizes());
        flowerRepository.save(flowerToCreate);
    }

    public void update(Long id, FlowerModel flower, MultipartFile image) {
        Flower flowerToUpdate = flowerRepository.findById(id).orElseThrow(NotFoundException::new);
        if(nonNull(image)) {
            String imageUrl = imageService.saveImage(image);
            flower.setImage(imageUrl);
        }
        flowerToUpdate.setColor(flower.getColor())
            .setName(flower.getName())
            .setNameOriginal(flower.getNameOriginal())
            .setImage(flower.getImage())
            .setGroupName(flower.getGroupName())
            .setFlowerHeightMax(flower.getFlowerHeightMax())
            .setFlowerHeightMin(flower.getFlowerHeightMin())
            .setFlowerSizeMax(flower.getFlowerSizeMax())
            .setFlowerSizeMin(flower.getFlowerSizeMin())
            .setIsNew(flower.getIsNew())
            .setIsPopular(flower.getIsPopular())
            .setCreated(flower.getCreated())
            .setFlowerType(flower.getFlowerType()).setColor(flower.getColor())
            .setFlowerSizes(flower.getFlowerSizes());
        flowerRepository.save(flowerToUpdate);
    }



}
