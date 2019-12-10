package ua.com.flowershop.model.socials;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhoneSocialCredentials {
    private String accessToken;
    private String phone;
    private String referralCode;
}
