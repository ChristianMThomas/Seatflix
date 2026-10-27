package com.Mind_Forge_SeatFlix.SeatFlix.Users;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Mind_Forge_SeatFlix.SeatFlix.config.CustomUserDetails;
import com.Mind_Forge_SeatFlix.SeatFlix.entity.Users;
import com.Mind_Forge_SeatFlix.SeatFlix.storage.R2StorageService;
import com.Mind_Forge_SeatFlix.SeatFlix.util.JwtUtil;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping(path = "api/v1/users")
@RestController
public class UsersController {

    private final UsersService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final R2StorageService storageService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public UsersController(UsersService userService, BCryptPasswordEncoder passwordEncoder,
            R2StorageService storageService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<List<Users>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        Users user = userService.getUserById(id);
        return (user != null) ? ResponseEntity.ok(user)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Users users) {
        try {
            userService.addNewUsers(users);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful!");
            response.put("username", users.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(path = "{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping(path = "{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable("id") Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email) {
        try {
            userService.updateUser(id, name, email);
            return ResponseEntity.ok("User updated successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Load user details
            Users user = userService.findUserByUsername(loginRequest.getUsername());
            CustomUserDetails userDetails = new CustomUserDetails(user);

            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails);

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during login");
        }
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
        }

        if (!storageService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Avatar uploads are not available right now");
        }

        try {
            Long userId = userDetails.getId();
            byte[] bytes = file.getBytes();

            // Detect the real image type from the file's bytes; never trust the client's
            // Content-Type header or filename
            String[] imageType = detectImageType(bytes);
            if (imageType == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only JPEG, PNG or WebP images are allowed");
            }

            Users existing = userService.getUserById(userId);
            String previousPic = existing != null ? existing.getProfilePic() : null;

            // Unique key per upload so cached copies of the old avatar never linger
            String key = "avatars/" + userId + "/" + UUID.randomUUID() + "." + imageType[1];
            String fileUrl = storageService.upload(key, bytes, imageType[0]);
            Users user = userService.updateProfilePic(userId, fileUrl);

            storageService.deleteByUrl(previousPic);

            return ResponseEntity.ok(user);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to read uploaded file");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload avatar. Please try again.");
        }
    }

    /**
     * Identify an image by its magic bytes.
     * @return {contentType, extension}, or null if not a supported image
     */
    private static String[] detectImageType(byte[] b) {
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return new String[] { "image/jpeg", "jpg" };
        }
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') {
            return new String[] { "image/png", "png" };
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return new String[] { "image/webp", "webp" };
        }
        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Users user = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(user);
    }
}
