package com.s12p31b204.backend.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.*;

public class CustomMultipartFile implements MultipartFile {
    private final File file;
    private final String name;
    private final String contentType;

    public CustomMultipartFile(File file, String name, String contentType) {
        this.file = file;
        this.name = name;
        this.contentType = contentType;
    }

    @Override
    public String getName() { return name; }

    @Override
    public String getOriginalFilename() { return name; }

    @Override
    public String getContentType() { return contentType; }

    @Override
    public boolean isEmpty() { return file.length() == 0; }

    @Override
    public long getSize() { return file.length(); }

    @Override
    public byte[] getBytes() throws IOException {
        return java.nio.file.Files.readAllBytes(file.toPath());
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new FileInputStream(file);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        java.nio.file.Files.copy(file.toPath(), dest.toPath());
    }
} 