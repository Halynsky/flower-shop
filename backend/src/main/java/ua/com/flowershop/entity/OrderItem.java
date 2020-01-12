package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int amount;
    private int price;

    @OneToOne
    @JoinColumn(name = "warehouse_operation_id")
    private WarehouseOperation warehouseOperation;

    @ManyToOne
    @JoinColumn(name = "flower_size_id")
    private FlowerSize flowerSize;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}
