-- TOP SPARK DIGITAL DATABASE SCHEMA
-- Compatible with MySQL 8.0+, MariaDB 10.4+, and PostgreSQL
-- Designed for deployment on Hostinger MySQL / VPS / Cloud

CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(64) PRIMARY KEY,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT '',
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(128) NOT NULL,
    budget VARCHAR(64) DEFAULT '',
    message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'New', -- 'New', 'In Progress', 'Contacted', 'Closed'
    notes TEXT DEFAULT NULL,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role VARCHAR(32) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(32) PRIMARY KEY,
    data JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_studies (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    client VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    challenge TEXT NOT NULL,
    approach TEXT NOT NULL,
    execution TEXT NOT NULL,
    outcome TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'draft', -- 'draft', 'published'
    sort_order INT DEFAULT 0,
    services JSON NOT NULL,
    deliverables JSON NOT NULL,
    verified_results TEXT NULL,
    seo_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    cta_label VARCHAR(128) NOT NULL,
    cta_destination VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'published',
    features JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'draft', -- Keep draft until owner enables blog
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
