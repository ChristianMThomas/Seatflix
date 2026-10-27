package com.Mind_Forge_SeatFlix.SeatFlix.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Mind_Forge_SeatFlix.SeatFlix.config.CustomUserDetails;
import com.Mind_Forge_SeatFlix.SeatFlix.entity.Users;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Must be CustomUserDetails: controllers resolve @AuthenticationPrincipal CustomUserDetails,
        // which comes back null (-> 401) for any other principal type
        return new CustomUserDetails(user);
    }
}
