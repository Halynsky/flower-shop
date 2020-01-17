package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.PasswordRestoreConfirmModel;
import ua.com.flowershop.model.UserAdminModel;
import ua.com.flowershop.model.UserModel;
import ua.com.flowershop.model.socials.SocialUser;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.repository.SocialConnectionRepository;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.util.mail.MailService;

import static java.util.Objects.nonNull;

@Slf4j
@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private MailService mailService;
    @Autowired private SocialConnectionRepository socialConnectionRepository;
    @Autowired private OrderRepository orderRepository;

    public void update(Long id, UserAdminModel userModel) {
        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        user.setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsEnabled(userModel.getIsEnabled())
            .setNote(userModel.getNote())
            .setFacebookNickname(userModel.getFacebookNickname());

        userRepository.save(user);
    }

    public void createVirtual(UserAdminModel userModel) {

        User existed = userRepository.findByEmail(userModel.getEmail()).orElse(null);

        if (nonNull(existed)) {
            throw new ConflictException("Користувач з вказаним емелом вже існує");
        }

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
            .orElseThrow(NotFoundException::new);
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
        User existed = userRepository.findByEmail(socialUser.getEmail()).orElse(null);

        if (nonNull(existed)) {
            throw new ConflictException("Користувач з вказаним емелом вже існує");
        }

        User user = User.of(socialUser);
        user.setIsVirtual(false);
        userRepository.save(user);
        SocialConnection socialConnection = new SocialConnection(socialUser, user);
        user.addSocialConnection(socialConnection);
        socialConnectionRepository.save(socialConnection);
        return user;
    }


    public void activate(String secretKey) {
        User user = userRepository.findBySecretKeyAndIsActivated(secretKey, false)
            .orElseThrow(NotFoundException::new);

        userRepository.save(user.setSecretKey(null)
            .setIsActivated(true));

    }

    public void passwordRestoreRequest(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if(nonNull(user)) {
            mailService.sendPasswordRestore(user);
        }
    }

    public void passwordRestoreConfirm(PasswordRestoreConfirmModel passwordRestoreConfirmModel) {
        User user = userRepository.findBySecretKey(passwordRestoreConfirmModel.getSecretKey())
            .orElseThrow(NotFoundException::new);
        user.setPassword(passwordEncoder.encode(passwordRestoreConfirmModel.getPassword()));
        userRepository.save(user);
    }

    public void merge(Long id, long otherId) {
        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        User otherUser = userRepository.findById(otherId)
            .orElseThrow(NotFoundException::new);

        if (user.getIsVirtual() && !otherUser.getIsVirtual()) {
            throw new ConflictException("Ви намагаетесь приеднати реального користувача до віртуального");
        }

        otherUser.getOrders().forEach(order -> {
            order.setUser(user);
            orderRepository.save(order);
        });

        userRepository.delete(otherUser);

    }

    public void changeNote(Long userId, String note) {
        User user = userRepository.findById(userId).orElseThrow(NotFoundException::new);
        user.setNote(note);
        userRepository.save(user);
    }

}
