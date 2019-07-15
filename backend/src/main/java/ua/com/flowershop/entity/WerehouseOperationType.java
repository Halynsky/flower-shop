package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "werehouse_operation_types")
public class WerehouseOperationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Direction direction;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType operationType;

    @OneToMany(mappedBy = "werehouseOperationType")
    Set<WerehouseOperation> werehouseOperations;

    @AllArgsConstructor
    public enum Direction {
        IN("IN"),
        OUT("OUT");

        private final String value;

        @Override
        public String toString() {
            return this.value;
        }

    }

    @AllArgsConstructor
    public enum OperationType {
        GOODS_ARRIVAL("GOODS_ARRIVAL"),
        EXTERNAL_SALE("EXTERNAL_SALE"),
        GIFT("GIFT"),
        DEFECT("DEFECT");

        private final String value;

        @Override
        public String toString() {
            return this.value;
        }

    }

}
