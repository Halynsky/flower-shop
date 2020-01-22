package ua.com.flowershop.projection;

public interface FlowerSizeFullProjectionWithAvailable {
    Long getId();
    Integer getPrice();
    Integer getPriceOld();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerProjection getFlower();
    Integer getAvailable();
}
