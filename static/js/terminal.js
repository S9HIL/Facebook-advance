// Terminal-specific JavaScript functionality

class Terminal {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.options = {
            prompt: 'SAHIL_PRAJAPATI:~$',
            maxLines: 1000,
            autoScroll: true,
            typewriterSpeed: 50,
            ...options
        };
        
        this.lineCount = 0;
        this.isAutoScrollEnabled = this.options.autoScroll;
        
        this.init();
    }

    init() {
        if (!this.element) {
            console.error('Terminal element not found');
            return;
        }

        // Add initial system info
        this.addLine('System initialized...', 'info');
        this.addLine('Terminal ready for input', 'success');
    }

    addLine(text, type = 'normal', useTypewriter = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = this.options.prompt;
        
        const textSpan = document.createElement('span');
        textSpan.className = `terminal-text ${type}`;
        
        line.appendChild(prompt);
        line.appendChild(textSpan);
        
        this.element.appendChild(line);
        this.lineCount++;

        if (useTypewriter) {
            this.typewriterEffect(textSpan, text);
        } else {
            textSpan.textContent = text;
        }

        // Limit lines
        if (this.lineCount > this.options.maxLines) {
            this.element.removeChild(this.element.firstChild);
            this.lineCount--;
        }

        // Auto scroll
        if (this.isAutoScrollEnabled) {
            this.scrollToBottom();
        }

        return line;
    }

    typewriterEffect(element, text) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                if (this.isAutoScrollEnabled) {
                    this.scrollToBottom();
                }
            } else {
                clearInterval(timer);
            }
        }, this.options.typewriterSpeed);
    }

    addProgressLine(text, progress = 0) {
        const line = this.addLine('');
        const textSpan = line.querySelector('.terminal-text');
        
        const progressBar = this.createProgressBar(progress);
        textSpan.innerHTML = `${text} ${progressBar}`;
        
        return {
            update: (newProgress) => {
                const updatedProgressBar = this.createProgressBar(newProgress);
                textSpan.innerHTML = `${text} ${updatedProgressBar}`;
            }
        };
    }

    createProgressBar(progress) {
        const width = 20;
        const filled = Math.round((progress / 100) * width);
        const empty = width - filled;
        
        return `[${'█'.repeat(filled)}${'.'.repeat(empty)}] ${progress}%`;
    }

    scrollToBottom() {
        this.element.scrollTop = this.element.scrollHeight;
    }

    clear() {
        this.element.innerHTML = '';
        this.lineCount = 0;
        this.addLine('Terminal cleared...', 'info');
    }

    toggleAutoScroll() {
        this.isAutoScrollEnabled = !this.isAutoScrollEnabled;
        return this.isAutoScrollEnabled;
    }

    setPrompt(newPrompt) {
        this.options.prompt = newPrompt;
    }

    // Simulate command execution
    executeCommand(command) {
        this.addLine(command, 'command');
        
        // Simulate processing time
        const processingLine = this.addLine('Processing...', 'warning');
        
        setTimeout(() => {
            processingLine.remove();
            this.lineCount--;
            
            // Simulate command results
            switch (command.toLowerCase().trim()) {
                case 'help':
                    this.addLine('Available commands:', 'info');
                    this.addLine('  help     - Show this help message', 'normal');
                    this.addLine('  clear    - Clear terminal', 'normal');
                    this.addLine('  status   - Show system status', 'normal');
                    this.addLine('  tokens   - Validate tokens', 'normal');
                    break;
                
                case 'status':
                    this.addLine('  Server: Online', 'success');
                    this.addLine('  Memory: 45% used', 'normal');
                    this.addLine('  CPU: 12% used', 'normal');
                    this.addLine('  Active connections: 3', 'normal');
                    break;
                
                case 'clear':
                    this.clear();
                    break;
                
                default:
                    this.addLine(`Command not found: ${command}`, 'error');
                    this.addLine('Type "help" for available commands', 'info');
            }
        }, 500 + Math.random() * 1000);
    }
}

