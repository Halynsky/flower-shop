package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.User;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminModel extends UserModel {

    private String note;

    public UserAdminModel(Long id, String email, String password, String name, String phone, Boolean isEnabled, User.Role role, String facebookNickname) {
        super(id, email, password, name, phone, isEnabled, role, facebookNickname);
    }

    public static UserAdminModel of(User user) {
        UserAdminModel userAdminModel =
            new UserAdminModel(user.getId(), user.getEmail(), null, user.getName(), user.getPhone(), user.getIsEnabled(), user.getRole(),
                user.getFacebookNickname());
        userAdminModel.setNote(user.getNote());
        return userAdminModel;
    }

}
