package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.BucketItem;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.BucketItemModel;
import ua.com.flowershop.projection.BucketItemProjection;
import ua.com.flowershop.repository.BucketItemRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BucketService {

    @Autowired private BucketItemRepository bucketItemRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    @Transactional
    public void post(User user, List<BucketItemModel> bucket) {
        bucketItemRepository.deleteByUserEmail(user.getEmail());

        List<BucketItem> bucketItems = bucket.stream().map(bip -> {
            FlowerSize flowerSize = flowerSizeRepository.findById(bip.getFlowerSizeId())
                .orElseThrow(() -> new NotFoundException("Тип квітки не знайдено"));
            return new BucketItem()
                .setAmount(bip.getAmount())
                .setUser(user)
                .setFlowerSize(flowerSize);
        }).collect(Collectors.toList());

        bucketItemRepository.saveAll(bucketItems);

    }

    public List<BucketItemProjection> getBucket(User user) {
        return bucketItemRepository.findProjectedByUserEmail(user.getEmail());
    }

}
