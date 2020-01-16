package ua.com.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.socials.SocialUser;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true)
    private String email;
    private String newEmail;
    @Column(columnDefinition = "varchar(64)")
    private String facebookNickname;
    @JsonIgnore
    private String password;
    private String phone;
    private String icon;
    @Column(columnDefinition = "boolean default false")
    private Boolean isVirtual = false;
    @Column(columnDefinition = "boolean default true")
    private Boolean isEnabled = true;
    @Column(columnDefinition = "boolean default false")
    private Boolean isActivated = false;
    private String secretKey = UUID.randomUUID().toString();
    @Column(columnDefinition = "varchar(2000)")
    private String note;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime created = LocalDateTime.now();
    private LocalDateTime lastOrderDate;
    @OneToMany(mappedBy = "user")
    private List<Order> orders;
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    protected List<SocialConnection> socialConnections;
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    protected List<FavoriteFlowersList> favoriteFlowersLists;

    public enum Role {
        USER("USER"),
        ADMIN("ADMIN"),
        SUPPORT("SUPPORT");

        private final String value;

        Role(String value) {
            this.value = value;
        }

        public boolean equalsValue(String value) {
            return this.value.equals(value);
        }

        @Override
        public String toString() {
            return this.value;
        }
    }

    public static User of(SocialUser socialUser) {
        return new User().setEmail(socialUser.getEmail())
            .setName(socialUser.getFirstName() + " " + socialUser.getLastName())
            .setRole(Role.USER)
            .setIsActivated(true);
    }

    public User addSocialConnection(SocialConnection socialConnection) {
        if (getSocialConnections() == null) {
            this.socialConnections = new ArrayList<>();
            this.socialConnections.add(socialConnection);
        } else {
            this.socialConnections.add(socialConnection);
        }
        return this;
    }

    public void generateSecretKey() {
        this.setSecretKey(UUID.randomUUID().toString());
    }

}
