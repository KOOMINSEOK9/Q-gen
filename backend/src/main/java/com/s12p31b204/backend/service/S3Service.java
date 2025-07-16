package com.s12p31b204.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile file, String dirName) throws IOException {
        String fileName = dirName + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try (InputStream is = file.getInputStream()) {
            amazonS3.putObject(bucket, fileName, is, metadata);
        }

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public void deleteFileFromS3(String fileUrl) {
        try {
            URI uri = URI.create(fileUrl);
            String objectKey = uri.getPath().substring(1); // "/" 제거
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, objectKey));
        } catch (AmazonS3Exception e) {
            throw new RuntimeException("S3 delete failed: " + e.getMessage(), e);
        }
    }
}