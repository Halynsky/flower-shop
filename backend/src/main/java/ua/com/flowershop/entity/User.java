package ua.com.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

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
    @JsonIgnore
    private String password;
    @Column
    private String phone;
    @Column(columnDefinition = "boolean default false")
    private Boolean isVirtual = false;
    @Column(columnDefinition = "boolean default true")
    private Boolean isEnabled = true;
    @Column(columnDefinition = "boolean default false")
    private Boolean isActivated = false;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime created = LocalDateTime.now();
    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    private Set<Order> orders;

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

}
