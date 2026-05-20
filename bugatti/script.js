document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Newsletter Mock Subscription
    // ==========================================================================
    const subscribeForm = document.getElementById('bugatti-subscribe-form');
    const subscribeStatus = document.getElementById('subscribe-status');
    const submitBtn = subscribeForm ? subscribeForm.querySelector('.button-primary') : null;

    if (subscribeForm && subscribeStatus) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('subscriber-email');
            const email = emailInput.value.trim();

            if (!email) return;

            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'SUBSCRIBING...';
            }
            subscribeStatus.className = 'subscribe-status-msg';
            subscribeStatus.textContent = '';

            // Simulate server request
            setTimeout(() => {
                subscribeStatus.className = 'subscribe-status-msg success';
                subscribeStatus.textContent = 'THANK YOU FOR SUBSCRIBING.';
                subscribeForm.reset();

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SUBSCRIBE';
                }

                // Fade out confirmation after 4 seconds
                setTimeout(() => {
                    subscribeStatus.textContent = '';
                }, 4000);
            }, 1200);
        });
    }

    // ==========================================================================
    // Top Navigation Drawer Trigger (Simulated)
    // ==========================================================================
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            alert('BUGATTI MENU - Navigation overlay would expand to cover full screen showing heritage timelines, design documents, and configurator links.');
        });
    }

    const storeBtn = document.getElementById('store-btn');
    if (storeBtn) {
        storeBtn.addEventListener('click', () => {
            alert('BUGATTI BOUTIQUE - Redirecting to the lifestyle product store.');
        });
    }

    // ==========================================================================
    // Job Listing Rows Interactivity
    // ==========================================================================
    const careerRows = document.querySelectorAll('.career-listing-row');
    careerRows.forEach(row => {
        row.addEventListener('click', () => {
            const title = row.querySelector('.career-job-title').textContent;
            alert(`Opening application portal for position: ${title}`);
        });
    });
});
