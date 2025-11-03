package com.Mind_Forge_SeatFlix.SeatFlix.Users;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Mind_Forge_SeatFlix.SeatFlix.entity.Users;

import jakarta.transaction.Transactional;

/**
 * Service layer for User operations
 * Handles business logic between Controller and Repository
 */
@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Get all users from database
     */
    public List<Users> getUsers() {
        return usersRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    /**
     * Find user by username
     */
    public Users findUserByUsername(String username) {
        return usersRepository.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    /**
     * Get total count of users
     * @return total number of users in the database
     */
    public long getTotalUserCount() {
        return usersRepository.count();
    }

    /**
     * Add new user to database
     * Validates email uniqueness and hashes password
     */
    public void addNewUsers(Users user) {
        // Check if email already exists
        Optional<Users> existingUser = usersRepository.findUserByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("Email already exists");
        }

        // Hash password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Set date joined if not provided
        if (user.getDateJoined() == null) {
            user.setDateJoined(LocalDate.now());
        }

        // Set default profile picture if not provided
        if (user.getProfilePic() == null || user.getProfilePic().isEmpty()) {
            user.setProfilePic("user.png");
        }

        usersRepository.save(user);
    }

    /**
     * Delete user by ID
     */
    public void deleteUser(Long id) {
        boolean exists = usersRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("User with id " + id + " does not exist");
        }
        usersRepository.deleteById(id);
    }

    /**
     * Update user information (username and/or email)
     */
    @Transactional
    public void updateUser(Long id, String username, String email) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User with id " + id + " does not exist"));

        // Update username if provided and different
        if (username != null && username.length() > 0 && !Objects.equals(user.getUsername(), username)) {
            user.setUsername(username);
        }

        // Update email if provided and different
        if (email != null && email.length() > 0 && !Objects.equals(user.getEmail(), email)) {
            // Check if new email is already taken
            Optional<Users> userWithEmail = usersRepository.findUserByEmail(email);
            if (userWithEmail.isPresent()) {
                throw new IllegalStateException("Email already taken");
            }
            user.setEmail(email);
        }
    }

    /**
     * Update user's profile picture
     */
    @Transactional
    public Users updateProfilePic(Long userId, String fileUrl) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setProfilePic(fileUrl);
        return usersRepository.save(user);
    }
}
