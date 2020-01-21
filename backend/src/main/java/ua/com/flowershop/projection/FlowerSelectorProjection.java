package ua.com.flowershop.projection;

public interface FlowerSelectorProjection {
    Long getId();
    String getName();
    String getImage();
    String getNameOriginal();
    FlowerTypeTinyProjection getFlowerType();
}
