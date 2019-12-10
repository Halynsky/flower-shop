package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.com.flowershop.entity.SocialConnection;
import ua.com.flowershop.entity.User;

import java.util.List;
import java.util.Optional;

public interface SocialConnectionRepository extends JpaRepository<SocialConnection, Long> {

    SocialConnection findByProviderId(String providerId);

    List<SocialConnection> findAllByUser(User user);

    Optional<SocialConnection> findByUserAndProvider(User user, SocialConnection.Provider provider);
}
