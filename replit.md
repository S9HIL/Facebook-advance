# Facebook Automation Tool

## Overview

This is a web-based Facebook automation tool built with Flask that provides functionality for sending automated messages to Facebook conversations. The application features a modern glass-morphism UI design and includes capabilities for token validation, UID checking, message batch sending, and real-time monitoring of automation tasks.

## User Preferences

Preferred communication style: Simple, everyday language.
Storage preference: Use in-memory storage only - no file writing or session files.
UI/UX preference: Premium glass-morphism design with smooth animations and best-in-class user experience.
Branding preference: Website title should be "FB@SAHIL_PRAJAPATI" with animated "SAHIL PRAJAPATI" text in footer.

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla HTML, CSS, and JavaScript with Bootstrap 5.3.0 for responsive design
- **UI Design**: Premium glass-morphism design with enhanced animations and floating shapes
- **JavaScript Libraries**: GSAP for smooth animations, custom terminal emulation for logs
- **Styling**: CSS3 with custom properties, gradient animations, enhanced glass-effect styling, and performance optimizations
- **Navigation**: Single-page application feel with multi-page Flask routing
- **Responsive Design**: Mobile-first approach with breakpoints for desktop, tablet, and mobile
- **Animation System**: Optimized GSAP animations with proper z-index layering and anti-flicker techniques
- **Loading System**: Smooth page loader to prevent blank page issues during initialization

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
- **No File System Operations**: All file uploads processed directly in memory without disk storage
- **Session Data**: Client session tracking with IP-based identification using Flask sessions

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
- **Static Assets**: Enhanced CSS with glass-morphism styling, optimized JavaScript with GSAP animations served from `/static`
- **Templates**: Jinja2 templating for HTML rendering from `/templates` with premium UI components
- **In-Memory Processing**: All message uploads and session data handled in memory without file system storage

## Recent Changes (August 2025)

### Major UI/UX Enhancement & Performance Optimization Completed
- **Fixed Page Flickering**: Completely eliminated page flickering with optimized CSS animations and proper z-index layering
- **Enhanced Glass-Morphism Design**: Premium frosted-glass containers with improved backdrop blur effects and smooth transitions
- **Optimized Background Animations**: Implemented hardware-accelerated particle systems, gradient waves, and morphing shapes for smooth performance
- **Fixed Main Page Layout**: Removed Check UID button from main page, repositioned Submit button (centered) and Reset button (right-aligned)
- **Animated Button Borders**: Added premium gradient border animations with smooth hover effects and 3D transformations
- **Page Loader System**: Implemented smooth loading screens across all pages to prevent any flickering during initialization
- **Performance Optimizations**: Added CSS fallbacks, reduced motion support, and hardware acceleration for smooth scrolling
- **Responsive Design**: Enhanced mobile and tablet experiences with adaptive button layouts and proper breakpoints
- **Branding Integration**: Added "SAHIL PRAJAPATI" branding throughout terminal prompts and footer across all pages
- **Terminal Enhancements**: Updated all terminal prompts to "SAHIL_PRAJAPATI@fb-automation:~$" with consistent styling

### Latest Performance & Branding Updates (August 13, 2025)
- **Token Validation Performance**: Optimized validation process by reducing delay from 0.5s to 0.2s per batch of 3 tokens, added 10s timeout for faster error handling
- **Website Title Update**: Changed all page titles from "Facebook Automation" to "FB@SAHIL_PRAJAPATI" across all template files
- **Animated Footer**: Added stunning animated "SAHIL PRAJAPATI" text in footer with gradient color shifting, pulse effect, and moving underline
- **Enhanced User Experience**: Improved token validation feedback with progress indicators and smooth transitions
- **Performance Optimizations**: Added CSS performance enhancements with hardware acceleration, transform optimizations, and smooth button hover effects
- **Responsive Improvements**: Better mobile experience with optimized loading states and button animations

### Critical Fixes & Privacy Updates (August 13, 2025)
- **Message Sending Fixed**: Updated Facebook Graph API to use working thread-based endpoint (t_{uid}/) instead of standard me/messages for better compatibility
- **Monitor Page Fixed**: Added safety checks for existing user sessions missing 'page_views' field to prevent KeyError crashes
- **IP Privacy Protection**: Monitor page now shows only current user's IP address - other users' IPs are completely hidden for security
- **Privacy Enhancement**: Removed "Total Users Online" information completely - no user count data is visible to anyone
- **Clear Logs Feature**: Added clear logs functionality with confirmation dialog to remove all previous logs and show only new ones
- **Enhanced Error Logging**: Improved debugging with detailed Facebook API response logging for message sending failures

### Deployment Support Added (August 13, 2025)
- **Created deployment_requirements.txt**: Contains all Python dependencies for easy deployment on other hosting platforms
- **Added DEPLOYMENT_GUIDE.md**: Comprehensive deployment instructions for Heroku, Railway, Render, and VPS hosting
- **Platform Compatibility**: Application now ready for deployment on any hosting platform with proper requirements file