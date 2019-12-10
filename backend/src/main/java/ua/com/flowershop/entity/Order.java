package ua.com.flowershop.entity;

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
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime created = LocalDateTime.now();
    private LocalDateTime closed;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(32) default 'NEW'")
    private Status status = Status.NEW;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "order", cascade = CascadeType.PERSIST)
    private Set<OrderItem> orderItems;

    @AllArgsConstructor
    public enum Status {
        NEW("NEW"),
        PROCESSING("PROCESSING"),
        PAID("PAID"),
        SHIPPED("SHIPPED"),
        CANCELED("CANCELED"),
        RETURNING("RETURNING"),
        RETURNED("RETURNED");

        private final String value;

        @Override
        public String toString() {
            return this.value;
        }

    }

}
