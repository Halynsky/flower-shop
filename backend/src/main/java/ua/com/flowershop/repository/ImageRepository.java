package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ua.com.flowershop.entity.Image;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Image findByName(String name);
    Optional<Image> findOptionalByName(String name);

    @Modifying
    @Transactional
    @Query("DELETE FROM Image i WHERE i.name = ?1")
    int deleteByName(String name);

}
