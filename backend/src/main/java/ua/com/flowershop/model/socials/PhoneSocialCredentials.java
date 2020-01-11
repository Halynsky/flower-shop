package ua.com.flowershop.model.socials;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
public class PhoneSocialCredentials {
    private String accessToken;
    @Size(min = 10, max = 10)
    private String phone;
    private String referralCode;
}
