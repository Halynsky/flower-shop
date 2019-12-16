package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.PasswordUpdateModel;
import ua.com.flowershop.model.ProfileModel;
import ua.com.flowershop.model.UserAdminModel;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.projection.ProfileProjection;
import ua.com.flowershop.projection.UserAdminProjection;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.ProfileService;
import ua.com.flowershop.service.UserService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.PROFILE_PATH;
import static ua.com.flowershop.util.Path.USERS_PATH;

@RestController
@RequestMapping(PROFILE_PATH)
public class ProfileController {

    @Autowired private SecurityService securityService;
    @Autowired private UserRepository userRepository;
    @Autowired private ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileModel> getProfile() {
        return new ResponseEntity<>(ProfileModel.of(securityService.getUser()), OK);
    }

    @PutMapping
    public ResponseEntity<Void> updateProfile(@RequestBody ProfileModel profileModel) {
        profileService.update(securityService.getUser().getId(), profileModel);
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordUpdateModel passwordUpdateModel) {
        profileService.updatePassword(securityService.getUser(), passwordUpdateModel);
        return new ResponseEntity<>(OK);
    }

}
