(function () {
    var modal = document.getElementById('cancel-modal');
    var closeBtn = document.getElementById('modal-close');
    var cancelBtn = document.getElementById('modal-cancel');
    var submitBtn = document.getElementById('modal-submit');
    var reasonBox = document.getElementById('cancel-reason');

    let currentOrderId = null;
    let currentItemId = null;

    function openModal(orderId, itemId) {
        currentOrderId = orderId;
        currentItemId = itemId;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        reasonBox.value = '';
        reasonBox.focus();
    }
    
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    const cancelItemBtns = document.querySelectorAll('.cancel-item-btn');
    cancelItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openModal(this.dataset.orderId, this.dataset.itemId);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Submit Cancel
    if (submitBtn) {
        submitBtn.addEventListener('click', async function () {
            var reason = reasonBox.value.trim();

            if (!reason) {
                reasonBox.classList.add('border', 'border-red-400');
                reasonBox.placeholder = 'Please enter a reason before submitting';
                return;
            }
            reasonBox.classList.remove('border', 'border-red-400');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing…';

                var res = await axios.post('/user/orders/' + currentOrderId + '/cancel', { itemId: currentItemId, reason: reason });

                closeModal();

                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Item Cancelled',
                        text: res.data.message || 'Your item has been cancelled.',
                        confirmButtonColor: '#8B1A1A',
                    }).then(function () { window.location.reload(); });
                } else {
                    Swal.fire({ icon: 'error', title: 'Failed', text: res.data.message || 'Could not cancel item.', confirmButtonColor: '#8B1A1A' });
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
    var closeRetBtn = document.getElementById('return-modal-close');
    var cancelRetBtn = document.getElementById('return-modal-cancel');
    var submitRetBtn = document.getElementById('return-modal-submit');

    var reasonSelect = document.getElementById('return-reason-select');
    var returnComm = document.getElementById('return-comment');
    var reasonErr = document.getElementById('reason-error');

    function openReturnModal(orderId, itemId) {
        currentOrderId = orderId;
        currentItemId = itemId;
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

    const returnItemBtns = document.querySelectorAll('.return-item-btn');
    returnItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openReturnModal(this.dataset.orderId, this.dataset.itemId);
        });
    });

    if (closeRetBtn) closeRetBtn.addEventListener('click', closeReturnModal);
    if (cancelRetBtn) cancelRetBtn.addEventListener('click', closeReturnModal);

    returnModal.addEventListener('click', function (e) {
        if (e.target === returnModal) closeReturnModal();
    });

    if (submitRetBtn) {
        submitRetBtn.addEventListener('click', async function () {
            var reasonCode = reasonSelect.value;
            var commentText = returnComm.value.trim();

            if (!reasonCode) {
                reasonErr.classList.remove('hidden');
                return;
            } else {
                reasonErr.classList.add('hidden');
            }

            try {
                submitRetBtn.disabled = true;
                submitRetBtn.textContent = 'Processing...';

                var res = await axios.post('/user/orders/' + currentOrderId + '/return', {
                    itemId: currentItemId,
                    reason: reasonCode,
                    comments: commentText
                });

                closeReturnModal();

                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Return Requested',
                        text: 'Your item return has been requested. Our team will review it shortly.',
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

    // ============================================
    // INVOICE DOWNLOAD LOGIC
    // ============================================
    const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
    if (downloadInvoiceBtn) {
        downloadInvoiceBtn.addEventListener('click', function () {
            try {
                const order = window.orderData;
                if (!order) return;

                downloadInvoiceBtn.disabled = true;
                downloadInvoiceBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // Colors and Styling
                const crimson = [139, 26, 26]; // #8B1A1A

                // Header
                doc.setFontSize(22);
                doc.setTextColor(...crimson);
                doc.text("STYLO FASHION", 14, 20);
                
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("Fashion Street, Cyber Plaza, Calicut, 670001", 14, 28);
                doc.text("Email: support@stylofashion.com", 14, 33);

                // Horizontal Line
                doc.setDrawColor(...crimson);
                doc.setLineWidth(0.5);
                doc.line(14, 38, 196, 38);

                // Invoice Info
                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.setFont("helvetica", "bold");
                doc.text("INVOICE", 14, 48);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text(`Order ID: ${order.orderId || order._id}`, 14, 55);
                doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 60);
                doc.text(`Payment: ${order.paymentMethod}`, 14, 65);

                // Shipping Address
                doc.setFont("helvetica", "bold");
                doc.text("Billed To:", 120, 48);
                doc.setFont("helvetica", "normal");
                doc.text(order.shippingAddress.fullName, 120, 55);
                doc.text(order.shippingAddress.addressLine, 120, 60);
                doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 120, 65);
                doc.text(`Pincode: ${order.shippingAddress.pincode}`, 120, 70);

                // Table
                const tableColumn = ["Product", "Price", "Qty", "Subtotal"];
                const tableRows = [];

                order.items.forEach(item => {
                    const rowData = [
                        item.name + (item.size ? ` (Size: ${item.size})` : ""),
                        `INR ${item.price.toFixed(2)}`,
                        item.quantity,
                        `INR ${(item.price * item.quantity).toFixed(2)}`
                    ];
                    tableRows.push(rowData);
                });

                doc.autoTable({
                    startY: 80,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'striped',
                    headStyles: { fillColor: crimson },
                    margin: { top: 10 },
                });

                // Summary
                const finalY = doc.lastAutoTable.finalY + 10;
                doc.setFont("helvetica", "bold");
                doc.text(`Total Amount: INR ${order.totalAmount.toFixed(2)}`, 140, finalY);
                doc.text(`Shipping: INR ${order.shippingAmount.toFixed(2)}`, 140, finalY + 7);
                doc.setFontSize(12);
                doc.text(`Final Amount: INR ${order.finalAmount.toFixed(2)}`, 140, finalY + 15);

                // Footer
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.text("Thank you for shopping with us!", 14, finalY + 30);

                doc.save(`Invoice_${order.orderId || order._id}.pdf`);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Invoice downloaded successfully!',
                    confirmButtonColor: '#8B1A1A',
                });

            } catch (error) {
                console.error("PDF generation error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to generate PDF invoice.',
                    confirmButtonColor: '#8B1A1A',
                });
            } finally {
                downloadInvoiceBtn.disabled = false;
                downloadInvoiceBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download Invoice';
            }
        });
    }

})();