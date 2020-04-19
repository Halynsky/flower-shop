package ua.com.flowershop.model.socials;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import ua.com.flowershop.entity.SocialConnection;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import static ua.com.flowershop.util.ErrorMessages.EMAIL_REQUIRED_VALIDATION_ERROR_MESSAGE;
import static ua.com.flowershop.util.ErrorMessages.EMAIL_VALIDATION_ERROR_MESSAGE;

@RequiredArgsConstructor
@Getter
@Setter
public class SocialUser {
    private final String id;
    private String email;
    private final String firstName;
    private final String lastName;
    private final String picture;
    private final SocialConnection.Provider provider;

    public SocialUser(FacebookUserProfile userProfile) {
        this.id = userProfile.getId();
        this.email = userProfile.getEmail();
        this.firstName = userProfile.getFirst_name();
        this.lastName = userProfile.getLast_name();
        this.picture = userProfile.getPicture().getData().getUrl();
        this.provider = SocialConnection.Provider.FACEBOOK;
    }

}
