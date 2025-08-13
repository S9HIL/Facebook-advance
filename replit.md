# Facebook Automation Tool

## Overview

This is a web-based Facebook automation tool built with Flask that provides functionality for sending automated messages to Facebook conversations. The application features a modern glass-morphism UI design and includes capabilities for token validation, UID checking, message batch sending, and real-time monitoring of automation tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla HTML, CSS, and JavaScript with Bootstrap 5.3.0 for responsive design
- **UI Design**: Glass-morphism design with animated backgrounds and floating shapes
- **JavaScript Libraries**: GSAP for animations, custom terminal emulation for logs
- **Styling**: CSS3 with custom properties, gradient animations, and glass-effect styling
- **Navigation**: Single-page application feel with multi-page Flask routing

### Backend Architecture
- **Framework**: Flask web framework with Python
- **Session Management**: Flask sessions with configurable secret key from environment variables
- **Request Handling**: RESTful API endpoints for automation tasks
- **Threading**: Multi-threaded message sending with stop/start controls
- **Logging**: Python logging module for debugging and monitoring
- **Proxy Support**: ProxyFix middleware for handling reverse proxy headers

### Core Features
- **Token Validation**: Facebook Graph API integration for validating access tokens
- **Message Automation**: Batch message sending with configurable delays and speeds
- **UID Checking**: Facebook user ID validation and lookup
- **Real-time Monitoring**: Live status updates and logging for running automation tasks
- **File Upload**: Support for uploading message files for batch operations
- **End-to-End Encryption**: Message encryption capabilities using base64 encoding

### Data Storage
- **In-Memory Storage**: Global variables for session state, logs, and control flags
- **File System**: Local file storage for uploaded message files in `/messages` directory
- **Session Data**: Client session tracking with IP-based identification

### Security & Authentication
- **Facebook API Integration**: OAuth-style access token validation
- **Session Security**: Configurable session secret with environment variable fallback
- **IP Tracking**: Client IP address identification for session management
- **Message Encryption**: Base64 encoding for message obfuscation

### Message Sending Architecture
- **Batch Processing**: Support for multiple tokens and messages in rotation
- **Thread Management**: Individual thread control with stop flags per batch
- **Rate Limiting**: Configurable speed controls and delays between messages
- **Error Handling**: Comprehensive error logging and status tracking

## External Dependencies

### Core Dependencies
- **Flask**: Web framework for backend API and routing
- **Requests**: HTTP client library for Facebook Graph API integration
- **Werkzeug**: WSGI utilities including ProxyFix middleware

### Frontend Dependencies
- **Bootstrap 5.3.0**: CSS framework for responsive design (CDN)
- **Font Awesome 6.4.0**: Icon library for UI elements (CDN)
- **GSAP**: Animation library for smooth UI transitions (referenced but not loaded)
- **Google Fonts**: Inter font family for typography (CDN)

### Facebook API Integration
- **Facebook Graph API v17.0**: For user account validation and information retrieval
- **Facebook Messenger API**: For sending messages to conversations (custom endpoint structure)

### Development Tools
- **Python Standard Library**: Base64, JSON, threading, datetime, UUID, logging modules
- **Environment Variables**: Configuration management for sensitive data like session secrets

### File System Dependencies
- **Local Storage**: Message file uploads stored in `/messages` directory
- **Static Assets**: CSS, JavaScript, and other static files served from `/static`
- **Templates**: Jinja2 templating for HTML rendering from `/templates`