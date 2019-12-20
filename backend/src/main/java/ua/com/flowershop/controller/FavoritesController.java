package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.projection.FlowerShortProjection;
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
    @GetMapping("/flowers/ids")
    public ResponseEntity<List<Long>> getFavoriteFlowersIds(){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.getFavoriteFlowersIds(user), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/flowers")
    public ResponseEntity<List<FlowerShortProjection>> getFavoriteFlowers(){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.getFavoriteFlowers(user), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/flowers/{id}")
    public ResponseEntity<List<Long>> addFavoriteFlower(@PathVariable Long id){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.addFavoriteFlower(user, id), OK);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/flowers/{id}")
    public ResponseEntity<List<Long>> removeFavoriteFlower(@PathVariable Long id){
        User user = securityService.getUser();
        return new ResponseEntity<>(favoritesService.removeFavoriteFlower(user, id), OK);
    }

}
