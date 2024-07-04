package ua.com.flowershop.projection;

public interface FlowerProjection {
    Long getId();
    String getName();
    String getImage();
    String getNameOriginal();
    String getDescription();
    GroupProjection getGroup();
    Integer getFlowerHeightMin();
    Integer getFlowerHeightMax();
    Integer getFlowerSizeMin();
    Integer getFlowerSizeMax();
    Integer getPopularity();
    Boolean getIsNew();
    Boolean getIsPopular();
    String getTag();
    String getSeasonName();
    FlowerTypeShortProjection getFlowerType();
}
