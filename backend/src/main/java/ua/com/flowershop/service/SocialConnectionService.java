package ua.com.flowershop.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.*;
import ua.com.flowershop.model.socials.SocialUser;
import ua.com.flowershop.repository.SocialConnectionRepository;
import ua.com.flowershop.repository.UserRepository;

import javax.validation.Valid;
import java.util.List;

@Service
@Validated
public class SocialConnectionService {

    @Autowired private UserRepository userRepository;
    @Autowired private SocialConnectionRepository socialConnectionRepository;
    @Autowired private UserService userService;

    public User findExistingUser(@Valid SocialUser socialUser) throws AuthenticationRequiredException {
        SocialConnection connection = socialConnectionRepository.findByProviderId(socialUser.getId());
        if (connection != null) {
            if (!connection.getUser().getIsEnabled()) {
                throw new AuthenticationRequiredException("Аккаунт заблокований");
            }
            if (!connection.getUser().getIsActivated()) {
                throw new AccountIsNotActivatedException();
            }
            return connection.getUser();
        } else {
            return null;
        }
    }

    public User registerUser(@Valid SocialUser socialUser, Boolean emailVerificationRequired) {
        User user = userRepository.findByEmail(socialUser.getEmail()).orElse(null);
        if (user != null) {
            return addSocialConnection(user, socialUser);
        } else {
            return userService.registerBySocial(socialUser, emailVerificationRequired);
        }
    }

    public void connect(@Valid SocialUser socialUser, User user) throws ConflictException {
        if (user.getSocialConnections().stream().anyMatch(connection -> connection.getProvider().equals(socialUser.getProvider()))) {
            throw new ConflictException("Ви вже приєднані до " + StringUtils.capitalize(socialUser.getProvider().toString()));
        }
        SocialConnection existedConnection = socialConnectionRepository.findByProviderId(socialUser.getId());
        if (existedConnection != null) {
            throw new ConflictException(StringUtils.capitalize(socialUser.getProvider().toString()) + " аккаунт уже приєднаний до іншого користувача");
        }
        SocialConnection socialConnection = new SocialConnection(socialUser, user);
        socialConnectionRepository.save(socialConnection);
    }

    public List<SocialConnection> getSocialConnections(User user) {

        return socialConnectionRepository.findAllByUser(user);
    }

    public void disconnectSocial(User user, SocialConnection.Provider provider) throws ConflictException {
        SocialConnection socialConnection = socialConnectionRepository.findByUserAndProvider(user, provider).orElseThrow(NotFoundException::new);
        socialConnectionRepository.delete(socialConnection);
    }

    private User addSocialConnection(User user, @Valid SocialUser socialUser) {
        if (!user.getIsEnabled()) {
            throw new AuthenticationRequiredException("Аккаунт заблокований");
        }
        SocialConnection socialConnection = new SocialConnection(socialUser, user);
        user.addSocialConnection(socialConnection);
        socialConnectionRepository.save(socialConnection);

        return user;
    }
}
