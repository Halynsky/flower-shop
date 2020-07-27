package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FavoriteItemsList;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.InternalServerException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.FlowerSizeFullProjectionWithAvailable;
import ua.com.flowershop.repository.FavoriteItemsListRepository;
import ua.com.flowershop.repository.FlowerRepository;
import ua.com.flowershop.repository.FlowerSizeRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FavoritesService {

    private static final String DEFAULT_LIST_NAME = "Основний список";

    @Autowired private FavoriteItemsListRepository favoriteItemsListRepository;
    @Autowired private FlowerRepository flowerRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public List<FlowerSizeFullProjectionWithAvailable> getFavoriteItems(User user) {
        return flowerSizeRepository.findFavorites(user.getId());
    }

    public List<Long> getFavoriteItemsIds(User user) {
        List<FavoriteItemsList> favoriteItemsList = favoriteItemsListRepository.findByUserId(user.getId());
        return favoriteItemsList.stream().map(FavoriteItemsList::getFlowerSizes)
            .flatMap(Collection::stream)
            .map(FlowerSize::getId)
            .collect(Collectors.toList());
    }

    public List<Long> addFavoriteItem(User user, Long id) {
        FavoriteItemsList favoriteItemsList = favoriteItemsListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElse(new FavoriteItemsList()
                .setDefault(true)
                .setUser(user)
                .setName(DEFAULT_LIST_NAME));

        FlowerSize flowerSize = flowerSizeRepository.findById(id).orElseThrow(NotFoundException::new);
        favoriteItemsList.getFlowerSizes().add(flowerSize);
        favoriteItemsListRepository.save(favoriteItemsList);
        return getFavoriteItemsIds(user);
    }

    public List<Long> removeFavoriteItem(User user, Long id) {
        FavoriteItemsList favoriteItemsList = favoriteItemsListRepository.findByUserIdAndIsDefaultTrue(user.getId())
            .orElseThrow(() -> new InternalServerException("Основний список бажань не знайдено"));

        FlowerSize flowerSize = favoriteItemsList.getFlowerSizes().stream()
            .filter(f -> f.getId().equals(id)).
            findFirst().orElseThrow(NotFoundException::new);

        favoriteItemsList.getFlowerSizes().remove(flowerSize);
        favoriteItemsListRepository.save(favoriteItemsList);
        return getFavoriteItemsIds(user);
    }

}
