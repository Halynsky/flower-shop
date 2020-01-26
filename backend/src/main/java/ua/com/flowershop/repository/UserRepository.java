package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.projection.ProfileProjection;
import ua.com.flowershop.projection.UserAdminProjection;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    Optional<User> findByIdNotAndEmail(Long id, String email);
    Optional<User> findByEmailAndIsVirtual(String email, Boolean isVirtual);
    Optional<User> findByPhone(String phone);
    Optional<User> findByPhoneAndIsVirtual(String phone, Boolean isVirtual);
    Optional<User> findBySecretKey(String secretKey);
    Optional<User> findBySecretKeyAndIsActivated(String secretKey, Boolean isActivated);

    UserAdminProjection findProjectedById(Long id);
    ProfileProjection findProfileById(Long id);

    @Query("SELECT u.id as id, u.name as name, u.email as email, u.phone as phone, u.role as role, u.isEnabled as isEnabled, u.isVirtual as isVirtual, " +
        "u.isActivated as isActivated, u.lastOrderDate as lastOrderDate, u.created as created, u.facebookNickname as  facebookNickname, u.note as note " +
        "FROM User u " +
        "WHERE (:id IS NULL OR  u.id = :id) " +
        "AND (:namePart IS NULL OR :namePart = '' OR lower(u.name) LIKE '%' || lower(cast(:namePart as string)) || '%') " +
        "AND (:emailPart IS NULL OR :emailPart = '' OR lower(u.email) LIKE '%' || lower(cast(:emailPart as string)) || '%') " +
        "AND (:phonePart IS NULL OR :phonePart = '' OR lower(u.phone) LIKE '%' || lower(cast(:phonePart as string)) || '%') ")
    Page<UserAdminProjection> findProjectedBy(Long id, String namePart, String emailPart, String phonePart, Pageable pageable);

    Boolean existsByEmail(String name);

    @Query("SELECT  u.icon FROM User u WHERE u.id = ?1")
    Optional<String> getIcon(long id);

}
