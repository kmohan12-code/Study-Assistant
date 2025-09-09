// Global state
let selectedFile = null;
let isUploading = false;
let isTyping = false;
let messages = [];

// DOM elements
const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const dragDropArea = document.getElementById('dragDropArea');
const fileDisplayContainer = document.getElementById('fileDisplayContainer');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileButton = document.getElementById('removeFileButton');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
// --- ERROR FIX: Changed 'chatMessages' to 'message-content' to match the new HTML ---
const chatMessages = document.getElementById('message-content'); 
const welcomeMessage = document.getElementById('welcomeMessage');
const typingIndicator = document.getElementById('typingIndicator');
const particlesContainer = document.getElementById('particlesContainer');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    setupEventListeners();
    setupCustomScrollbar(); // Added the function to power the custom scrollbar
    updateChatState();
});

// Create floating particles
function initializeParticles() {
    for (let i = 0; i < 9; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${(i + 1) * 10}%`;
        particle.style.animationDelay = `${i}s`;
        particlesContainer.appendChild(particle);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // File upload events
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    removeFileButton.addEventListener('click', handleFileRemove);

    // Drag and drop events
    dragDropArea.addEventListener('click', () => {
        if (!selectedFile) fileInput.click();
    });
    dragDropArea.addEventListener('dragenter', handleDragEnter);
    dragDropArea.addEventListener('dragover', handleDragOver);
    dragDropArea.addEventListener('dragleave', handleDragLeave);
    dragDropArea.addEventListener('drop', handleDrop);

    // Chat events
    chatInput.addEventListener('input', updateSendButton);
    chatInput.addEventListener('keypress', handleKeyPress);
    sendButton.addEventListener('click', handleSendMessage);

    // Sample question buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('sample-question-btn')) {
            const question = e.target.getAttribute('data-question');
            if (isChatEnabled()) {
                chatInput.value = question;
                updateSendButton();
            }
        }
    });
}

// --- NEW: All logic for the custom scrollbar ---
function setupCustomScrollbar() {
    const content = document.getElementById('message-content');
    const track = document.getElementById('custom-scrollbar-track');
    const thumb = document.getElementById('custom-scrollbar-thumb');

    // Add a check to ensure elements exist before proceeding
    if (!content || !track || !thumb) {
        console.error("Custom scrollbar elements not found. Aborting setup.");
        return;
    }

    let isDragging = false;
    let startY;
    let startScrollTop;

    const updateThumb = () => {
        const scrollableHeight = content.scrollHeight - content.clientHeight;
        if (scrollableHeight <= 0) {
            track.style.display = 'none';
            return;
        }
        track.style.display = 'block';

        const thumbHeight = Math.max((content.clientHeight / content.scrollHeight) * track.clientHeight, 20);
        thumb.style.height = `${thumbHeight}px`;

        const thumbPosition = (content.scrollTop / scrollableHeight) * (track.clientHeight - thumbHeight);
        thumb.style.top = `${thumbPosition}px`;
    };

    content.addEventListener('scroll', updateThumb);

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = content.scrollTop;
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        const trackHeight = track.clientHeight;
        const thumbHeight = thumb.clientHeight;
        const scrollRatio = (content.scrollHeight - content.clientHeight) / (trackHeight - thumbHeight);
        content.scrollTop = startScrollTop + (deltaY * scrollRatio);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
    
    window.addEventListener('resize', updateThumb);
    
    // Use a MutationObserver to update the scrollbar when new messages are added
    const observer = new MutationObserver(updateThumb);
    observer.observe(content, { childList: true, subtree: true });

    updateThumb();
}


// File handling functions
function handleFileSelect(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        selectFile(files[0]);
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.add('drag-active');
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.remove('drag-active');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.remove('drag-active');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        selectFile(files[0]);
    }
}

function selectFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    dragDropArea.classList.add('hidden');
    fileDisplayContainer.classList.remove('hidden');
    
    startUpload();
    updateChatState();
}

function handleFileRemove() {
    selectedFile = null;
    isUploading = false;
    
    fileDisplayContainer.classList.add('hidden');
    dragDropArea.classList.remove('hidden');
    uploadProgress.classList.add('hidden');
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    
    fileInput.value = '';
    
    clearMessages();
    updateChatState();
}

function startUpload() {
    if (!selectedFile) return;
    isUploading = true;
    uploadProgress.classList.remove('hidden');
    updateChatState();

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            sendFileToServer(selectedFile);
        }
        
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
    }, 200);
}

async function sendFileToServer(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/upload_pdf/", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        
    } catch (error) {
        console.error("Error uploading file. Make sure the server is running.");
    } finally {
        isUploading = false;
        uploadProgress.classList.add('hidden');
        updateChatState();
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Chat functions
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

function handleSendMessage() {
    const message = chatInput.value.trim();
    if (message && isChatEnabled()) {
        addUserMessage(message);
        chatInput.value = '';
        updateSendButton();
        
        askQuestionToServer(message);
    }
}

function addUserMessage(content) {
    const messageId = Date.now().toString();
    const message = {
        id: messageId,
        content: content,
        isUser: true,
        timestamp: new Date()
    };
    
    messages.push(message);
    renderMessage(message);
    
    if (welcomeMessage.style.display !== 'none') {
        welcomeMessage.style.display = 'none';
    }
}

function addAIMessage(content) {
    const messageId = Date.now().toString();
    const message = {
        id: messageId,
        content: content,
        isUser: false,
        timestamp: new Date()
    };
    
    messages.push(message);
    renderMessage(message);
}

function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.setAttribute('data-testid', `message-${message.isUser ? 'user' : 'ai'}-${message.id}`);
    
    if (message.isUser) {
        messageElement.classList.add('user-message');
        messageElement.innerHTML = `
            <div class="user-message-bubble">
                <p>${escapeHtml(message.content)}</p>
            </div>
        `;
    } else {
        messageElement.classList.add('ai-message');
        messageElement.innerHTML = `
            <div class="ai-avatar-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <div class="ai-message-bubble">
                <p>${escapeHtml(message.content)}</p>
            </div>
        `;
    }
    
    // Append the new message, but exclude the typing indicator from being a "message"
    const contentArea = typingIndicator.parentNode;
    contentArea.insertBefore(messageElement, typingIndicator);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function askQuestionToServer(question) {
    if (!selectedFile) return;

    showTypingIndicator();

    const formData = new FormData();
    formData.append("question", question);

    try {
        const response = await fetch("http://127.0.0.1:8000/ask/", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        addAIMessage(data.answer || "Sorry, I couldn't find an answer.");
    } catch (error) {
        addAIMessage("Error: Could not get a response from the server.");
    } finally {
        hideTypingIndicator();
    }
}

function showTypingIndicator() {
    isTyping = true;
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.classList.add('hidden');
}

function clearMessages() {
    messages = [];
    // Remove all previous message elements
    const existingMessages = chatMessages.querySelectorAll('.chat-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Make the welcome message visible again
    welcomeMessage.style.display = 'flex';
}

function updateChatState() {
    const enabled = isChatEnabled();
    
    chatInput.disabled = !enabled;
    sendButton.disabled = !enabled || !chatInput.value.trim();
    
    chatInput.placeholder = enabled 
        ? "Ask a question about your document..."
        : "Upload a document first...";
    
    const sampleButtons = document.querySelectorAll('.sample-question-btn');
    sampleButtons.forEach(btn => {
        btn.disabled = !enabled;
    });
}

function updateSendButton() {
    sendButton.disabled = !isChatEnabled() || !chatInput.value.trim();
}

function isChatEnabled() {
    return selectedFile && !isUploading;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

