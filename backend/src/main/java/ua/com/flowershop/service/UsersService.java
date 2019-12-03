package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.repository.UserRepository;

@Slf4j
@Service
public class UsersService {

    @Autowired private UserRepository userRepository;

}
