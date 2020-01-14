package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.FlowerModel;
import ua.com.flowershop.projection.FlowerFullProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Slf4j
@Service
public class FlowerService {

    @Autowired private FlowerRepository flowerRepository;
    @Autowired private ImageService imageService;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

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

    @Transactional
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

    @Transactional
    public void update(Long id, FlowerModel flower, MultipartFile image) {
        Flower flowerToUpdate = flowerRepository.findById(id).orElseThrow(NotFoundException::new);
        if(nonNull(image)) {
            String imageUrl = imageService.saveImage(image);
            flower.setImage(imageUrl);
        }

        flowerToUpdate.getFlowerSizes().forEach(flowerSize -> {
            FlowerSize found = flower.getFlowerSizes().stream().filter(existed -> existed.getSize().getId().equals(flowerSize.getSize().getId())).findFirst().orElse(null);
            if (isNull(found)) {

                try {
                    flowerSizeRepository.delete(flowerSize);
                } catch (Exception e) {
                    throw new ConflictException("Неможливо видалити вказаний розмір, оскільки він вже фігурує в інших записах бази даних");
                }

            }
        });

        flower.getFlowerSizes().forEach(flowerSize -> {
            FlowerSize found = flowerToUpdate.getFlowerSizes().stream().filter(existed -> existed.getSize().getId().equals(flowerSize.getSize().getId())).findFirst().orElse(null);
            if (nonNull(found)) {
                found.setPrice(flowerSize.getPrice());
                flowerSizeRepository.save(found);
            } else {
                flowerSize.setFlower(flowerToUpdate);
                flowerSizeRepository.save(flowerSize);
            }
        });


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
            .setFlowerType(flower.getFlowerType()).setColor(flower.getColor());
//            .setFlowerSizes(flower.getFlowerSizes());
        flowerRepository.save(flowerToUpdate);


    }



}
