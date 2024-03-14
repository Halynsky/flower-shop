package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.OrderContactsModel;
import ua.com.flowershop.model.OrderDeliveryModel;

import javax.persistence.*;
import java.util.Optional;

import static java.util.function.Predicate.not;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "user_delivery_infos")
public class UserDeliveryInfo {
    @Id
    private Long id;
    @Enumerated(EnumType.STRING)
    private Order.DeliveryType deliveryType;
    private String city;
    private String street;
    private String house;
    private String apartment;
    private String postalCode;
    private String novaPoshtaDepartment;
    private String receiverFullName;
    private String receiverPhone;
    private String concatedAddress;
    @OneToOne
    @MapsId
    private User user;

    public static UserDeliveryInfo of(OrderDeliveryModel orderDeliveryModel, OrderContactsModel contactInfo) {
        return new UserDeliveryInfo()
            .setDeliveryType(orderDeliveryModel.getDeliveryType())
            .setCity(orderDeliveryModel.getCity())
            .setStreet(orderDeliveryModel.getStreet())
            .setHouse(orderDeliveryModel.getHouse())
            .setApartment(orderDeliveryModel.getApartment())
            .setPostalCode(orderDeliveryModel.getPostalCode())
            .setNovaPoshtaDepartment(orderDeliveryModel.getNovaPoshtaDepartment())
            .setReceiverFullName(Optional.ofNullable(orderDeliveryModel.getReceiverFullName()).filter(not(String::isEmpty)).orElse(contactInfo.getName()))
            .setReceiverPhone(Optional.ofNullable(orderDeliveryModel.getReceiverPhone()).filter(not(String::isEmpty)).orElse(contactInfo.getPhone()));
    }

    public static UserDeliveryInfo merge(UserDeliveryInfo udi, OrderDeliveryModel odm) {
        if (odm.getDeliveryType() != null) {
            udi.setDeliveryType(odm.getDeliveryType());
        }
        if (odm.getCity() != null) {
            udi.setCity(odm.getCity());
        }
        if (odm.getStreet() != null) {
            udi.setStreet(odm.getStreet());
        }
        if (odm.getHouse() != null) {
            udi.setHouse(odm.getHouse());
        }
        if (odm.getApartment() != null) {
            udi.setApartment(odm.getApartment());
        }
        if (odm.getPostalCode() != null) {
            udi.setPostalCode(odm.getPostalCode());
        }
        if (odm.getNovaPoshtaDepartment() != null) {
            udi.setNovaPoshtaDepartment(odm.getNovaPoshtaDepartment());
        }
        if (odm.getReceiverFullName() != null) {
            udi.setReceiverFullName(odm.getReceiverFullName());
        }
        if (odm.getReceiverPhone() != null) {
            udi.setReceiverPhone(odm.getReceiverPhone());
        }
        return udi;
    }

}
