package ua.com.flowershop.projection;

public interface GroupProjectionFull extends IdNameTupleProjection {
    String getNameOriginal();
    String getNameSingle();
    FlowerTypeTinyProjection getFlowerType();
}
