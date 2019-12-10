package ua.com.flowershop.projection;

public interface FlowerSizeFullProjection {
    Integer getPrice();

    Integer getAmount();

    Integer getReserved();

    Integer getSold();

    Integer getId();

    SizeProjection getSize();

    FlowerProjection getFlower();
}
