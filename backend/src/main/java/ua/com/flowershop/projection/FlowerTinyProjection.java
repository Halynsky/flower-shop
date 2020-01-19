package ua.com.flowershop.projection;

public interface FlowerTinyProjection {
    Long getId();
    String getName();
    String getNameOriginal();
    String getImage();
    FlowerTypeTinyProjection getFlowerType();
}
