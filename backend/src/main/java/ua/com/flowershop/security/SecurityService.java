package ua.com.flowershop.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.SecurityUserModel;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.repository.UserRepository;

import javax.servlet.http.HttpServletResponse;

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

    public SecurityUserModel performUserLogin(User user) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null,
        AuthorityUtils.createAuthorityList("USER"));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return SecurityUserModel.of(user);
    }

}
