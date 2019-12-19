package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FavoriteFlowersList;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.InternalServerException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.repository.FavoriteFlowersListRepository;
import ua.com.flowershop.repository.FlowerRepository;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FavoritesService {

    private static final String DEFAULT_LIST_NAME = "Основний список";

    @Autowired private FavoriteFlowersListRepository favoriteFlowersListRepository;
    @Autowired private FlowerRepository flowerRepository;

    public List<Long> getFavoriteFlowers(User user) {
        List<FavoriteFlowersList> favoriteFlowersList = favoriteFlowersListRepository.findByUserId(user.getId());
        return favoriteFlowersList.stream().map(FavoriteFlowersList::getFlowers)
            .flatMap(Collection::stream)
            .map(Flower::getId)
            .collect(Collectors.toList());
    }

    public List<Long> getFavoriteFlowersIds(User user) {
        List<FavoriteFlowersList> favoriteFlowersList = favoriteFlowersListRepository.findByUserId(user.getId());
        return favoriteFlowersList.stream().map(FavoriteFlowersList::getFlowers)
            .flatMap(Collection::stream)
            .map(Flower::getId)
            .collect(Collectors.toList());
    }

    public List<Long> addFavoriteFlower(User user, Long id) {
        FavoriteFlowersList favoriteFlowersList = favoriteFlowersListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElse(new FavoriteFlowersList()
                .setDefault(true)
                .setUser(user)
                .setName(DEFAULT_LIST_NAME));

        Flower flower = flowerRepository.findById(id).orElseThrow(NotFoundException::new);
        favoriteFlowersList.getFlowers().add(flower);
        favoriteFlowersListRepository.save(favoriteFlowersList);
        return getFavoriteFlowersIds(user);
    }

    public List<Long> removeFavoriteFlower(User user, Long id) {
        FavoriteFlowersList favoriteFlowersList = favoriteFlowersListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElseThrow(() -> new InternalServerException("Основний список бажань не знайдено"));

        Flower flower = favoriteFlowersList.getFlowers().stream()
            .filter(f -> f.getId().equals(id)).
            findFirst().orElseThrow(NotFoundException::new);

        favoriteFlowersList.getFlowers().remove(flower);
        favoriteFlowersListRepository.save(favoriteFlowersList);
        return getFavoriteFlowersIds(user);
    }

}
