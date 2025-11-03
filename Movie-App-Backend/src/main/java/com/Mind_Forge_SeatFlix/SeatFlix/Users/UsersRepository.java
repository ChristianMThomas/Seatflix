package com.Mind_Forge_SeatFlix.SeatFlix.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Mind_Forge_SeatFlix.SeatFlix.entity.Users;

import java.util.Optional;

/**
 * Repository interface for Users entity
 * Provides database access methods
 */
@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    /**
     * Find user by email address
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM Users u WHERE u.email = ?1")
    Optional<Users> findUserByEmail(String email);

    /**
     * Find user by username
     * @param username the username to search for
     * @return Optional containing the user if found
     */
    Optional<Users> findUserByUsername(String username);

    /**
     * Find user by ID
     * @param id the user ID
     * @return Optional containing the user if found
     */
    Optional<Users> findById(Long id);
}
