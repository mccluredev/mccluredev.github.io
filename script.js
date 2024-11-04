let currentPage = 0;

function nextPage(page) {
    const pages = document.querySelectorAll('.form-page');
    pages[currentPage].style.display = 'none';
    currentPage++;
    if (currentPage < pages.length) {
        pages[currentPage].style.display = 'block';
    } else {
        calculatePayment();
    }
}

function toggleTimeInBusiness() {
    const established = document.getElementById('business-established').value;
    const container = document.getElementById('time-in-business-container');
    container.style.display = established === 'Yes' ? 'block' : 'none';
}

function toggleOtherExpertise() {
    const expertise = document.getElementById('expertise').value;
    const container = document.getElementById('other-expertise-container');
    container.style.display = expertise === 'Other' ? 'block' : 'none';
}

function calculatePayment() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value.replace(/[^0-9.-]+/g, ""));
    const creditScore = parseInt(document.getElementById('credit-score').value);
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value.replace(/[^0-9.-]+/g, ""));
    const monthlyDebt = parseFloat(document.getElementById('monthly-debt').value.replace(/[^0-9.-]+/g, ""));
    
    // Calculate DTI
    const dti = (monthlyDebt / monthlyIncome) * 100;

    // Determine Interest Rate and Approval
    let approvedAmount = 0;
    let interestRate = 0;
    
    // Implement your criteria logic here based on the criteria provided in the prompt
    // This is just a placeholder for the interest rate logic.
    if (loanAmount <= 10000) {
        if (creditScore < 640 || dti > 45) approvedAmount = 0;
        else {
            approvedAmount = loanAmount;
            interestRate = 0.1899;
        }
    } else if (loanAmount <= 75000) {
        if (creditScore < 640 || dti > 42) approvedAmount = 0;
        else {
            approvedAmount = loanAmount;
            interestRate = 0.1799;
        }
    } else if (loanAmount <= 150000) {
        if (creditScore < 680 || dti > 42) approvedAmount = 0;
        else {
            approvedAmount = loanAmount;
            interestRate = 0.1699;
        }
    } else {
        approvedAmount = 0; // Declined
    }

    if (approvedAmount > 0) {
        const termYears = parseInt(document.getElementById('term-slider').value);
        const monthlyRate = interestRate / 12; // Monthly interest rate
        const totalPayments = termYears * 12;
        const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));

        document.getElementById('approved-amount').textContent = approvedAmount.toFixed(2);
        document.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
    } else {
        alert('Your application has been declined based on the provided criteria.');
        return;
    }

    // Show the loading page
    const loadingPage = document.getElementById('loading-page');
    loadingPage.style.display = 'block';
    
    // Hide all other pages
    const pages = document.querySelectorAll('.form-page');
    for (let page of pages) {
        if (page !== loadingPage) {
            page.style.display = 'none';
        }
    }

    // Move to the result page after 5 seconds
    setTimeout(() => {
        loadingPage.style.display = 'none';
        document.getElementById('result-page').style.display = 'block';
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Format currency for input fields
function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.-]+/g, "");
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update payment on term slider change
document.getElementById('term-slider').addEventListener('input', function() {
    document.getElementById('term-display').textContent = this.value;
    calculatePayment();
});
