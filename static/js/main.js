// Main JavaScript file for FB Automation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initializeAnimations();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize UI interactions
    initializeUIInteractions();
});

// GSAP Animations
function initializeAnimations() {
    // Animate glass cards on load
    gsap.from('.glass-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.2
    });

    // Animate navigation
    gsap.from('.navbar', {
        duration: 0.6,
        y: -100,
        opacity: 0,
        ease: 'power2.out'
    });

    // Animate floating shapes
    gsap.to('.shape', {
        duration: 20,
        rotation: 360,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center'
    });

    // Button hover animations
    document.querySelectorAll('.glass-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
}

// Form Handlers
function initializeFormHandlers() {
    // Home page message form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }

    // Token validation form
    const tokenValidationForm = document.getElementById('tokenValidationForm');
    if (tokenValidationForm) {
        tokenValidationForm.addEventListener('submit', handleTokenValidation);
    }

    // UID check form
    const uidCheckForm = document.getElementById('uidCheckForm');
    if (uidCheckForm) {
        uidCheckForm.addEventListener('submit', handleUidCheck);
    }

    // Token method toggle
    const tokenMethodRadios = document.querySelectorAll('input[name="token_method"]');
    tokenMethodRadios.forEach(radio => {
        radio.addEventListener('change', toggleTokenInput);
    });

    // Message method toggle
    const messageMethodRadios = document.querySelectorAll('input[name="message_method"]');
    messageMethodRadios.forEach(radio => {
        radio.addEventListener('change', toggleMessageInput);
    });

    // Mode toggle for E2EE
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', toggleEncryptionKey);
    });
}

