package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;

import java.util.List;
import java.util.Optional;

public interface SocialConnectionRepository extends JpaRepository<SocialConnection, Long> {

    SocialConnection findByProviderId(String providerId);

    @Query("SELECT sc.user.email FROM social_connections sc WHERE sc.providerId = :providerId")
    Optional<String> getUserIdProviderId(String providerId);

    List<SocialConnection> findAllByUser(User user);

    Optional<SocialConnection> findByUserAndProvider(User user, SocialConnection.Provider provider);
}
