package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.service.UsersService;

import static org.springframework.http.HttpStatus.OK;
import static ua.com.flowershop.util.Path.AUTH_PATH;

@RestController
@RequestMapping(AUTH_PATH)
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private UsersService usersService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserModel user){
        usersService.register(user);
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/activate")
    public ResponseEntity<Void> register(@RequestParam String secretKey){
        usersService.activate(secretKey);
        return new ResponseEntity<>(OK);
    }

}