// Terminal Manager for handling multiple terminals
class TerminalManager {
    constructor() {
        this.terminals = new Map();
    }

    createTerminal(elementId, options = {}) {
        const terminal = new Terminal(elementId, options);
        this.terminals.set(elementId, terminal);
        return terminal;
    }

    getTerminal(elementId) {
        return this.terminals.get(elementId);
    }

    broadcast(message, type = 'normal') {
        this.terminals.forEach(terminal => {
            terminal.addLine(message, type);
        });
    }
}

// Global terminal manager instance
const terminalManager = new TerminalManager();

// Initialize terminals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize validation terminal
    const validationTerminal = document.getElementById('terminal');
    if (validationTerminal) {
        terminalManager.createTerminal('terminal', {
            prompt: 'SAHIL_PRAJAPATI:~$'
        });
    }

    // Initialize system logs terminal
    const systemLogsTerminal = document.getElementById('systemLogs');
    if (systemLogsTerminal) {
        terminalManager.createTerminal('systemLogs', {
            prompt: 'SAHIL_PRAJAPATI:~$'
        });
    }

    // Initialize message terminal
    const messageTerminal = document.getElementById('messageTerminal');
    if (messageTerminal) {
        terminalManager.createTerminal('messageTerminal', {
            prompt: 'SAHIL_PRAJAPATI:~$'
        });
    }
});

// Token validation simulation
function simulateTokenValidation(tokens) {
    const terminal = terminalManager.getTerminal('terminal');
    if (!terminal) return;

    terminal.addLine(`Starting validation of ${tokens.length} tokens...`, 'info');
    
    let validCount = 0;
    let invalidCount = 0;

    tokens.forEach((token, index) => {
        setTimeout(() => {
            const isValid = Math.random() > 0.3; // 70% success rate for demo
            const accountName = isValid ? `Account_${index + 1}` : 'Invalid Token';
            const status = isValid ? 'success' : 'error';
            const icon = isValid ? '✓' : '✗';
            
            terminal.addLine(`${icon} Token ${index + 1}: ${accountName}`, status);
            
            if (isValid) validCount++;
            else invalidCount++;
            
            // Show summary at the end
            if (index === tokens.length - 1) {
                setTimeout(() => {
                    terminal.addLine('--- Validation Summary ---', 'info');
                    terminal.addLine(`Total tokens: ${tokens.length}`, 'normal');
                    terminal.addLine(`Valid: ${validCount}`, 'success');
                    terminal.addLine(`Invalid: ${invalidCount}`, 'error');
                    terminal.addLine(`Success rate: ${Math.round((validCount / tokens.length) * 100)}%`, 'info');
                }, 500);
            }
        }, index * 800);
    });
}

// Message sending simulation
function simulateMessageSending(batchId, messageCount) {
    const terminal = terminalManager.getTerminal('messageTerminal');
    if (!terminal) return;

    terminal.addLine(`Batch ${batchId} started`, 'info');
    terminal.addLine(`Sending ${messageCount} messages...`, 'info');

    for (let i = 0; i < messageCount; i++) {
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            const timestamp = new Date().toLocaleTimeString();
            const status = success ? 'success' : 'error';
            const icon = success ? '✓' : '✗';
            const recipient = `User_${Math.floor(Math.random() * 1000)}`;
            
            terminal.addLine(
                `[${timestamp}] ${icon} Message ${i + 1} → ${recipient}`,
                status
            );
        }, i * 2000);
    }
}

