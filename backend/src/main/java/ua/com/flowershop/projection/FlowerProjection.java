package ua.com.flowershop.projection;

public interface FlowerProjection {
    Long getId();
    String getName();
    String getImage();
    String getNameOriginal();
    String getDescription();
    String getGroupName();
    Integer getFlowerHeightMin();
    Integer getFlowerHeightMax();
    Integer getFlowerSizeMin();
    Integer getFlowerSizeMax();
    Integer getPopularity();
    Boolean getIsNew();
    Boolean getIsPopular();
    Boolean getHasDiscount();
    FlowerTypeTinyProjection getFlowerType();
}
