package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.repository.UserRepository;

import javax.persistence.EntityNotFoundException;

@Slf4j
@Service
public class UsersService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public void update(Long id, UserModel userModel) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        user.setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsEnabled(userModel.getIsEnabled());

        userRepository.save(user);
    }

    public void createVirtual(UserModel userModel) {
        userRepository.save(new User()
            .setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsVirtual(true)
            .setIsEnabled(userModel.getIsEnabled())
            .setIsActivated(true));
    }

    public void updateDisabled(Long id, Boolean disabled) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);
        user.setIsEnabled(!disabled);
        userRepository.save(user);
    }

    // TODO: Send activation email
    public void register(UserModel userModel) {
        userRepository.save(new User()
            .setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setRole(User.Role.USER)
            .setPassword(passwordEncoder.encode(userModel.getPassword())));
    }


}
