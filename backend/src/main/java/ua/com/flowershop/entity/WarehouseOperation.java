package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "warehouse_operations")
public class WarehouseOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Integer amount;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime date = LocalDateTime.now();
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;
    @Column(columnDefinition = "varchar(2000)")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "flower_size_id", nullable = false)
    private FlowerSize flowerSize;

    @ManyToOne
    @JoinColumn(name = "warehouse_operation_type_id", nullable = false)
    private WarehouseOperationType warehouseOperationType;

}
