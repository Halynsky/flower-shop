package ua.com.flowershop.service;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ua.com.flowershop.entity.Image;
import ua.com.flowershop.exception.InternalServerException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.repository.ImageRepository;

import javax.validation.ValidationException;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;
import java.util.stream.Collectors;

import static ua.com.flowershop.util.Constants.SLASH;
import static ua.com.flowershop.util.Path.IMAGES_PATH;

@Slf4j
@Service
public class ImageService {

    private static final char COMMA = ',';
    private static final char FILE_EXTENSION_SEPARATOR = '.';

    @Autowired private ImageRepository imageRepository;

    public String saveImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            log.error("Image is empty");
            throw new ValidationException("Image is empty");
        }

        try {
            Image image = buildImage(file.getBytes(), file.getOriginalFilename());
            return saveGenericImage(image);
        } catch (Exception e) {
            log.error("Could not save image", e);
            throw new InternalServerException("Unexpected error during image upload");
        }

    }

    /**
     * Saves Image.
     * Accepts image as BASE64 encoded data like "data:image/jpeg;base64,/9j/4AAQ...yD==".
     *
     * @return image url
     */
    public String saveBase64Image(String imageInBase64) throws ValidationException, InternalServerException {
        String imageUrl;
        int startOfBase64Data = imageInBase64.indexOf(COMMA) + 1;
        imageInBase64 = imageInBase64.substring(startOfBase64Data, imageInBase64.length());
        if (!Base64.isBase64(imageInBase64)) {
            throw new ValidationException("Image is not in BASE64 format!");
        }


        try {
            byte[] data = Base64.decodeBase64(imageInBase64);
            Image image = buildImage(data,null);
            imageUrl = saveGenericImage(image);
        } catch (Exception e) {
            throw new InternalServerException("Could not upload image", e);
        }
        return imageUrl;
    }

    public boolean isBase64Image(String imageInBase64) {
        if(imageInBase64 == null) {
            return  false;
        }
        int startOfBase64Data = imageInBase64.indexOf(COMMA) + 1;
        imageInBase64 = imageInBase64.substring(startOfBase64Data, imageInBase64.length());
        return  Base64.isBase64(imageInBase64);
    }

    private String saveGenericImage(Image image) {
        imageRepository.save(image);
        return IMAGES_PATH + SLASH + image.getName();
    }

    private Image buildImage(byte[] data, String filename) {
        String ext = (filename == null) ? ".jpg" : filename.substring(filename.lastIndexOf(FILE_EXTENSION_SEPARATOR));
        String name = UUID.randomUUID().toString().toLowerCase() + ext;
        return new Image(name, ext, data);
    }

    public void remove(String imageName) throws NotFoundException {
        long i = imageRepository.deleteByName(imageName);
        if (i >= 0) {
            log.info("Image {} successfully removed", imageName);
        } else {
            throw new NotFoundException("Image already deleted or does not exist" + imageName);
        }
    }


    public String updateBase64Image(String base64, String oldImageUrl) throws ValidationException, InternalServerException {
        if (base64 == null || base64.isEmpty()) {
            return oldImageUrl;
        }

        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            silentDelete(oldImageUrl);
        }

        return saveBase64Image(base64);
    }

    public String updateImage(MultipartFile file, String oldImageUrl) throws ValidationException, InternalServerException {
        if (file == null) {
            return oldImageUrl;
        }

        if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
            silentDelete(oldImageUrl);
        }
        return saveImage(file);
    }

    /**
     * @param imageUrl /api/images/a7466cb2-63fc-433f-8911-6ef6c72d2eae.jpg
     */
    public void silentDelete(final String imageUrl) {
        if (imageUrl == null || imageUrl.lastIndexOf('/') < 1) {
            log.warn("Invalid image link={}", imageUrl);
            return;
        }
        String imageName = getImageNameFromURL(imageUrl);
        try {
            remove(imageName);
        } catch (NotFoundException e) {
            log.error("Cannot delete image {}. Image already deleted or does not exist", imageName);
        }
    }

    public String getImageNameFromURL(String imageUrl) {
        return imageUrl.substring(imageUrl.lastIndexOf(SLASH) + 1);
    }


}
