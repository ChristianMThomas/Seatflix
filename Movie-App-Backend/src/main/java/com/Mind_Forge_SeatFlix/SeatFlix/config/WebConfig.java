package com.Mind_Forge_SeatFlix.SeatFlix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration is handled by UsersConfig.java using environment variables
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     registry.addMapping("/**")
    //             .allowedOrigins("https://mind-forge-cthomas.com")
    //             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    //             .allowedHeaders("*")
    //             .allowCredentials(true);
    // }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static files from the local "uploads" folder — path is relative to project root
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/") // no leading slash here
                .setCachePeriod(3600); // optional: set browser cache time in seconds
    }
}