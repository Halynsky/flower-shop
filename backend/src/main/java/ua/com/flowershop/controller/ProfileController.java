package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.PasswordUpdateModel;
import ua.com.flowershop.model.ProfileModel;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.ProfileService;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.PROFILE_PATH;

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

    @PostMapping("/email/change/confirm")
    public ResponseEntity<Void> emailChangeConfirm(@RequestBody String secretKey){
        profileService.changeEmailConfirm(secretKey);
        return new ResponseEntity<>(OK);
    }

}
