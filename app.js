// Retirement Income Calculator JavaScript - Fixed Version

// Global variable to store calculator instance
let calculator = null;

// Simple debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

class RetirementCalculator {
    constructor() {
        console.log('Initializing RetirementCalculator...');
        this.initialized = false;
        this.init();
    }
    
    init() {
        try {
            this.getElements();
            this.attachEventListeners();
            this.performInitialCalculation();
            this.initialized = true;
            console.log('RetirementCalculator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize calculator:', error);
        }
    }
    
    getElements() {
        // Get all input elements with validation
        this.inputs = {};
        const inputIds = ['currentAge', 'retirementAge', 'currentIncome', 'currentSavings', 
                         'monthlySavings', 'preRetirementReturn', 'postRetirementReturn', 
                         'inflationRate', 'replacementRatio'];
        
        inputIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.inputs[id] = element;
                console.log(`Found input element: ${id}`);
            } else {
                console.error(`Input element not found: ${id}`);
            }
        });
        
        // Get all result display elements
        this.results = {};
        const resultIds = ['totalSavings', 'annualIncome', 'monthlyIncome', 'replacementPercentage',
                          'statusBadge', 'goalDescription', 'savingsRate', 'scenario1', 'scenario2'];
        
        resultIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.results[id] = element;
                console.log(`Found result element: ${id}`);
            } else {
                console.error(`Result element not found: ${id}`);
            }
        });
    }
    
    attachEventListeners() {
        console.log('Attaching event listeners...');
        
        // Create debounced calculation function
        this.debouncedCalculate = debounce(() => {
            this.calculateAndUpdate();
        }, 100);
        
        // Attach listeners to each input
        Object.keys(this.inputs).forEach(key => {
            const input = this.inputs[key];
            if (input) {
                // Remove any existing listeners first
                input.removeEventListener('input', this.handleInputChange);
                input.removeEventListener('change', this.handleInputChange);
                input.removeEventListener('keyup', this.handleInputChange);
                
                // Bind the handler to maintain context
                const boundHandler = (e) => {
                    console.log(`Input changed: ${key} = ${e.target.value}`);
                    this.debouncedCalculate();
                };
                
                // Add multiple event types for comprehensive coverage
                input.addEventListener('input', boundHandler);
                input.addEventListener('change', boundHandler);
                input.addEventListener('keyup', boundHandler);
                input.addEventListener('paste', () => {
                    setTimeout(boundHandler, 10);
                });
                
                // Improve input field behavior
                input.addEventListener('focus', function() {
                    setTimeout(() => {
                        this.select();
                    }, 10);
                });
                
                console.log(`Event listeners attached to: ${key}`);
            }
        });
        
        console.log('All event listeners attached');
    }
    
    getInputValue(key, defaultValue = 0) {
        const input = this.inputs[key];
        if (!input) {
            console.warn(`Input not found: ${key}, using default: ${defaultValue}`);
            return defaultValue;
        }
        
        const value = parseFloat(input.value);
        const result = isNaN(value) ? defaultValue : Math.max(0, value);
        console.log(`Input value for ${key}: ${input.value} -> ${result}`);
        return result;
    }
    
    getFormData() {
        const data = {
            currentAge: this.getInputValue('currentAge', 35),
            retirementAge: this.getInputValue('retirementAge', 65),
            currentIncome: this.getInputValue('currentIncome', 75000),
            currentSavings: this.getInputValue('currentSavings', 100000),
            monthlySavings: this.getInputValue('monthlySavings', 1000),
            preRetirementReturn: this.getInputValue('preRetirementReturn', 7),
            postRetirementReturn: this.getInputValue('postRetirementReturn', 4),
            inflationRate: this.getInputValue('inflationRate', 2.5),
            replacementRatio: this.getInputValue('replacementRatio', 80)
        };
        
        console.log('Current form data:', data);
        return data;
    }
    
    calculateFutureValue(presentValue, monthlyPayment, annualRate, years) {
        if (years <= 0) return presentValue;
        
        const monthlyRate = annualRate / 100 / 12;
        const numPayments = years * 12;
        
        if (monthlyRate === 0) {
            return presentValue + (monthlyPayment * numPayments);
        }
        
        // Future value of present value
        const futureValuePV = presentValue * Math.pow(1 + monthlyRate, numPayments);
        
        // Future value of monthly payments (annuity)
        const futureValuePMT = monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
        
        const result = futureValuePV + futureValuePMT;
        console.log(`Future Value Calculation: PV=${presentValue}, PMT=${monthlyPayment}, Rate=${annualRate}%, Years=${years} -> ${result}`);
        return result;
    }
    
    calculateRetirementIncome(data) {
        console.log('Starting retirement income calculation...');
        
        const yearsToRetirement = data.retirementAge - data.currentAge;
        console.log(`Years to retirement: ${yearsToRetirement}`);
        
        if (yearsToRetirement <= 0) {
            return {
                totalSavings: data.currentSavings,
                annualIncome: data.currentSavings * 0.04,
                monthlyIncome: (data.currentSavings * 0.04) / 12,
                replacementPercentage: data.currentIncome > 0 ? ((data.currentSavings * 0.04) / data.currentIncome) * 100 : 0,
                savingsRate: data.currentIncome > 0 ? (data.monthlySavings * 12 / data.currentIncome) * 100 : 0,
                status: 'error',
                statusMessage: 'Retirement age must be greater than current age'
            };
        }
        
        // Calculate future value of retirement savings
        const totalSavings = this.calculateFutureValue(
            data.currentSavings,
            data.monthlySavings,
            data.preRetirementReturn,
            yearsToRetirement
        );
        
        // Calculate annual income using 4% withdrawal rule
        const annualIncome = totalSavings * 0.04;
        const monthlyIncome = annualIncome / 12;
        
        // Calculate income replacement percentage
        const replacementPercentage = data.currentIncome > 0 ? (annualIncome / data.currentIncome) * 100 : 0;
        
        // Calculate savings rate
        const savingsRate = data.currentIncome > 0 ? (data.monthlySavings * 12 / data.currentIncome) * 100 : 0;
        
        // Determine goal status
        let status, statusMessage;
        if (replacementPercentage >= data.replacementRatio) {
            status = 'on-track';
            statusMessage = 'You\'re on track to meet your retirement goals!';
        } else if (replacementPercentage >= data.replacementRatio * 0.75) {
            status = 'caution';
            statusMessage = 'You\'re close to your goal but may need to save more.';
        } else {
            status = 'behind';
            statusMessage = 'Consider increasing your savings to meet your retirement goals.';
        }
        
        const results = {
            totalSavings,
            annualIncome,
            monthlyIncome,
            replacementPercentage,
            savingsRate,
            status,
            statusMessage
        };
        
        console.log('Calculation results:', results);
        return results;
    }
    
    calculateScenarios(data) {
        const yearsToRetirement = data.retirementAge - data.currentAge;
        
        if (yearsToRetirement <= 0) {
            return { scenario1: 0, scenario2: 0 };
        }
        
        // Current projected income
        const currentProjectedSavings = this.calculateFutureValue(
            data.currentSavings,
            data.monthlySavings,
            data.preRetirementReturn,
            yearsToRetirement
        );
        const currentProjectedIncome = currentProjectedSavings * 0.04;
        
        // Scenario 1: Increase monthly savings by $500
        const scenario1Savings = this.calculateFutureValue(
            data.currentSavings,
            data.monthlySavings + 500,
            data.preRetirementReturn,
            yearsToRetirement
        );
        const scenario1Income = scenario1Savings * 0.04;
        const scenario1Benefit = scenario1Income - currentProjectedIncome;
        
        // Scenario 2: Retire 2 years later
        const scenario2Savings = this.calculateFutureValue(
            data.currentSavings,
            data.monthlySavings,
            data.preRetirementReturn,
            yearsToRetirement + 2
        );
        const scenario2Income = scenario2Savings * 0.04;
        const scenario2Benefit = scenario2Income - currentProjectedIncome;
        
        return {
            scenario1: Math.max(0, scenario1Benefit),
            scenario2: Math.max(0, scenario2Benefit)
        };
    }
    
    formatCurrency(amount) {
        if (isNaN(amount) || amount < 0) amount = 0;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    formatPercentage(percentage) {
        if (isNaN(percentage) || percentage < 0) percentage = 0;
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(percentage / 100);
    }
    
    updateDisplay(elementKey, value) {
        const element = this.results[elementKey];
        if (element) {
            const oldValue = element.textContent;
            element.textContent = value;
            console.log(`Updated ${elementKey}: ${oldValue} -> ${value}`);
            
            // Add visual feedback for changes
            element.style.transform = 'scale(1.02)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        } else {
            console.error(`Display element not found: ${elementKey}`);
        }
    }
    
    updateResults(results, scenarios) {
        console.log('Updating display with results...');
        
        try {
            // Update main results
            this.updateDisplay('totalSavings', this.formatCurrency(results.totalSavings));
            this.updateDisplay('annualIncome', this.formatCurrency(results.annualIncome));
            this.updateDisplay('monthlyIncome', this.formatCurrency(results.monthlyIncome));
            this.updateDisplay('replacementPercentage', this.formatPercentage(results.replacementPercentage));
            this.updateDisplay('savingsRate', this.formatPercentage(results.savingsRate));
            
            // Update status badge
            const statusBadge = this.results.statusBadge;
            if (statusBadge) {
                statusBadge.classList.remove('status--on-track', 'status--caution', 'status--behind', 'status--error');
                statusBadge.classList.add(`status--${results.status}`);
                
                const statusText = {
                    'on-track': 'On Track',
                    'caution': 'Caution', 
                    'behind': 'Behind Goal',
                    'error': 'Check Inputs'
                }[results.status] || 'Calculating...';
                
                statusBadge.textContent = statusText;
            }
            
            // Update goal description
            const goalDescription = this.results.goalDescription;
            if (goalDescription) {
                goalDescription.textContent = results.statusMessage;
            }
            
            // Update scenarios
            this.updateDisplay('scenario1', this.formatCurrency(scenarios.scenario1));
            this.updateDisplay('scenario2', this.formatCurrency(scenarios.scenario2));
            
            console.log('All displays updated successfully');
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }
    
    calculateAndUpdate() {
        if (!this.initialized) {
            console.log('Calculator not yet initialized, skipping calculation');
            return;
        }
        
        console.log('=== Starting calculation update ===');
        
        try {
            const data = this.getFormData();
            const results = this.calculateRetirementIncome(data);
            const scenarios = this.calculateScenarios(data);
            
            this.updateResults(results, scenarios);
            
            console.log('=== Calculation update completed ===');
        } catch (error) {
            console.error('Error during calculation update:', error);
            
            // Show error state
            Object.keys(this.results).forEach(key => {
                const element = this.results[key];
                if (element && !element.classList.contains('status')) {
                    element.textContent = 'Error';
                }
            });
        }
    }
    
    performInitialCalculation() {
        console.log('Performing initial calculation...');
        setTimeout(() => {
            this.calculateAndUpdate();
        }, 250);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing retirement calculator...');
    
    // Wait for elements to be fully rendered
    setTimeout(() => {
        try {
            calculator = new RetirementCalculator();
            
            // Make calculator globally accessible for debugging
            window.retirementCalculator = calculator;
            
            console.log('Retirement Calculator is ready!');
        } catch (error) {
            console.error('Failed to initialize retirement calculator:', error);
        }
    }, 100);
});

// Additional safety net for late initialization
window.addEventListener('load', function() {
    if (!calculator) {
        console.log('Backup initialization triggered...');
        setTimeout(() => {
            if (!calculator) {
                calculator = new RetirementCalculator();
                window.retirementCalculator = calculator;
            }
        }, 200);
    }
});