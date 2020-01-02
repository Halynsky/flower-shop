package ua.com.flowershop.projection;

import ua.com.flowershop.entity.User;

import java.time.LocalDateTime;

public interface UserAdminProjection {
    Long getId();
    String getName();
    String getEmail();
    String getPhone();
    User.Role getRole();
    Boolean getIsVirtual();
    Boolean getIsEnabled();
    Boolean getIsActivated();
    LocalDateTime getCreated();
    LocalDateTime getLastOrderDate();
    String getNote();
    String getFacebookNickname();
}
