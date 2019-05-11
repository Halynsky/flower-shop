package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.Set;

public interface FlowerFullProjection extends FlowerProjection {

    FlowerTypeWithSizesProjection getFlowerType();

}
