package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static ua.com.flowershop.entity.Order.Status.NEW;

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
    private Status status = NEW;
    @Column(columnDefinition = "varchar(500)")
    private String comment;
    @Column(columnDefinition = "varchar(2000)")
    private String note;
    @Column(columnDefinition = "varchar(32)")
    private String postDeclaration;
    @Column(columnDefinition = "varchar(500)")
    private String deliveryAddress;
    private Boolean isPaid = false;
    private String phone;
    private Integer totalPrice;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "order")
    private Set<OrderItem> orderItems;

    @AllArgsConstructor
    public enum Status {
        NEW("NEW"),
        PROCESSING("PROCESSING"),
        DELIVERING("DELIVERING"),
        RETURNED("RETURNED"),
        CANCELED("CANCELED"),
        DONE("DONE");

        private final String value;

        @Override
        public String toString() {
            return this.value;
        }

        public static List<Status> getClosed() {
            return Arrays.asList(RETURNED, CANCELED, DONE);
        }

        public static List<Status> getEditable() {
            return Arrays.asList(NEW, PROCESSING);
        }

    }

    @AllArgsConstructor
    public enum DeliveryType {
        NOVA_POSHTA_DEPARTMENT("NOVA_POSHTA_DEPARTMENT"),
        NOVA_POSHTA_COURIER("NOVA_POSHTA_COURIER"),
        UKR_POSHTA_DEPARTMENT("UKR_POSHTA_DEPARTMENT"),
        SELF_UZHGOROD("SELF_UZHGOROD");

        private final String value;

        @Override
        public String toString() {
            return this.value;
        }

    }
}
