(function () {
    var modal = document.getElementById('cancel-modal');
    var openBtn = document.getElementById('cancel-btn');
    var closeBtn = document.getElementById('modal-close');
    var cancelBtn = document.getElementById('modal-cancel');
    var submitBtn = document.getElementById('modal-submit');
    var reasonBox = document.getElementById('cancel-reason');

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        reasonBox.value = '';
        reasonBox.focus();
    }
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', async function () {
            var reason = reasonBox.value.trim();
            var orderId = openBtn ? openBtn.dataset.id : '';

            if (!reason) {
                reasonBox.classList.add('border', 'border-red-400');
                reasonBox.placeholder = 'Please enter a reason before submitting';
                return;
            }
            reasonBox.classList.remove('border', 'border-red-400');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing…';

                var res = await axios.post('/user/orders/' + orderId + '/cancel', { reason: reason });

                closeModal();

                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Cancelled',
                        text: res.data.message || 'Your order has been cancelled.',
                        confirmButtonColor: '#8B1A1A',
                    }).then(function () { window.location.reload(); });
                } else {
                    Swal.fire({ icon: 'error', title: 'Failed', text: res.data.message || 'Could not cancel order.', confirmButtonColor: '#8B1A1A' });
                }
            } catch (err) {
                closeModal();
                var msg = err.response && err.response.data && err.response.data.message
                    ? err.response.data.message : 'Something went wrong.';
                Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#8B1A1A' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        });
    }

    // ============================================
    // RETURN MODAL LOGIC
    // ============================================
    var returnModal = document.getElementById('return-order-modal');
    var openRetBtn = document.getElementById('return-btn');
    var closeRetBtn = document.getElementById('return-modal-close');
    var cancelRetBtn = document.getElementById('return-modal-cancel');
    var submitRetBtn = document.getElementById('return-modal-submit');

    var reasonSelect = document.getElementById('return-reason-select');
    var returnComm = document.getElementById('return-comment');
    var reasonErr = document.getElementById('reason-error');

    function openReturnModal() {
        returnModal.classList.remove('hidden');
        returnModal.classList.add('flex');
        reasonSelect.value = "";
        returnComm.value = "";
        reasonErr.classList.add('hidden');
    }

    function closeReturnModal() {
        returnModal.classList.add('hidden');
        returnModal.classList.remove('flex');
    }

    if (openRetBtn) openRetBtn.addEventListener('click', openReturnModal);
    if (closeRetBtn) closeRetBtn.addEventListener('click', closeReturnModal);
    if (cancelRetBtn) cancelRetBtn.addEventListener('click', closeReturnModal);

    returnModal.addEventListener('click', function (e) {
        if (e.target === returnModal) closeReturnModal();
    });

    if (submitRetBtn) {
        submitRetBtn.addEventListener('click', async function () {
            var reasonCode = reasonSelect.value;
            var commentText = returnComm.value.trim();
            var orderId = openRetBtn ? openRetBtn.dataset.id : '';

            if (!reasonCode) {
                reasonErr.classList.remove('hidden');
                return;
            } else {
                reasonErr.classList.add('hidden');
            }

            try {
                submitRetBtn.disabled = true;
                submitRetBtn.textContent = 'Processing...';

                var res = await axios.post('/user/orders/' + orderId + '/return', {
                    reason: reasonCode,
                    comments: commentText
                });

                closeReturnModal();

                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Return Requested',
                        text: 'Your return has been requested. Our team will review it shortly.',
                        confirmButtonColor: '#8B1A1A',
                    }).then(function () { window.location.reload(); });
                } else {
                    Swal.fire({ icon: 'error', title: 'Failed', text: res.data.message, confirmButtonColor: '#8B1A1A' });
                }
            } catch (err) {
                closeReturnModal();
                var msg = err.response && err.response.data && err.response.data.message
                    ? err.response.data.message : 'Something went wrong.';
                Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#8B1A1A' });
            } finally {
                submitRetBtn.disabled = false;
                submitRetBtn.textContent = 'Request Refund';
            }
        });
    }

})();