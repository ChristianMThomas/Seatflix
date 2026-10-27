package com.Mind_Forge_SeatFlix.SeatFlix.storage;

import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Stores files in a Cloudflare R2 bucket via its S3-compatible API.
 * Objects are served from the bucket's public URL (r2.dev subdomain or custom domain).
 */
@Service
public class R2StorageService {

    private static final Logger log = LoggerFactory.getLogger(R2StorageService.class);

    private final S3Client client;
    private final String bucket;
    private final String publicUrl;

    public R2StorageService(
            @Value("${r2.account-id}") String accountId,
            @Value("${r2.access-key-id}") String accessKeyId,
            @Value("${r2.secret-access-key}") String secretAccessKey,
            @Value("${r2.bucket}") String bucket,
            @Value("${r2.public-url}") String publicUrl) {
        this.bucket = bucket;
        this.publicUrl = publicUrl.endsWith("/") ? publicUrl.substring(0, publicUrl.length() - 1) : publicUrl;

        // Leave storage disabled (instead of failing startup) when R2 isn't configured
        if (accountId.isBlank() || accessKeyId.isBlank() || secretAccessKey.isBlank()
                || bucket.isBlank() || publicUrl.isBlank()) {
            log.warn("Cloudflare R2 is not configured; avatar uploads are disabled");
            this.client = null;
            return;
        }

        this.client = S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                // R2 doesn't support every checksum/chunked-upload feature newer SDKs send by default
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .chunkedEncodingEnabled(false)
                        .build())
                .build();
    }

    public boolean isConfigured() {
        return client != null;
    }

    /**
     * Upload bytes under the given key and return the object's public URL.
     */
    public String upload(String key, byte[] bytes, String contentType) {
        if (client == null) {
            throw new IllegalStateException("File storage is not configured");
        }

        client.putObject(PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        // Keys are unique per upload, so the object can be cached forever
                        .cacheControl("public, max-age=31536000, immutable")
                        .build(),
                RequestBody.fromBytes(bytes));

        return publicUrl + "/" + key;
    }

    /**
     * Delete an object previously returned by {@link #upload}. URLs that don't belong
     * to this bucket (e.g. the default "user.png") are ignored. Failures are logged, not thrown.
     */
    public void deleteByUrl(String url) {
        if (client == null || url == null || !url.startsWith(publicUrl + "/")) {
            return;
        }

        String key = url.substring(publicUrl.length() + 1);
        try {
            client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (Exception e) {
            log.warn("Failed to delete old object {} from R2: {}", key, e.getMessage());
        }
    }

    @PreDestroy
    public void close() {
        if (client != null) {
            client.close();
        }
    }
}
