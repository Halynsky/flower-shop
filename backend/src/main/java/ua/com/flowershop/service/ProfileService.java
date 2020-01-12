package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.PasswordUpdateModel;
import ua.com.flowershop.model.ProfileModel;
import ua.com.flowershop.repository.UserRepository;

@Slf4j
@Service
public class ProfileService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public void update(Long id, ProfileModel profileModel) {
        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        user.setName(profileModel.getName())
            .setEmail(profileModel.getEmail())
            .setPhone(profileModel.getPhone());

        userRepository.save(user);
    }


    public void updatePassword(User user, PasswordUpdateModel passwordUpdateModel) {
        if (!passwordEncoder.matches(passwordUpdateModel.getPassword(), user.getPassword())) {
            throw new ConflictException("Вказаний пароль не вірний");
        } else {
            user.setPassword(passwordEncoder.encode(passwordUpdateModel.getPasswordNew()));
            userRepository.save(user);
        }
    }


}
