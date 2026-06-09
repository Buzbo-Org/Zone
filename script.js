/**
 * BUZBO Campaign Page Interactive Script
 * Handles waitlist modal interactions and Formspree AJAX submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Formspree Endpoint Configuration
  // IMPORTANT: Replace this placeholder with your actual Formspree form ID/URL
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_ENDPOINT_HERE';

  // Elements
  const btnJoinWaitlist = document.getElementById('btn-join-waitlist');
  const waitlistModal = document.getElementById('waitlist-modal');
  const modalCloseBtn = document.getElementById('btn-close-modal');
  const formWaitlist = document.getElementById('form-waitlist');
  const inputName = document.getElementById('input-name');
  const inputEmail = document.getElementById('input-email');
  
  const statusSuccess = document.getElementById('status-success');
  const statusError = document.getElementById('status-error');
  const errorMessageText = document.getElementById('error-message-text');
  const btnRetryForm = document.getElementById('btn-retry-form');
  const btnSubmitWaitlist = document.getElementById('btn-submit-waitlist');

  // ==========================================================================
  // Modal Control Functions
  // ==========================================================================
  
  function openModal() {
    waitlistModal.classList.add('active');
    waitlistModal.setAttribute('aria-hidden', 'false');
    // Prevent scrolling behind modal
    document.body.style.overflow = 'hidden';
    
    // Focus on the first input field
    setTimeout(() => {
      inputName.focus();
    }, 100);
  }

  function closeModal() {
    waitlistModal.classList.remove('active');
    waitlistModal.setAttribute('aria-hidden', 'true');
    // Re-enable scrolling
    document.body.style.overflow = '';
    
    // Reset form states after animation completes
    setTimeout(() => {
      resetFormState();
    }, 300);
  }

  function resetFormState() {
    formWaitlist.reset();
    formWaitlist.classList.remove('hidden');
    statusSuccess.classList.add('hidden');
    statusError.classList.add('hidden');
    btnSubmitWaitlist.disabled = false;
    btnSubmitWaitlist.textContent = 'Submit';
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Open modal when Join Waitlist button is clicked
  if (btnJoinWaitlist) {
    btnJoinWaitlist.addEventListener('click', openModal);
  }

  // Close modal with button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking on background overlay
  waitlistModal.addEventListener('click', (event) => {
    if (event.target === waitlistModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && waitlistModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Retry button in error screen
  if (btnRetryForm) {
    btnRetryForm.addEventListener('click', (e) => {
      e.preventDefault();
      statusError.classList.add('hidden');
      formWaitlist.classList.remove('hidden');
    });
  }

  // Accessibility: Trap focus in modal
  waitlistModal.addEventListener('keydown', (e) => {
    const focusableElements = waitlistModal.querySelectorAll('input, button');
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // ==========================================================================
  // Formspree Form Submission (AJAX)
  // ==========================================================================

  formWaitlist.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable button to prevent double submit
    btnSubmitWaitlist.disabled = true;
    btnSubmitWaitlist.textContent = 'Submitting...';

    const nameValue = inputName.value.trim();
    const emailValue = inputEmail.value.trim();

    if (!nameValue || !emailValue) {
      showError('Please fill in all required fields.');
      return;
    }

    const payload = {
      name: nameValue,
      email: emailValue
    };

    try {
      // Simulate submission if Formspree endpoint is still the default placeholder
      if (FORMSPREE_ENDPOINT.includes('YOUR_ENDPOINT_HERE')) {
        console.warn('Using simulated waitlist endpoint. Make sure to replace the placeholder in script.js.');
        setTimeout(() => {
          showSuccess();
        }, 1000);
        return;
      }

      // Send to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showSuccess();
      } else {
        const data = await response.json();
        if (data && data.errors) {
          const errorsMsg = data.errors.map(err => err.message).join(', ');
          showError(errorsMsg || 'Form submission failed.');
        } else {
          showError('There was a problem submitting your form.');
        }
      }
    } catch (err) {
      console.error('Submission Error:', err);
      showError('Network error. Please check your internet connection.');
    }
  });

  function showSuccess() {
    formWaitlist.classList.add('hidden');
    statusError.classList.add('hidden');
    statusSuccess.classList.remove('hidden');
  }

  function showError(msg) {
    btnSubmitWaitlist.disabled = false;
    btnSubmitWaitlist.textContent = 'Submit';
    formWaitlist.classList.add('hidden');
    statusSuccess.classList.add('hidden');
    errorMessageText.textContent = msg;
    statusError.classList.remove('hidden');
  }
});
