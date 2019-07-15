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
@Table(name = "werehouse_operations")
public class WerehouseOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Integer amount;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "flower_size_id", nullable = false)
    private FlowerSize flowerSize;

    @ManyToOne
    @JoinColumn(name = "werehouse_operation_type_id", nullable = false)
    private WerehouseOperationType werehouseOperationType;

}
