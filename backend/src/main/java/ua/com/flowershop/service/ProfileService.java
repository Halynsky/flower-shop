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
import ua.com.flowershop.util.mail.MailService;

import static java.util.Objects.nonNull;

@Slf4j
@Service
public class ProfileService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private MailService mailService;

    public void update(Long id, ProfileModel profileModel) {

        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        user.setName(profileModel.getName())
            .setPhone(profileModel.getPhone());

        if (!profileModel.getEmail().equals(user.getEmail())) {

            User existed = userRepository.findByEmail(profileModel.getEmail()).orElse(null);

            if (nonNull(existed)) {
                throw new ConflictException("Користувач з вказаним емелом вже існує");
            }

            user.generateSecretKey();
            user.setNewEmail(profileModel.getEmail());
            mailService.sendEmailChanged(user);
            mailService.sendEmailChangedNotice(user);

        }

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


    public void changeEmailConfirm(String secretKey) {
        User user = userRepository.findBySecretKey(secretKey)
            .orElseThrow(NotFoundException::new);

        User existed = userRepository.findByEmail(user.getNewEmail()).orElse(null);

        if (nonNull(existed)) {
            throw new ConflictException("Користувач з вказаним емелом вже існує");
        }

        userRepository.save(user.setSecretKey(null)
            .setEmail(user.getNewEmail())
            .setNewEmail(null));

    }
}
