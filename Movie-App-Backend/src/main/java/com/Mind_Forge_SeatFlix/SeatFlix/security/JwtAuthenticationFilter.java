package com.Mind_Forge_SeatFlix.SeatFlix.security;

import com.Mind_Forge_SeatFlix.SeatFlix.Users.UserDetailsServiceImpl;
import com.Mind_Forge_SeatFlix.SeatFlix.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the Authorization header
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Check if header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Remove "Bearer " prefix
            try {
                username = jwtUtil.extractUsername(jwt);
                logger.info("JWT token extracted successfully for user: " + username);
            } catch (Exception e) {
                logger.error("JWT token extraction failed: " + e.getMessage(), e);
                // Don't return error here - let the request continue without authentication
                // Spring Security will return 403 for protected endpoints
            }
        } else if (authorizationHeader != null) {
            logger.warn("Authorization header present but doesn't start with 'Bearer '");
        }

        // If we have a username and no authentication is set in the context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // Validate the token
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    // Set additional details
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the context
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.info("Authentication successful for user: " + username);
                } else {
                    logger.warn("JWT token validation failed for user: " + username);
                }
            } catch (Exception e) {
                logger.error("Error during authentication: " + e.getMessage(), e);
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