// System monitoring simulation
function simulateSystemMonitoring() {
    const terminal = terminalManager.getTerminal('systemLogs');
    if (!terminal) return;

    const events = [
        'New user session started',
        'Token validation request received',
        'Message batch initialized',
        'Memory usage: 45%',
        'CPU usage: 12%',
        'Active connections: 3',
        'Database query executed',
        'API rate limit: OK'
    ];

    function addRandomEvent() {
        const event = events[Math.floor(Math.random() * events.length)];
        const timestamp = new Date().toLocaleTimeString();
        terminal.addLine(`[${timestamp}] ${event}`, 'info');
    }

    // Add periodic system events
    setInterval(addRandomEvent, 3000 + Math.random() * 5000);
}

// Enhanced terminal commands
const terminalCommands = {
    help: (terminal) => {
        terminal.addLine('Available commands:', 'info');
        terminal.addLine('  help      - Show available commands', 'normal');
        terminal.addLine('  clear     - Clear terminal screen', 'normal');
        terminal.addLine('  status    - Show system status', 'normal');
        terminal.addLine('  validate  - Start token validation', 'normal');
        terminal.addLine('  monitor   - Show monitoring data', 'normal');
        terminal.addLine('  stats     - Display statistics', 'normal');
    },

    clear: (terminal) => {
        terminal.clear();
    },

    status: (terminal) => {
        terminal.addLine('System Status Report:', 'info');
        terminal.addLine('━━━━━━━━━━━━━━━━━━━━━━━━', 'normal');
        terminal.addLine('🟢 Server Status: Online', 'success');
        terminal.addLine('📊 Memory Usage: 45%', 'normal');
        terminal.addLine('⚡ CPU Usage: 12%', 'normal');
        terminal.addLine('🌐 Network: Stable', 'success');
        terminal.addLine('🔑 API Status: Connected', 'success');
        terminal.addLine('👥 Active Users: 3', 'normal');
        terminal.addLine('━━━━━━━━━━━━━━━━━━━━━━━━', 'normal');
    },

    validate: (terminal) => {
        terminal.addLine('Initializing token validation...', 'info');
        const progress = terminal.addProgressLine('Validation Progress', 0);
        
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 20;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    terminal.addLine('Token validation completed!', 'success');
                }, 500);
            }
            progress.update(Math.round(currentProgress));
        }, 300);
    },

    monitor: (terminal) => {
        terminal.addLine('Real-time monitoring data:', 'info');
        terminal.addLine('📈 Requests/sec: 45', 'normal');
        terminal.addLine('⏱️  Avg Response: 120ms', 'normal');
        terminal.addLine('💾 Disk Usage: 32%', 'normal');
        terminal.addLine('🔄 Uptime: 2d 14h 32m', 'success');
    },

    stats: (terminal) => {
        terminal.addLine('Application Statistics:', 'info');
        terminal.addLine('📊 Messages Sent: 15,847', 'normal');
        terminal.addLine('✅ Success Rate: 94.2%', 'success');
        terminal.addLine('🔑 Tokens Validated: 234', 'normal');
        terminal.addLine('👥 Total Users: 12', 'normal');
        terminal.addLine('⏰ Last 24h Activity: 1,205 actions', 'normal');
    }
};

// Command input handler (if terminal input is implemented)
function handleTerminalCommand(terminalId, command) {
    const terminal = terminalManager.getTerminal(terminalId);
    if (!terminal) return;

    const cmd = command.toLowerCase().trim();
    
    if (terminalCommands[cmd]) {
        terminalCommands[cmd](terminal);
    } else {
        terminal.addLine(`Command not found: ${command}`, 'error');
        terminal.addLine('Type "help" for available commands', 'info');
    }
}

// Auto-start system monitoring on monitor page
if (window.location.pathname.includes('/monitor')) {
    setTimeout(simulateSystemMonitoring, 2000);
}

// Export for global access
window.Terminal = Terminal;
window.TerminalManager = TerminalManager;
window.terminalManager = terminalManager;
window.simulateTokenValidation = simulateTokenValidation;
window.simulateMessageSending = simulateMessageSending;
window.handleTerminalCommand = handleTerminalCommand;
