package ua.com.flowershop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.AuthenticationRequiredException;
import ua.com.flowershop.exception.ThirdPartyException;
import ua.com.flowershop.model.socials.FacebookUserProfile;
import ua.com.flowershop.model.socials.SocialUser;
import ua.com.flowershop.model.socials.SocialUserInfo;

import javax.annotation.PostConstruct;
import javax.validation.ValidationException;
import java.io.IOException;
import java.net.URISyntaxException;

@Slf4j
@Service
public class FacebookSocialService {

    @Autowired private SocialConnectionService socialConnectionService;
    @Autowired private ObjectMapper objectMapper;

    private final String FB_API_VERSION = "v3.1";

    private HttpClient client;

    @PostConstruct
    public void init() {
        client = HttpClientBuilder
            .create()
            .build();
    }

    public User loginOrRegister(SocialUserInfo socialUserInfo) {
        SocialUser socialUser = getSocialUser(socialUserInfo);
        return socialConnectionService.findExistingOrRegister(socialUser);
    }

    public void connect(User user, String accessToken) {
        SocialUser socialUser = getSocialUser(accessToken);
        socialConnectionService.connect(socialUser, user);
    }

    private FacebookUserProfile getFacebookUserProfile(String accessToken) throws ThirdPartyException {
        FacebookUserProfile facebookUserProfile;
        try {
            URIBuilder uriBuilder = new URIBuilder("https://graph.facebook.com/" + FB_API_VERSION + "/me");
            uriBuilder.setParameter("access_token", accessToken);
            uriBuilder.setParameter("fields", "name,email,last_name,first_name,picture");
            facebookUserProfile = getDataFromFacebookApi(uriBuilder);
        } catch (URISyntaxException | IOException e) {
            String message = e.getMessage();
            log.error(message, e);
            throw new ThirdPartyException(message);
        }

        return facebookUserProfile;
    }

    private FacebookUserProfile getDataFromFacebookApi(URIBuilder uriBuilder) throws ThirdPartyException, URISyntaxException, IOException {
        HttpUriRequest request = RequestBuilder.get()
            .setUri(uriBuilder.build())
            .build();

        HttpResponse response;
        try {
            response = client.execute(request);
        } catch (IOException e) {
            String message = "Помилка при спробі доступу до Facebook API. " + e.getMessage();
            log.error(message, e);
            throw new ThirdPartyException(message);
        }

        int statusCode;
        statusCode = response.getStatusLine().getStatusCode();
        String result = EntityUtils.toString(response.getEntity());

        FacebookUserProfile userProfile = objectMapper.readValue(result, FacebookUserProfile.class);

        if (statusCode != 200) {
            String message = "Помилка при спробі доступу до Facebook API з кодом помилки " + statusCode + ". " + response.getStatusLine().getReasonPhrase();
            log.error(message);
            throw new ThirdPartyException(message);
        }

        return userProfile;
    }

    private SocialUser getSocialUser(String accessToken) throws AuthenticationRequiredException {
        FacebookUserProfile userProfile;
        try {
            userProfile = getFacebookUserProfile(accessToken);
        } catch (ThirdPartyException e) {
            log.error("Не вдалося підключитись до Facebook API", e);
            throw new AuthenticationRequiredException("Не вдалося підключитись до Facebook API", e);
        }
        if (userProfile.getEmail() == null) {
            log.warn("Не вдалося зареєструвати користувача " + userProfile.getName() + " по причині відсутності email в Facebook профайлі");
            throw new ValidationException("Для реєстрації через Facebook у вашому аккаунті повинен бути вказаний email." +
                " Внесіть email на Facebook аккаунт та спробуйте ще раз або зареєструйтесь через стандартну форму.");
        }

        return new SocialUser(userProfile);
    }

    private SocialUser getSocialUser(SocialUserInfo socialUserInfo) throws AuthenticationRequiredException {
        FacebookUserProfile userProfile;
        try {
            userProfile = getFacebookUserProfile(socialUserInfo.getAccessToken());
            if (socialUserInfo.getEmail() != null)
                userProfile.setEmail(socialUserInfo.getEmail());
        } catch (ThirdPartyException e) {
            log.error("Не вдалося підключитись до Facebook API", e);
            throw new AuthenticationRequiredException("Не вдалося підключитись до Facebook API", e);
        }
        if (userProfile.getEmail() == null) {
            log.warn("Не вдалося зареєструвати користувача " + userProfile.getName() + " по причині відсутності email в Facebook профайлі");
            throw new ValidationException("Для реєстрації через Facebook у вашому аккаунті повинен бути вказаний email." +
                " Внесіть email на Facebook аккаунт та спробуйте ще раз або зареєструйтесь через стандартну форму.");
        }

        return new SocialUser(userProfile);
    }
}
