package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.model.PasswordRestoreConfirmModel;
import ua.com.flowershop.model.RegistrationModel;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.service.UserService;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.AUTH_PATH;

@RestController
@RequestMapping(AUTH_PATH)
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegistrationModel user){
        userService.register(user);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/activate")
    public ResponseEntity<Void> activate(@RequestBody String secretKey){
        userService.activate(secretKey);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/password/restore/request")
    public ResponseEntity<Void> passwordRestoreRequest(@RequestBody String email){
        userService.passwordRestoreRequest(email);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/password/restore/confirm")
    public ResponseEntity<Void> passwordRestoreConfirm(@RequestBody PasswordRestoreConfirmModel passwordRestoreConfirmModel){
        userService.passwordRestoreConfirm(passwordRestoreConfirmModel);
        return new ResponseEntity<>(OK);
    }

}
