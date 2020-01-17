package ua.com.flowershop.projection;

public interface FlowerTypeTinyProjection extends IdNameTupleProjection {
    String getNameSingle();
    String getNameOriginal();
    String getImage();
    String getPlantingMaterialType();
}
