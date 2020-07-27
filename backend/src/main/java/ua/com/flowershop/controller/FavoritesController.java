package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.projection.FlowerSizeFullProjectionWithAvailable;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.FavoritesService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/favorites")
public class FavoritesController {

    @Autowired private FavoritesService favoritesService;
    @Autowired private SecurityService securityService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/items/ids")
    public ResponseEntity<List<Long>> getFavoriteItemsIds(){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.getFavoriteItemsIds(user), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/items")
    public ResponseEntity<List<FlowerSizeFullProjectionWithAvailable>> getFavoriteItems(){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.getFavoriteItems(user), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/items/{id}")
    public ResponseEntity<List<Long>> addFavoriteItem(@PathVariable Long id){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.addFavoriteItem(user, id), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/items/{id}")
    public ResponseEntity<List<Long>> removeFavoriteItem(@PathVariable Long id){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.removeFavoriteItem(user, id), OK);
    }

}
