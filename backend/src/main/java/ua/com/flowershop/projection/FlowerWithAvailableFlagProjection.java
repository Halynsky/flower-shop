package ua.com.flowershop.projection;

public interface FlowerWithAvailableFlagProjection extends FlowerTinyProjection {
    Integer getPriceMin();
    Boolean  getHasAvailableFlowerSize();
    Boolean getIsNew();
    Boolean getIsPopular();
    String getGroupName();
}
