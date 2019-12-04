package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.repository.UserRepository;

import javax.persistence.EntityNotFoundException;

@Slf4j
@Service
public class UsersService {

    @Autowired private UserRepository userRepository;

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
        User user = new User();
        user.setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsVirtual(true)
            .setIsEnabled(userModel.getIsEnabled())
            .setIsActivated(true);
        userRepository.save(user);
    }

    public void updateDisabled(Long id, Boolean disabled) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);
        user.setIsEnabled(!disabled);
        userRepository.save(user);
    }
}
