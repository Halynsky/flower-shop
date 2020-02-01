package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.PasswordRestoreConfirmModel;
import ua.com.flowershop.model.RegistrationModel;
import ua.com.flowershop.model.SecurityUserModel;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.security.SecurityService;
import ua.com.flowershop.service.UserService;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.AUTH_PATH;

@RestController
@RequestMapping(AUTH_PATH)
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;
    @Autowired private SecurityService securityService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegistrationModel user){
        userService.register(user);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/activate")
    public ResponseEntity<SecurityUserModel> activate(@RequestBody String secretKey){
        User user = userService.activate(secretKey);
        SecurityUserModel securityUserModel = securityService.performUserLogin(user);
        return new ResponseEntity<>(securityUserModel, OK);
    }

    @PostMapping("/password/restore/request")
    public ResponseEntity<Void> passwordRestoreRequest(@RequestBody String email){
        userService.passwordRestoreRequest(email);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/password/restore/confirm")
    public ResponseEntity<SecurityUserModel> passwordRestoreConfirm(@RequestBody PasswordRestoreConfirmModel passwordRestoreConfirmModel){
        User user = userService.passwordRestoreConfirm(passwordRestoreConfirmModel);
        SecurityUserModel securityUserModel = securityService.performUserLogin(user);
        return new ResponseEntity<>(securityUserModel, OK);
    }

}
