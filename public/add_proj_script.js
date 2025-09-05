// Add Project Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');
    const briefTextarea = document.getElementById('brief');
    const wordCountDisplay = document.getElementById('briefWordCount');
    const imageInput = document.getElementById('images');
    const imagePreview = document.getElementById('imagePreview');
    const fileUpload = document.querySelector('.file-upload');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');
    
    let selectedFiles = [];

    // Word count for brief description
    briefTextarea.addEventListener('input', updateWordCount);
    
    function updateWordCount() {
        const text = briefTextarea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const maxWords = 100;
        
        wordCountDisplay.textContent = `${words}/${maxWords} words`;
        
        if (words > maxWords) {
            wordCountDisplay.classList.add('warning');
            // Trim to max words
            const trimmedText = text.split(/\s+/).slice(0, maxWords).join(' ');
            briefTextarea.value = trimmedText;
            wordCountDisplay.textContent = `${maxWords}/${maxWords} words`;
        } else {
            wordCountDisplay.classList.remove('warning');
        }
    }

    // File upload handling
    imageInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop functionality
    fileUpload.addEventListener('dragover', handleDragOver);
    fileUpload.addEventListener('dragleave', handleDragLeave);
    fileUpload.addEventListener('drop', handleDrop);

    function handleDragOver(e) {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        addFiles(imageFiles);
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        addFiles(files);
    }

    function addFiles(files) {
        files.forEach(file => {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showToast(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
                return;
            }

            // Avoid duplicates
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                return;
            }

            selectedFiles.push(file);
            createImagePreview(file);
        });
    }

    function createImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="removeImage('${file.name}', ${file.size})">×</button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }

    // Remove image function (global scope)
    window.removeImage = function(fileName, fileSize) {
        selectedFiles = selectedFiles.filter(f => !(f.name === fileName && f.size === fileSize));
        
        // Remove preview item
        const previewItems = imagePreview.querySelectorAll('.preview-item');
        previewItems.forEach(item => {
            const img = item.querySelector('img');
            const removeBtn = item.querySelector('.remove-image');
            if (removeBtn.onclick.toString().includes(fileName)) {
                item.remove();
            }
        });
    };

    // Form submission
    form.addEventListener('submit', handleSubmit);

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Creating Project...';

        try {
            const formData = new FormData();
            
            // Add form fields
            formData.append('theme', document.getElementById('theme').value);
            formData.append('name', document.getElementById('name').value);
            formData.append('duration', document.getElementById('duration').value);
            formData.append('location', document.getElementById('location').value);
            formData.append('brief', document.getElementById('brief').value);
            formData.append('details', document.getElementById('details').value);
            formData.append('info', document.getElementById('info').value);
            formData.append('owner', getCurrentUserId());

            // Add selected images
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch('/api/projects/add', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showToast('✅ Project created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create project');
            }

        } catch (error) {
            console.error('Error creating project:', error);
            showToast(`❌ Error: ${error.message}`, 'error');
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    function getCurrentUserId() {
        // For now, return a placeholder. In a real app, this would come from authentication
        return localStorage.getItem('userId') || 'user-' + Date.now();
    }

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Initialize word count
    updateWordCount();

    // Auto-save form data to localStorage (optional enhancement)
    const formFields = ['theme', 'name', 'duration', 'location', 'brief', 'details', 'info'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        // Load saved data
        const savedValue = localStorage.getItem(`projectForm_${fieldId}`);
        if (savedValue && !field.value) {
            field.value = savedValue;
        }
        
        // Save data on change
        field.addEventListener('input', () => {
            localStorage.setItem(`projectForm_${fieldId}`, field.value);
        });
    });

    // Clear saved data on successful submission
    window.addEventListener('beforeunload', () => {
        if (form.dataset.submitted === 'true') {
            formFields.forEach(fieldId => {
                localStorage.removeItem(`projectForm_${fieldId}`);
            });
        }
    });
});

// Enhanced form validation
function validateForm() {
    const requiredFields = [
        { id: 'theme', name: 'Project Theme' },
        { id: 'name', name: 'Project Name' },
        { id: 'duration', name: 'Duration' },
        { id: 'location', name: 'Location' },
        { id: 'brief', name: 'Brief Description' },
        { id: 'details', name: 'Detailed Description' }
    ];

    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showToast(`❌ Please fill in ${field.name}`, 'error');
            element.focus();
            return false;
        }
    }

    // Validate brief description word count
    const brief = document.getElementById('brief').value.trim();
    const wordCount = brief.split(/\s+/).length;
    if (wordCount > 100) {
        showToast('❌ Brief description must be 100 words or less', 'error');
        document.getElementById('brief').focus();
        return false;
    }

    return true;
}

// Add real-time validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#4caf50';
            } else {
                this.style.borderColor = '#d32f2f';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === '#d32f2f' && this.value.trim()) {
                this.style.borderColor = '#2e7d32';
            }
        });
    });
});
