package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.model.UserAdminModel;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.model.socials.SocialUser;
import ua.com.flowershop.repository.SocialConnectionRepository;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.util.mail.MailService;

import javax.persistence.EntityNotFoundException;

@Slf4j
@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private MailService mailService;
    @Autowired private SocialConnectionRepository socialConnectionRepository;

    public void update(Long id, UserAdminModel userModel) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        user.setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsEnabled(userModel.getIsEnabled())
            .setNote(userModel.getNote());

        userRepository.save(user);
    }

    public void createVirtual(UserAdminModel userModel) {
        userRepository.save(new User()
            .setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsVirtual(true)
            .setIsEnabled(userModel.getIsEnabled())
            .setIsActivated(true))
            .setNote(userModel.getNote());
    }

    public void updateDisabled(Long id, Boolean disabled) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);
        user.setIsEnabled(!disabled);
        userRepository.save(user);
    }

    public void register(UserModel userModel) {
        User user = userRepository.save(new User()
            .setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setRole(User.Role.USER)
            .setPassword(passwordEncoder.encode(userModel.getPassword())));
        mailService.sendRegistrationConfirmEmail(user);
    }

    @Transactional
    public User registerBySocial(SocialUser socialUser) {
        User user = User.of(socialUser);
        userRepository.save(user);
        SocialConnection socialConnection = new SocialConnection(socialUser, user);
        user.addSocialConnection(socialConnection);
        socialConnectionRepository.save(socialConnection);
        return user;
    }


    public void activate(String secretKey) {
        User user = userRepository.findBySecretKeyAndIsActivated(secretKey, false)
            .orElseThrow(EntityNotFoundException::new);

        userRepository.save(user.setSecretKey(null)
            .setIsActivated(true));

    }
}
