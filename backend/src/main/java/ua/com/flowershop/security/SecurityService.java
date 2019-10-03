package ua.com.flowershop.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.repository.UserRepository;

@Service
public class SecurityService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public Authentication getAuthentication () {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getEmail() {
        return getAuthentication().getName();
    }

    public User getUser() {
        return userRepository.findByEmail(getEmail()).orElseThrow(() -> new RuntimeException("Current User not found in Database"));
    }

    public String generatePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

}
