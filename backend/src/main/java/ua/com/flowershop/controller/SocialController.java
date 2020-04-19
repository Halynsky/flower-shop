package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.SecurityUserModel;
import ua.com.flowershop.model.socials.SocialUserInfo;
import ua.com.flowershop.repository.SocialConnectionRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.FacebookSocialService;
import ua.com.flowershop.service.SocialConnectionService;
import ua.com.flowershop.util.mail.MailService;

import java.util.List;

import static ua.com.flowershop.util.Path.SOCIAL_PATH;


@RestController
@RequestMapping(SOCIAL_PATH)
public class SocialController {

    @Autowired private FacebookSocialService facebookSocialService;
    @Autowired private SecurityService securityService;
    @Autowired private SocialConnectionService socialConnectionService;
    @Autowired private SocialConnectionRepository socialConnectionRepository;
    @Autowired private MailService mailService;

    @PostMapping("/auth/facebook")
    public ResponseEntity<SecurityUserModel> loginWithFacebook(@RequestBody SocialUserInfo socialUserInfo) {
        User user = facebookSocialService.findUser(socialUserInfo);
        if (user == null)
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        SecurityUserModel securityUserModel = securityService.performUserLogin(user);
        return new ResponseEntity<>(securityUserModel, HttpStatus.OK);
    }

    @PostMapping("/register/facebook")
    public ResponseEntity<SecurityUserModel> registerWithFacebook(@RequestBody SocialUserInfo socialUserInfo) {
        User user = facebookSocialService.registerUser(socialUserInfo);
        SecurityUserModel securityUserModel = null;
        if (socialUserInfo.getEmail() != null) {
            mailService.sendRegistrationConfirmEmail(user);
        } else {
            securityUserModel = securityService.performUserLogin(user);
        }
        return new ResponseEntity<>(securityUserModel ,HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/facebook/disconnect")
    public ResponseEntity<Void> disconnectFacebook() {
        User user = securityService.getUser();
        socialConnectionService.disconnectSocial(user, SocialConnection.Provider.FACEBOOK);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/facebook/connect")
    public ResponseEntity<Void> connectFacebook(@RequestBody String accessToken) {
        User user = securityService.getUser();
        facebookSocialService.connect(user, accessToken);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping()
    public ResponseEntity<List<SocialConnection>> getConnections() {
        User user = securityService.getUser();
        List<SocialConnection> socialConnections = socialConnectionService.getSocialConnections(user);
        return new ResponseEntity<>(socialConnections, HttpStatus.OK);
    }

}

