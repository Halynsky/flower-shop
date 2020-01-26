package ua.com.flowershop.projection;

public interface FlowerTypeShortProjection extends IdNameTupleProjection {
    String getNameSingle();
    String getNameOriginal();
    String getImage();
    String getPlantingMaterialType();
    String getDescription();
}
