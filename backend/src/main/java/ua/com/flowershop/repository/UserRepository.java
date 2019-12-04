package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.projection.UserAdminProjection;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);

    UserAdminProjection findProjectedById(Long id);

    @Query("SELECT u.id as id, u.name as name, u.email as email, u.phone as phone, u.role as role, u.isEnabled as isEnabled, u.isVirtual as isVirtual, u.created as created " +
        "FROM User u " +
        "WHERE (:id IS NULL OR  u.id = :id) " +
        "AND (:namePart IS NULL OR :namePart = '' OR lower(u.name) LIKE '%' || lower(cast(:namePart as string)) || '%') " +
        "AND (:emailPart IS NULL OR :emailPart = '' OR lower(u.email) LIKE '%' || lower(cast(:emailPart as string)) || '%') " +
        "AND (:phonePart IS NULL OR :phonePart = '' OR lower(u.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%') ")
    Page<UserAdminProjection> findProjectedBy(Long id, String namePart, String emailPart, String phonePart, Pageable pageable);

    Boolean existsByEmail(String name);

}
