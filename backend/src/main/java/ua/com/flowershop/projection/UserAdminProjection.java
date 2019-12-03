package ua.com.flowershop.projection;

import ua.com.flowershop.entity.User;

public interface UserAdminProjection {
    Long getId();
    String getEmail();
    User.Role getRole();
    String getName();
    Boolean getIsVirtual();
    Boolean getIsEnabled();
}