// UI Interactions
function initializeUIInteractions() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Handle message form submission
async function handleMessageSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(e.target);
        
        const response = await fetch('/send_message', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            showStatus('success', result.message, result.batch_id);
        } else {
            showStatus('error', result.message);
        }
    } catch (error) {
        showStatus('error', 'An error occurred: ' + error.message);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle token validation
async function handleTokenValidation(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Validating...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(e.target);
        
        const response = await fetch('/validate_tokens', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            displayTokenValidationResults(result.results);
        } else {
            addTerminalLine('terminal', 'error', result.message);
        }
    } catch (error) {
        addTerminalLine('terminal', 'error', 'An error occurred: ' + error.message);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle UID check
async function handleUidCheck(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Checking...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(e.target);
        
        const response = await fetch('/check_uid_api', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            displayUidResult(result);
        } else {
            displayUidResult({ status: 'error', message: result.message });
        }
    } catch (error) {
        displayUidResult({ status: 'error', message: 'An error occurred: ' + error.message });
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Toggle token input method
function toggleTokenInput(e) {
    const method = e.target.value;
    const manualInput = document.getElementById('token_manual_input');
    const fileInput = document.getElementById('token_file_input');

    if (method === 'manual') {
        manualInput.style.display = 'block';
        fileInput.style.display = 'none';
    } else {
        manualInput.style.display = 'none';
        fileInput.style.display = 'block';
    }
}

// Toggle message input method
function toggleMessageInput(e) {
    const method = e.target.value;
    const manualInput = document.getElementById('message_manual_input');
    const fileInput = document.getElementById('message_file_input');

    if (method === 'manual') {
        manualInput.style.display = 'block';
        fileInput.style.display = 'none';
    } else {
        manualInput.style.display = 'none';
        fileInput.style.display = 'block';
    }
}

// Toggle encryption key input
function toggleEncryptionKey(e) {
    const mode = e.target.value;
    const encryptionKeyInput = document.getElementById('encryption_key_input');

    if (mode === 'e2ee') {
        encryptionKeyInput.style.display = 'block';
    } else {
        encryptionKeyInput.style.display = 'none';
    }
}

// Display status message
function showStatus(type, message, batchId = null) {
    const statusDisplay = document.getElementById('statusDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const batchControls = document.getElementById('batchControls');

    let alertClass = 'glass-alert';
    let icon = '';

    switch (type) {
        case 'success':
            alertClass += ' alert-success';
            icon = '<i class="fas fa-check-circle me-2"></i>';
            break;
        case 'error':
            alertClass += ' alert-danger';
            icon = '<i class="fas fa-times-circle me-2"></i>';
            break;
        case 'warning':
            alertClass += ' alert-warning';
            icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
            break;
    }

    statusMessage.innerHTML = `${icon}${message}`;
    statusDisplay.style.display = 'block';

    if (batchId && type === 'success') {
        batchControls.style.display = 'block';
        
        // Add event listeners for batch controls
        document.getElementById('stopBatch').onclick = () => stopBatch(batchId);
        document.getElementById('viewLogs').onclick = () => viewLogs(batchId);
    }

    // Animate status display
    gsap.from(statusDisplay, {
        duration: 0.5,
        y: -20,
        opacity: 0,
        ease: 'power2.out'
    });
}

// Stop batch function
async function stopBatch(batchId) {
    try {
        const response = await fetch(`/stop_batch/${batchId}`, { method: 'POST' });
        const result = await response.json();
        
        if (result.status === 'success') {
            showStatus('warning', 'Batch stopped successfully');
        } else {
            showStatus('error', result.message);
        }
    } catch (error) {
        showStatus('error', 'Failed to stop batch: ' + error.message);
    }
}

// View logs function
function viewLogs(batchId) {
    window.open(`/messages/${batchId}`, '_blank');
}

// Display token validation results in terminal
function displayTokenValidationResults(results) {
    const terminal = document.getElementById('terminal');
    
    // Clear previous results except initial lines
    const initialLines = terminal.querySelectorAll('.terminal-line').length;
    if (initialLines > 2) {
        const linesToRemove = terminal.querySelectorAll('.terminal-line');
        for (let i = 2; i < linesToRemove.length; i++) {
            linesToRemove[i].remove();
        }
    }

    addTerminalLine('terminal', 'info', `Validating ${results.length} tokens...`);

    results.forEach((result, index) => {
        setTimeout(() => {
            const status = result.valid ? 'success' : 'error';
            const icon = result.valid ? '✓' : '✗';
            const message = `${icon} Token ${index + 1}: ${result.name}`;
            
            addTerminalLine('terminal', status, message);
        }, index * 500); // Stagger the results for dramatic effect
    });

    setTimeout(() => {
        const validTokens = results.filter(r => r.valid).length;
        const invalidTokens = results.length - validTokens;
        addTerminalLine('terminal', 'info', `Validation complete: ${validTokens} valid, ${invalidTokens} invalid`);
    }, results.length * 500 + 1000);
}

// Display UID check result
function displayUidResult(result) {
    const profileResult = document.getElementById('profileResult');
    const profileData = document.getElementById('profileData');

    if (result.status === 'success') {
        profileData.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="me-3">
                    <i class="fas fa-user-circle fa-3x text-primary"></i>
                </div>
                <div>
                    <h6 class="text-white mb-1">Profile Name</h6>
                    <p class="text-light mb-1">${result.profile_name}</p>
                    <small class="text-muted">UID: ${result.uid}</small>
                </div>
            </div>
        `;
    } else {
        profileData.innerHTML = `
            <div class="text-center">
                <i class="fas fa-times-circle fa-3x text-danger mb-3"></i>
                <h6 class="text-white">Error</h6>
                <p class="text-light">${result.message}</p>
            </div>
        `;
    }

    profileResult.style.display = 'block';

    // Animate result display
    gsap.from(profileResult, {
        duration: 0.5,
        x: -20,
        opacity: 0,
        ease: 'power2.out'
    });
}

// Add terminal line helper function
function addTerminalLine(terminalId, type, message) {
    const terminal = document.getElementById(terminalId);
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    line.innerHTML = `
        <span class="terminal-prompt">FB-Automation@${terminalId.replace('terminal', 'system')}:~$</span>
        <span class="terminal-text ${type}">${message}</span>
    `;
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

// Utility function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-update functionality for real-time data
function startAutoUpdate() {
    setInterval(() => {
        // Update any real-time elements here
        const timestampElements = document.querySelectorAll('.timestamp');
        timestampElements.forEach(element => {
            element.textContent = formatTime(new Date());
        });
    }, 1000);
}

// Initialize auto-update if needed
if (document.querySelector('.timestamp')) {
    startAutoUpdate();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.activeElement.closest('form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape key to close modals or reset forms
    if (e.key === 'Escape') {
        const statusDisplay = document.getElementById('statusDisplay');
        if (statusDisplay && statusDisplay.style.display !== 'none') {
            statusDisplay.style.display = 'none';
        }
    }
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.FBAutomation = {
    showStatus,
    stopBatch,
    viewLogs,
    addTerminalLine,
    formatTime,
    escapeHtml
};
