package ua.com.flowershop.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.AuthenticationRequiredException;
import ua.com.flowershop.model.SecurityUserModel;
import ua.com.flowershop.repository.UserRepository;

@Service
public class SecurityService {

    @Autowired private UserRepository userRepository;

    public Authentication getAuthentication () {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getCurrentUserEmail() {
        return getAuthentication().getName();
    }

    public User getUserOrNull() {
        return userRepository.findByEmail(getCurrentUserEmail()).orElse(null);
    }

    public User getUser() {
        return userRepository.findByEmail(getCurrentUserEmail()).orElseThrow(() -> new AuthenticationRequiredException("Current User not found in Database"));
    }

    public SecurityUserModel performUserLogin(User user) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null,
        AuthorityUtils.createAuthorityList("ROLE_" + user.getRole().toString()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        if (user.getIsVirtual()) {
            user.setIsVirtual(false);
            userRepository.save(user);
        }
        return SecurityUserModel.of(user);
    }

//    public static void main(String[] args) {
//        System.out.println(new BCryptPasswordEncoder().encode("password"));
//    }

}
