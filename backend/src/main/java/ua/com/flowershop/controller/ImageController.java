package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.entity.Image;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.ImageRepository;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.service.ImageService;

import java.util.concurrent.TimeUnit;

import static ua.com.flowershop.util.Constants.SLASH;
import static ua.com.flowershop.util.Path.*;


@RestController
public class ImageController {

    @Autowired private ImageRepository imageRepository;
    @Autowired private ImageService imageService;
    @Autowired private UserRepository userRepository;
    @Autowired private FlowerRepository flowerRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @GetMapping(value = IMAGES_PATH + "/{name:.+}", produces={MediaType.IMAGE_JPEG_VALUE,  MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<Resource> getImage(@PathVariable String name) {
        HttpHeaders headers = new HttpHeaders();
        Image image = imageRepository.findOptionalByName(name).orElseThrow(NotFoundException::new);
        byte[] media = image.getData();
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).getHeaderValue());
        return new ResponseEntity<>(new ByteArrayResource(media), headers, HttpStatus.OK);
    }

    @GetMapping(FLOWERS_PATH + ID_PATH_VARIABLE + SLASH + ICON)
    public ResponseEntity<Resource> getFlowerIcon(@PathVariable("id") long id) {
        String iconUrl = flowerRepository.getImage(id).orElseThrow(NotFoundException::new);
        return getImageByURL(iconUrl);
    }

    @GetMapping(FLOWER_SIZES_PATH + ID_PATH_VARIABLE + SLASH + ICON)
    public ResponseEntity<Resource> getFlowerSizeIcon(@PathVariable("id") long id) {
        String iconUrl = flowerSizeRepository.getImage(id).orElseThrow(NotFoundException::new);
        return getImageByURL(iconUrl);
    }

    @GetMapping(USERS_PATH + ID_PATH_VARIABLE + SLASH + ICON)
    public ResponseEntity<Resource> getUserIcon(@PathVariable("id") long id) {
        String iconUrl = userRepository.getIcon(id).orElseThrow(NotFoundException::new);
        return getImageByURL(iconUrl);
    }

    private ResponseEntity<Resource> getImageByURL(String imageUrl) {
        String imageName = imageService.getImageNameFromURL(imageUrl);
        return getImage(imageName);
    }

}
