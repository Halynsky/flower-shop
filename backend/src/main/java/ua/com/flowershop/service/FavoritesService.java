package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FavoriteFlowersList;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.InternalServerException;
import ua.com.flowershop.repository.FavoriteFlowersListRepository;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FavoritesService {

    private static final String DEFAULT_LIST_NAME = "Основний список";

    @Autowired private FavoriteFlowersListRepository favoriteFlowersListRepository;

    public List<Long> getFavoriteFlowers(User user) {
        List<FavoriteFlowersList> favoriteFlowersList = favoriteFlowersListRepository.findByUserId(user.getId());
        List<Long> favoriteFlowersIds = favoriteFlowersList.stream()
            .map(ffl -> ffl.getFlowerIds())
            .flatMap(flowerIds -> Arrays.stream(flowerIds))
            .collect(Collectors.toList());
        return favoriteFlowersIds;
    }

    public List<Long> addFavoriteFlower(User user, Long id) {
        FavoriteFlowersList favoriteFlowersList = favoriteFlowersListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElse(new FavoriteFlowersList()
                .setDefault(true)
                .setUser(user)
                .setName(DEFAULT_LIST_NAME));

        Set<Long> ids = new HashSet<>(Arrays.asList(favoriteFlowersList.getFlowerIds()));
        ids.add(id);
        Long[] array = new Long[ids.size()];
        favoriteFlowersList.setFlowerIds(ids.toArray(array));
        favoriteFlowersListRepository.save(favoriteFlowersList);
        return getFavoriteFlowers(user);
    }

    public List<Long> removeFavoriteFlower(User user, Long id) {
        FavoriteFlowersList favoriteFlowersList = favoriteFlowersListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElseThrow(() -> new InternalServerException("Основний список бажань не знайдено"));

        Set<Long> ids = new HashSet<>(Arrays.asList(favoriteFlowersList.getFlowerIds()));
        ids.remove(id);
        Long[] array = new Long[ids.size()];
        favoriteFlowersList.setFlowerIds(ids.toArray(array));
        favoriteFlowersListRepository.save(favoriteFlowersList);
        return getFavoriteFlowers(user);
    }

}
