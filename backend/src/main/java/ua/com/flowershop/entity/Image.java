package ua.com.flowershop.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.ZonedDateTime;

import static ua.com.flowershop.util.Constants.SLASH;
import static ua.com.flowershop.util.Path.IMAGES_PATH;


@Data
@Accessors(chain = true)
@NoArgsConstructor
@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String name;

    private String extension;

    private Size size;

    @Column(columnDefinition = "bytea")
    private byte[] data;

    private ZonedDateTime created = ZonedDateTime.now();


    public static String toImageUrl(String imageName) {
        return IMAGES_PATH + SLASH + imageName;
    }


    public Image(String name, String extension, byte[] data) {
        this.name = name;
        this.extension = extension;
            this.data = data;
    }


    public enum Size {
        SMALL("SMALL"),
        MEDIUM("MEDIUM"),
        LARGE("LARGE");

        private final String value;

        Size(String role) {
            value = role;
        }

        public boolean equalsValue(String role) {
            return value.equals(role);
        }

        @Override
        public String toString() {
            return this.value;
        }
    }
}
