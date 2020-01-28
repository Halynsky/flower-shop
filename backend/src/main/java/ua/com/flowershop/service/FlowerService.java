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
import ua.com.flowershop.projection.FlowerWithAvailableFlagProjection;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.util.HibernateUtil;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Slf4j
@Service
public class FlowerService {

    private static final int MAX_FLOWER_TYPE_IMG_SIZE = 600;
    private static final List<String> unsafeSortingFields =  Arrays.asList("hasAvailableFlowerSize");

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

    public FlowerFullProjection getFlowerById(Long id) {
        return flowerRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

    public Page<FlowerWithAvailableFlagProjection> getForShop (String searchTerm, List<Long> flowerTypeFilters, List<Long> sizeFilters,
                                                               List<Long> colorFilters, Pageable pageRequest) {

        flowerTypeFilters = HibernateUtil.fixEmptyFilter(flowerTypeFilters);
        sizeFilters = HibernateUtil.fixEmptyFilter(sizeFilters);
        colorFilters = HibernateUtil.fixEmptyFilter(colorFilters);

        return flowerRepository.findProjectedByFilters(searchTerm, flowerTypeFilters, colorFilters, sizeFilters,
            HibernateUtil.replaceUnsafeFields(pageRequest, unsafeSortingFields));

    }

    public FlowerFullProjection getFlowerFullById(Long id) {
        return flowerRepository.findFullProjectedById(id).orElseThrow(NotFoundException::new);
    }

    @Transactional
    public void create(FlowerModel flower, MultipartFile image) {
        Flower flowerToCreate = new Flower();
        if(nonNull(image)) {
            String imageUrl = imageService.saveImage(image, MAX_FLOWER_TYPE_IMG_SIZE);
            flower.setImage(imageUrl);
        }

        flower.getFlowerSizes().forEach(flowerSize -> {
            flowerSize.setFlower(flowerToCreate);
            flowerSizeRepository.save(flowerSize);
        });

        flowerToCreate
            .setName(flower.getName())
            .setNameOriginal(flower.getNameOriginal())
            .setGroup(flower.getGroup())
            .setImage(flower.getImage())
            .setDescription(flower.getDescription())
            .setColor(flower.getColor())
            .setColorSecondary(flower.getColorSecondary())
            .setFlowerHeightMax(flower.getFlowerHeightMax())
            .setFlowerHeightMin(flower.getFlowerHeightMin())
            .setFlowerSizeMax(flower.getFlowerSizeMax())
            .setFlowerSizeMin(flower.getFlowerSizeMin())
            .setIsNew(flower.getIsNew())
            .setIsPopular(flower.getIsPopular())
            .setFlowerType(flower.getFlowerType()).setColor(flower.getColor())
            .setFlowerSizes(flower.getFlowerSizes());
        flowerRepository.save(flowerToCreate);
    }

    @Transactional
    public void update(Long id, FlowerModel flower, MultipartFile image) {
        Flower flowerToUpdate = flowerRepository.findById(id).orElseThrow(NotFoundException::new);
        if(nonNull(image)) {
            if (nonNull(flowerToUpdate.getImage())) {
                imageService.silentDelete(flowerToUpdate.getImage());
            }
            String imageUrl = imageService.saveImage(image, MAX_FLOWER_TYPE_IMG_SIZE);
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

        flowerToUpdate
            .setName(flower.getName())
            .setNameOriginal(flower.getNameOriginal())
            .setGroup(flower.getGroup())
            .setImage(flower.getImage())
            .setDescription(flower.getDescription())
            .setColor(flower.getColor())
            .setColorSecondary(flower.getColorSecondary())
            .setFlowerHeightMax(flower.getFlowerHeightMax())
            .setFlowerHeightMin(flower.getFlowerHeightMin())
            .setFlowerSizeMax(flower.getFlowerSizeMax())
            .setFlowerSizeMin(flower.getFlowerSizeMin())
            .setIsNew(flower.getIsNew())
            .setIsPopular(flower.getIsPopular())
            .setCreated(flower.getCreated())
            .setFlowerType(flower.getFlowerType()).setColor(flower.getColor());
        flowerRepository.save(flowerToUpdate);

    }


}
