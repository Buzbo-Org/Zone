/**
 * BUZBO Campaign Page Interactive Script
 * Handles Learn More and Waitlist modal interactions, and Formspree AJAX submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Formspree Endpoint Configuration
  // Note: Replace this placeholder with your actual Formspree form ID/URL
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgdrjbb';

  // Elements
  const btnHeroLearnMore = document.getElementById('btn-hero-learn-more');
  const btnHeroJoinWaitlist = document.getElementById('btn-hero-join-waitlist');
  const btnModalJoinWaitlist = document.getElementById('btn-modal-join-waitlist');
  
  const learnMoreModal = document.getElementById('learn-more-modal');
  const btnCloseLearnMore = document.getElementById('btn-close-learn-more');
  
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
  
  // Learn More Modal Controls
  function openLearnMoreModal() {
    if (learnMoreModal) {
      learnMoreModal.classList.add('active');
      learnMoreModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock back scroll
    }
  }

  function closeLearnMoreModal() {
    if (learnMoreModal) {
      learnMoreModal.classList.remove('active');
      learnMoreModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Release scroll
    }
  }

  // Waitlist Modal Controls
  function openWaitlistModal() {
    if (waitlistModal) {
      waitlistModal.classList.add('active');
      waitlistModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock back scroll
      
      // Auto-focus on name field
      setTimeout(() => {
        if (inputName) inputName.focus();
      }, 100);
    }
  }

  function closeWaitlistModal() {
    if (waitlistModal) {
      waitlistModal.classList.remove('active');
      waitlistModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Release scroll
      
      setTimeout(() => {
        resetFormState();
      }, 300);
    }
  }

  function resetFormState() {
    if (formWaitlist) {
      formWaitlist.reset();
      formWaitlist.classList.remove('hidden');
    }
    if (statusSuccess) statusSuccess.classList.add('hidden');
    if (statusError) statusError.classList.add('hidden');
    if (btnSubmitWaitlist) {
      btnSubmitWaitlist.disabled = false;
      btnSubmitWaitlist.textContent = 'Submit';
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Learn More Trigger
  if (btnHeroLearnMore) {
    btnHeroLearnMore.addEventListener('click', openLearnMoreModal);
  }

  if (btnCloseLearnMore) {
    btnCloseLearnMore.addEventListener('click', closeLearnMoreModal);
  }

  if (learnMoreModal) {
    learnMoreModal.addEventListener('click', (event) => {
      if (event.target === learnMoreModal) {
        closeLearnMoreModal();
      }
    });
  }

  // Waitlist Trigger from Hero
  if (btnHeroJoinWaitlist) {
    btnHeroJoinWaitlist.addEventListener('click', openWaitlistModal);
  }

  // Waitlist Trigger from inside Learn More modal
  if (btnModalJoinWaitlist) {
    btnModalJoinWaitlist.addEventListener('click', () => {
      closeLearnMoreModal();
      // Wait for Learn More modal transition to finish before opening waitlist form
      setTimeout(() => {
        openWaitlistModal();
      }, 300);
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeWaitlistModal);
  }

  if (waitlistModal) {
    waitlistModal.addEventListener('click', (event) => {
      if (event.target === waitlistModal) {
        closeWaitlistModal();
      }
    });
  }

  // Escape key closes any active modal
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (waitlistModal && waitlistModal.classList.contains('active')) {
        closeWaitlistModal();
      }
      if (learnMoreModal && learnMoreModal.classList.contains('active')) {
        closeLearnMoreModal();
      }
    }
  });

  if (btnRetryForm) {
    btnRetryForm.addEventListener('click', (e) => {
      e.preventDefault();
      if (statusError) statusError.classList.add('hidden');
      if (formWaitlist) formWaitlist.classList.remove('hidden');
    });
  }

  // Keyboard accessibility modal focus trap
  const trapFocus = (modalEl) => {
    modalEl.addEventListener('keydown', (e) => {
      const focusableElements = modalEl.querySelectorAll('input, button, a');
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
  };

  if (learnMoreModal) trapFocus(learnMoreModal);
  if (waitlistModal) trapFocus(waitlistModal);

  // ==========================================================================
  // Formspree Form Submission (AJAX)
  // ==========================================================================
  if (formWaitlist) {
    formWaitlist.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (btnSubmitWaitlist) {
        btnSubmitWaitlist.disabled = true;
        btnSubmitWaitlist.textContent = 'Submitting...';
      }

      const nameValue = inputName ? inputName.value.trim() : '';
      const emailValue = inputEmail ? inputEmail.value.trim() : '';

      if (!nameValue || !emailValue) {
        showError('Please fill in all required fields.');
        return;
      }

      // Prepare JSON payload
      const payload = {
        name: nameValue,
        email: emailValue
      };

      try {
        // Simulation fallback for local testing
        if (FORMSPREE_ENDPOINT.includes('YOUR_ENDPOINT_HERE')) {
          console.warn('Simulated Formspree post with data:', payload);
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
  }

  function showSuccess() {
    if (formWaitlist) formWaitlist.classList.add('hidden');
    if (statusError) statusError.classList.add('hidden');
    if (statusSuccess) statusSuccess.classList.remove('hidden');
  }

  function showError(msg) {
    if (btnSubmitWaitlist) {
      btnSubmitWaitlist.disabled = false;
      btnSubmitWaitlist.textContent = 'Submit';
    }
    if (formWaitlist) formWaitlist.classList.add('hidden');
    if (statusSuccess) statusSuccess.classList.add('hidden');
    if (errorMessageText) errorMessageText.textContent = msg;
    if (statusError) statusError.classList.remove('hidden');
  }
});
