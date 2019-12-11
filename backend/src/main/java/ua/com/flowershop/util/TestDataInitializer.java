package ua.com.flowershop.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Component;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.entity.Image;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerTypeRepository;
import ua.com.flowershop.repository.ImageRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static ua.com.flowershop.util.Path.IMAGES_PATH;

@Slf4j
@Component
@Profile({"dev", "stg"})
public class TestDataInitializer {

    @Autowired private ResourceLoader resourceLoader;
    @Autowired private ImageRepository imageRepository;
    @Autowired private FlowerTypeRepository flowerTypeRepository;
    @Autowired private FlowerRepository flowerRepository;

    @PostConstruct
    public void init() {
        log.info("Start test data ======================================");
        try {
            setFlowerTypeImagesIntoDb("classpath*:**/tmp/images/flower-types/*.jpg");
            setFlowerImagesIntoDb("classpath*:**/tmp/images/flowers/*.jpg");
        } catch (IOException e) {
            log.error("Failed to load images", e);
        }
        log.info("END test data ==============================================");
    }

    private void setFlowerTypeImagesIntoDb(String pattern) throws IOException {
        Resource[] resources = ResourcePatternUtils.getResourcePatternResolver(resourceLoader).getResources(pattern);
        Map<String, Resource> images = new HashMap<>();
        for (Resource resource : resources) {
            images.put(resource.getFilename().split("\\.")[0], resource);
        }

        for (FlowerType flowerType : flowerTypeRepository.findAll()) {
            String imageUrl = saveImage(images.get(flowerType.getNameOriginal()));
            flowerTypeRepository.save(flowerType.setImage(imageUrl));
        }

    }

    private void setFlowerImagesIntoDb(String pattern) throws IOException {
        Resource[] resources = ResourcePatternUtils.getResourcePatternResolver(resourceLoader).getResources(pattern);
        Map<String, Resource> images = new HashMap<>();
        for (Resource resource : resources) {
            images.put(resource.getFilename().split("\\.")[0], resource);
        }

        for (Flower flower : flowerRepository.findAll()) {
            String imageUrl = saveImage(images.get(flower.getNameOriginal()));
            flowerRepository.save(flower.setImage(imageUrl));
        }

    }

    private String saveImage(Resource resource) throws IOException {
        String fileName = resource.getFilename();
        String ext = fileName.substring(fileName.lastIndexOf('.'));
        String name = UUID.randomUUID().toString().toLowerCase() + ext;
        byte[] bytes = IOUtils.toByteArray(resource.getInputStream());
        imageRepository.save(new Image().setName(name)
            .setData(bytes)
            .setExtension(ext)
        );
        return IMAGES_PATH + '/' + name;
    }


}
