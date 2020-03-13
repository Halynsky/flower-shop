package ua.com.flowershop.model.socials;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserPhoneEmailTuple {

    private String phone;
    private String email;
    private String accessToken;

}
