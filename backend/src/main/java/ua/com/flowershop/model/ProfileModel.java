package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.User;

import javax.validation.constraints.Size;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class ProfileModel {
    private Long id;
    private String email;
    private String name;
    @Size(min = 10, max = 10)
    private String phone;

    public static ProfileModel of(User user) {
        return new ProfileModel().setId(user.getId())
            .setEmail(user.getEmail())
            .setPhone(user.getPhone())
            .setName(user.getName());
    }
}
