package ua.com.flowershop.projection;

public interface FlowerTinyProjection {
    Long getId();
    String getName();
    String getImage();
    FlowerTypeTinyProjection getFlowerType();
}
