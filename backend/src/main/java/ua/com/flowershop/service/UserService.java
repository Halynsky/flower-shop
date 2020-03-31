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
import ua.com.flowershop.model.RegistrationModel;
import ua.com.flowershop.model.UserAdminModel;
import ua.com.flowershop.model.socials.SocialUser;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.repository.SocialConnectionRepository;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.util.mail.MailService;

import java.util.UUID;

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
            .setNote(userModel.getNote());

        userRepository.save(user);
    }

    public void createVirtual(UserAdminModel userModel) {

        User existed = userRepository.findByEmail(userModel.getEmail()).orElse(null);

        if (nonNull(existed)) {
            throw new ConflictException("Користувач з вказаним емелом вже існує");
        }

        User user = new User()
            .setName(userModel.getName())
            .setEmail(userModel.getEmail())
            .setPhone(userModel.getPhone())
            .setIsVirtual(true)
            .setIsEnabled(true)
            .setIsActivated(true);

        userRepository.save(user);
        mailService.sendPasswordRestore(user);
    }

    public void updateDisabled(Long id, Boolean disabled) {
        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);
        user.setIsEnabled(!disabled);
        userRepository.save(user);
    }

    public void register(RegistrationModel registrationModel) {
        User user = userRepository.save(new User()
            .setName(registrationModel.getName())
            .setEmail(registrationModel.getEmail())
            .setPhone(registrationModel.getPhone())
            .setRole(User.Role.USER)
            .setPassword(passwordEncoder.encode(registrationModel.getPassword())));
        mailService.sendRegistrationConfirmEmail(user);
    }

    @Transactional
    public User registerBySocial(SocialUser socialUser, Boolean emailVerificationRequired) {
        User existed = userRepository.findByEmail(socialUser.getEmail()).orElse(null);

        if (nonNull(existed)) {
            throw new ConflictException("Користувач з вказаним емелом вже існує");
        }

        User user = User.of(socialUser);
        user.setIsVirtual(false);
        if (emailVerificationRequired) {
            user.setIsActivated(false);
        }
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        userRepository.save(user);
        SocialConnection socialConnection = new SocialConnection(socialUser, user);
        user.addSocialConnection(socialConnection);
        socialConnectionRepository.save(socialConnection);
        return user;
    }

    public void resendActivationRequest(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(NotFoundException::new);
        if (user.getIsActivated()) {
            throw new ConflictException("Користувач уже активований");
        }
        mailService.sendRegistrationConfirmEmail(user);
    }

    public User activate(String secretKey) {
        User user = userRepository.findBySecretKeyAndIsActivated(secretKey, false).orElseThrow(NotFoundException::new);
        return activate(user);
    }

    public User activate(Long id) {
        User user = userRepository.findByIdAndIsActivated(id, false).orElseThrow(NotFoundException::new);
        return activate(user);
    }

    public User activate(User user) {
        userRepository.save(user.setSecretKey(null)
            .setIsActivated(true));
        return user;
    }

    public void passwordRestoreRequest(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        passwordRestoreRequest(user);
    }

    public void passwordRestoreRequest(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        passwordRestoreRequest(user);
    }

    public void passwordRestoreRequest(User user) {
        if(nonNull(user)) {
            user.setSecretKey(UUID.randomUUID().toString());
            userRepository.save(user);
            mailService.sendPasswordRestore(user);
        }
    }

    public User passwordRestoreConfirm(PasswordRestoreConfirmModel passwordRestoreConfirmModel) {
        User user = userRepository.findBySecretKey(passwordRestoreConfirmModel.getSecretKey())
            .orElseThrow(NotFoundException::new);
        user.setPassword(passwordEncoder.encode(passwordRestoreConfirmModel.getPassword()))
            .setSecretKey(null)
            .setIsActivated(true)
            .setIsVirtual(false);
        userRepository.save(user);
        return user;
    }

    @Transactional
    public void merge(Long id, long otherId) {
        User user = userRepository.findById(id)
            .orElseThrow(NotFoundException::new);

        User otherUser = userRepository.findById(otherId)
            .orElseThrow(NotFoundException::new);

        if (user.getRole().equals(User.Role.ADMIN) || user.getRole().equals(User.Role.SUPPORT)
        || otherUser.getRole().equals(User.Role.ADMIN) || otherUser.getRole().equals(User.Role.SUPPORT)) {
            throw new ConflictException("Обєднання системних користувачів заборонене");
        }

        if (user.getIsVirtual() && !otherUser.getIsVirtual()) {
            throw new ConflictException("Приєднання реального користувача до віртуального заборонено");
        }

        if (!user.getIsVirtual() && !otherUser.getIsVirtual()) {
            throw new ConflictException("Обєднання двох реальних користувачів заборонено");
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
