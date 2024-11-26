import '../style.css';

// Core calculator state
interface CalculatorState {
    currentDisplay: string; // What the user sees on the screen
    computationString: string; // What gets evaluated in the computation engine
    lastNumber: string | null; // Tracks the last number entered by the user
    lastResult: number | null;
    shouldStartFresh: boolean; // Indicates whether a new input should overwrite the current display or append to it
    isSecondFunctionActive: boolean;
    isRadianMode: boolean;
}

const state: CalculatorState = {
    currentDisplay: '',
    computationString: '',
    lastNumber: null,
    lastResult: null,
    shouldStartFresh: true,
    isSecondFunctionActive: false,
    isRadianMode: true
};

// UI Elements
const UI = {
    result: document.querySelector('.result') as HTMLElement,
    operations: document.querySelector('.operations') as HTMLElement,
    buttonContainer: document.querySelector('.buttons-container') as HTMLElement
};

// Button Type Definitions
interface CalculatorButton {
    value: string;
    type: 'number' | 'operator' | 'function' | 'period' | 'paren';
    press: string;
    display?: string;
    secondFnDisplay?: string;
    secondFunction?: string;
    secondFnPress?: string;
    mobile?: boolean
}

// Calculator Layout Configuration
const buttonLayout: CalculatorButton[] = [ 
    // Row 1
    { value: "(", type: 'paren', press: '(', display: '(' },
    { value: ")", type: 'paren', press: ')', display: ')' },
    { value: "mc", type: 'function', press: '', display: 'mc' },
    { value: "m+", type: 'function', press: '', display: 'm+' },
    { value: "m-", type: 'function', press: '', display: 'm-' },
    { value: "mr", type: 'function', press: '', display: 'mr' },
    { value: "AC", type: 'function', press: '', display: 'AC', mobile: true },
    { value: "%", type: 'function', press: '/100', display: '%', mobile: true },
    { value: "+/-", type: 'function', press: 'negate(', display: '-', mobile: true },
    { value: "÷", type: 'operator', press: '/', display: '÷', mobile: true },

    // Row 2
    { value: "2ⁿᵈ", type: 'function', press: '', display: '2ⁿᵈ' },
    { value: "x²", type: 'function', press: '**2', display: '²', secondFunction: "x⁻²", secondFnPress: '**(-2)', secondFnDisplay: '⁻²' },
    { value: "x³", type: 'function', press: '**3', display: '³', secondFunction: "x⁻³", secondFnPress: '**(-3)', secondFnDisplay: '⁻³' },
    { value: "xʸ", type: 'function', press: '**', display: '^', },
    { value: "eˣ", type: 'function', press: 'Math.exp(', display: 'e^(', secondFunction: "yˣ", secondFnPress: '**', secondFnDisplay: '^' },
    { value: "10ˣ", type: 'function', press: '10**', display: '10^', secondFunction: "2ˣ", secondFnPress: '2**', secondFnDisplay: '2^' },
    { value: "7", type: 'number', press: '7', display: '7', mobile: true },
    { value: "8", type: 'number', press: '8', display: '8', mobile: true },
    { value: "9", type: 'number', press: '9', display: '9', mobile: true },
    { value: "×", type: 'operator', press: '*', display: '×', mobile: true },

    // Row 3
    { value: "x⁻¹", type: 'function', press: '**(-1)', display: '⁻¹'},
    { value: "²√x", type: 'function', press: 'Math.sqrt(', display: '√(' },
    { value: "³√x", type: 'function', press: 'Math.cbrt(', display: '∛(' },
    { value: "ʸ√x", type: 'function', press: '**(1/', display: '√' },
    { value: "mod", type: 'function', press: '%', display: '%', secondFunction: "ln", secondFnPress: 'Math.log(', secondFnDisplay: 'ln(' },
    { value: "log₂", type: 'function', press: 'Math.log2(', display: 'log₂(', secondFunction: "log", secondFnPress: 'Math.log10(', secondFnDisplay: 'log(' },
    { value: "4", type: 'number', press: '4', display: '4', mobile: true },
    { value: "5", type: 'number', press: '5', display: '5', mobile: true },
    { value: "6", type: 'number', press: '6', display: '6', mobile: true },
    { value: "−", type: 'operator', press: '-', display: '−', mobile: true },

    // Row 4
    { value: "x!", type: 'function', press: 'factorial(', display: '!' },
    { value: "sin", type: 'function', press: 'Math.sin(', display: 'sin(', secondFunction: "sin⁻¹", secondFnPress: 'Math.asin(', secondFnDisplay: 'sin⁻¹(' },
    { value: "cos", type: 'function', press: 'Math.cos(', display: 'cos(', secondFunction: "cos⁻¹", secondFnPress: 'Math.acos(', secondFnDisplay: 'cos⁻¹(' },
    { value: "tan", type: 'function', press: 'Math.tan(', display: 'tan(', secondFunction: "tan⁻¹", secondFnPress: 'Math.atan(', secondFnDisplay: 'tan⁻¹(' },
    { value: "e", type: 'function', press: 'Math.E', display: 'e' },
    { value: "EE", type: 'function', press: '*10**', display: 'E' },
    { value: "1", type: 'number', press: '1', display: '1', mobile: true },
    { value: "2", type: 'number', press: '2', display: '2', mobile: true },
    { value: "3", type: 'number', press: '3', display: '3', mobile: true },
    { value: "+", type: 'operator', press: '+', display: '+', mobile: true },

    // Row 5
    { value: "sinh", type: 'function', press: 'Math.sinh(', display: 'sinh(', secondFunction: "sinh⁻¹", secondFnPress: 'Math.asinh(', secondFnDisplay: 'sinh⁻¹(' },
    { value: "cosh", type: 'function', press: 'Math.cosh(', display: 'cosh(', secondFunction: "cosh⁻¹", secondFnPress: 'Math.acosh(', secondFnDisplay: 'cosh⁻¹(' },
    { value: "tanh", type: 'function', press: 'Math.tanh(', display: 'tanh(', secondFunction: "tanh⁻¹", secondFnPress: 'Math.atanh(', secondFnDisplay: 'tanh⁻¹(' },
    { value: "π", type: 'function', press: 'Math.PI', display: 'π' },
    { value: "Rad", type: 'function', press: '', display: 'Rad', secondFunction: 'Deg', secondFnDisplay: 'Deg', secondFnPress: 'Deg'},
    { value: "Rand", type: 'function', press: 'Math.random()', display: '' },
    { value: "0", type: 'number', press: '0', display: '0', mobile: true},
    { value: ".", type: 'period', press: '.', display: '.', mobile: true },
    { value: "=", type: 'operator', press: '=', display: '=', mobile: true }
];

// Math Utility Functions
const MathUtils = {
    degToRad: (degrees: number): number => degrees * (Math.PI / 180),
    radToDeg: (radians: number): number => radians * (180 / Math.PI),
    factorial: (n: number): number => {
        // Convert to number if it's a string
        const num = Number(n);
        if (num < 0 || !Number.isInteger(num) || isNaN(num)) return NaN;  // Prevent factorial of negative and non-interger values
        if (num === 0) return 1;
        let result = 1;
        for (let i = num; i >= 1; i--) {
            result *= i;
        }
        return result;
    },
    negate: (n: number): number => -1*n,
    formatNumber: (num: number): string => {
        return Number.isInteger(num) ? num.toString() : Number(num.toPrecision(10)).toString();
    }
};

// Core Calculator Functions
class Calculator {
    static clearAll(): void {
        state.currentDisplay = '';
        state.computationString = '';
        state.lastResult = null;
        state.lastNumber = null;
        state.shouldStartFresh = true;
        updateDisplay();
    }

    static handleRandom(): void {
        const randomNum = Math.random();
        state.currentDisplay = randomNum.toString();
        state.computationString = randomNum.toString();
        state.lastResult = randomNum;
        state.lastNumber = randomNum.toString();
        updateDisplay();
    }
    static handleFactorial(): void {
        if (!state.currentDisplay && !state.lastResult) {
            state.currentDisplay = '0';
            state.computationString = '0';
        }
        
        // Check if the current expression is negative
        const isNegativeExpression = state.currentDisplay.trim().split("")[0]=== '−';
        let currentExpression = isNegativeExpression ? 
            state.currentDisplay.substring(1).trim() : 
            state.currentDisplay.trim();
        
        // Remove any existing factorial symbols
        currentExpression = currentExpression.replace(/!/g, '');
        
        // Construct the expressions
        if (isNegativeExpression) {
            state.currentDisplay = `−${currentExpression}!`; 
            state.computationString = `negate(factorial(${currentExpression}))`;
        } else {
            state.currentDisplay = `${currentExpression}!`;
            state.computationString = `factorial(${currentExpression})`;
        }
        
        state.lastNumber = null;
        updateDisplay();
    }

    static handleNegation(): void {
       const numberToNEgate = state.lastNumber || state.lastResult?.toString() || '0';
       state.currentDisplay = `-(${numberToNEgate})`;
       state.computationString = `negate(${numberToNEgate})`;
       state.lastNumber = null;
       updateDisplay();
    }

    static handleEquals(): void {
        try {

            // If there is no computation string to evaluate, exit the method early.
            if (!state.computationString) return;

            /*
            * Check for any missing parentheses in the computation string.
            * - Parentheses must be balanced for the expression to be valid.
            * - Count the number of opening parentheses '(' and closing parentheses ')'.
            * - If there are more opening parentheses than closing ones, calculate the difference (missingParens).
            * - Append the required number of closing parentheses ')' to the end of the computation string
            *   to balance it.
            */
            const missingParens = (state.computationString.match(/\(/g) || []).length - (state.computationString.match(/\)/g) || []).length;
                        
            // Add the missing closing parentheses to both the computation string and the display.
            if (missingParens > 0) {
                state.computationString += ')'.repeat(missingParens);
                state.currentDisplay += ')'.repeat(missingParens);
            }

            /*
            * Evaluate the computation string.
            * - Use 'evaluateExpression' to parse and calculate the result of the expression.
            * - The result must be a valid number.
            */
            const result = evaluateExpression(state.computationString);
            
            if (!isNaN(result)) {
                // If the result is valid:
                // - Update the last computed result.
                state.lastResult = result;

                // state.currentDisplay = result.toString();

                // - Set the computation string to the result to prepare for the next calculation.
                state.computationString = result.toString();

                // - Update the last number used in the computation (useful for chaining operations).
                state.lastNumber = result.toString();
                            
                // - Set the flag to start fresh for the next input.
                state.shouldStartFresh = true;
            } else {
                handleError();
            }
        } catch (error) {
            console.error('Calculation error:', error);
            handleError();
        }
        updateDisplay();
    }
}

// Display Updates
function updateDisplay(): void {
    if (UI.operations) {
        UI.operations.textContent = state.currentDisplay || '0';
    }
    if (UI.result && state.lastResult !== null) {
        UI.result.textContent = MathUtils.formatNumber(state.lastResult);
    }
}

function handleError(): void {
    state.currentDisplay = 'Error';
    state.computationString = '';
    state.lastResult = null;
    state.lastNumber = null;
}

// Expression Evaluation
function evaluateExpression(expr: string): number {
    // Define a mathematical context to contain constants and functions
    // These are the only operations that will be accessible in the evaluated expression
    const mathContext = {
        // Constants
        E: Math.E,
        PI: Math.PI,
        
        // Basic functions
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        exp: Math.exp,
        log: Math.log,
        log10: Math.log10,
        log2: Math.log2,
        
        // Trigonometric functions
        sin: (x: number) => state.isRadianMode ? Math.sin(x) : Math.sin(MathUtils.degToRad(x)),
        cos: (x: number) => state.isRadianMode ? Math.cos(x) : Math.cos(MathUtils.degToRad(x)),
        tan: (x: number) => state.isRadianMode ? Math.tan(x) : Math.tan(MathUtils.degToRad(x)),
        asin: (x: number) => state.isRadianMode ? Math.asin(x) : MathUtils.radToDeg(Math.asin(x)),
        acos: (x: number) => state.isRadianMode ? Math.acos(x) : MathUtils.radToDeg(Math.acos(x)),
        atan: (x: number) => state.isRadianMode ? Math.atan(x) : MathUtils.radToDeg(Math.atan(x)),
        
        // Hyperbolic functions
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,

        factorial: MathUtils.factorial,
        negate: MathUtils.negate,
          // Custom logarithm function: log base y of x is log(x) / log(y)
        logy: (x: number, y: number): number => {
            return Math.log(x) / Math.log(y);
        }
    };

    try {
        // Preprocess the input expression to align it with the mathContext definitions
        const processedExpr = expr
            // Replace any Math.<function> calls with just <function> to match mathContext keys
            .replace(/Math\.(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|cbrt|log|logy|log10|log2|exp)\(/g, '$1(')
            .replace(/Math\.PI/g, 'PI')
            .replace(/Math\.E/g, 'E')
            .trim();

        // Dynamically create a function to evaluate the expression
        // The function parameters are the keys of mathContext (e.g., 'PI', 'sqrt', etc.)
        // The function body is the expression to be evaluated
        return new Function(
            ...Object.keys(mathContext), // Pass the keys of mathContext as the function arguments
            `"use strict"; return ${processedExpr};`
        )(...Object.values(mathContext));  // Pass the corresponding values of mathContext as arguments
    } catch (error) {
        console.error('Evaluation error:', error);
        return NaN;
    }
}

// Button Creation and Event Handling
function createButtons(): void {
    buttonLayout.forEach((buttonDetail: CalculatorButton) => {
        const button = document.createElement('button');
        button.textContent = buttonDetail.value;
        button.classList.add('button', buttonDetail.type);
        
        if (buttonDetail.type === 'function' && /AC|\+\/-|%/.test(buttonDetail.value)) {
            button.classList.add('special-function');
        }

        if (buttonDetail.mobile) button.classList.add('mobile');
        
        UI.buttonContainer?.appendChild(button);
    });
}

function toggleSecondFunction(): void {
    state.isSecondFunctionActive = !state.isSecondFunctionActive;
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        const buttonDetail = buttonLayout.find(detail => 
            detail.value === button.textContent || 
            detail.secondFunction === button.textContent
        );
        
        if (buttonDetail?.secondFunction) {
            button.textContent = state.isSecondFunctionActive ? 
                buttonDetail.secondFunction : 
                buttonDetail.value;
        }
    });
}

// Drag and Drop Functionality
// Credit: This drag-and-drop functionality was inspired by W3Schools
// Source: https://www.w3schools.com/howto/howto_js_draggable.asp
function enableDragAndDrop(element: HTMLElement): void {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    const header = document.getElementById(element.id + 'header') || element;
    header.onmousedown = startDragging;
    
    function startDragging(e: MouseEvent): void {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = drag;
    }
    
    function drag(e: MouseEvent): void {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + 'px';
        element.style.left = (element.offsetLeft - pos1) + 'px';
    }
    
    function stopDragging(): void {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize Calculator
function initializeCalculator(): void {
    createButtons();
    
    UI.buttonContainer?.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.matches('button')) return;
        
        const buttonText = target.textContent;
        if (!buttonText) return;
        
        const buttonDetail = buttonLayout.find(detail => 
            detail.value === buttonText || 
            detail.secondFunction === buttonText
        );
        
        if (!buttonDetail) return;
        
        handleButtonClick(buttonDetail, target);
    });
    
    enableDragAndDrop(document.querySelector('.wrapper') as HTMLElement);
    updateDisplay();
}

// Handle Button Clicks
function handleButtonClick(buttonDetail: CalculatorButton, button: HTMLElement): void {
    if (buttonDetail.value === '2ⁿᵈ') {
        toggleSecondFunction();
        button.classList.toggle('secondFunctionActive');
        return;
    }

    if (buttonDetail.value === 'Rad' || buttonDetail.value === 'Deg') {
        state.isRadianMode = !state.isRadianMode;
        
        // Update button text to reflect current mode
        if (state.isRadianMode) {
            button.textContent = 'Rad';
        } else {
            button.textContent = 'Deg';
        }
        return;
    }
    
    // Reset display if starting fresh
    if (state.shouldStartFresh && state.lastResult !== null && 
        buttonDetail.type === 'function' && 
        !['m+', 'm-', 'mr', 'mc', 'Rad', 'AC'].includes(buttonDetail.value)) {
        state.currentDisplay = '';
        state.computationString = '';
        state.lastResult = null;
        state.shouldStartFresh = false;
    }
    
    // Handle different button types
    switch (buttonDetail.value) {
        case 'AC':
            Calculator.clearAll();
            break;
        case 'Rand':
            Calculator.handleRandom();
            break;
        case 'x!':
            Calculator.handleFactorial();
            break;
        case '=':
            Calculator.handleEquals();
            break;
        case '+/-':
            Calculator.handleNegation();
            break;
        default:
            handleRegularButton(buttonDetail);
    }
}

function handleRegularButton(buttonDetail: CalculatorButton): void {
    // If the button pressed is an operator, ensure the state does not reset
    if (buttonDetail.type === 'operator') {
        state.shouldStartFresh = false; // Operators do not require clearing the display
    }
    
    // If the button pressed is a number, append its value to the last number 
    if (buttonDetail.type === 'number') {
        state.lastNumber = (state.lastNumber || '') + buttonDetail.value;
    }
    
    const displayValue = state.isSecondFunctionActive && buttonDetail.secondFunction
        ? buttonDetail.secondFnDisplay || buttonDetail.secondFunction
        : buttonDetail.display || buttonDetail.value;
        
    const pressValue = state.isSecondFunctionActive && buttonDetail.secondFunction
        ? buttonDetail.secondFnPress
        : buttonDetail.press;
    
    if (pressValue) {
       
        // Special case: Handle functions like sin, cos, tan, etc., without adding multiplication, this essentially allows nested functions
        if (buttonDetail.type === 'function' && 
                 ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'log', 'ln'].includes(buttonDetail.value)) {
            // Don't add multiplication if it's a nested function
            state.currentDisplay += displayValue;  
            state.computationString += pressValue;
            updateDisplay();
            return;
        }

        // Special handling for base-x logarithm and exponent functions
        if (['xʸ', 'logᵧ', 'log₂'].includes(buttonDetail.value)) {
            // If the next button is 0, handle it specifically
            if (state.lastNumber === '0') {
                if (buttonDetail.value === 'xʸ') {
                    // For exponents, 0 as base is not meaningful
                    state.currentDisplay += displayValue;
                    state.computationString += pressValue;
                } else if (['logᵧ', 'log₂'].includes(buttonDetail.value)) {
                    // For log functions, 0 as base is not meaningful, so treat as normal input
                    state.currentDisplay += displayValue;
                    state.computationString += pressValue;
                }
                state.lastNumber = null;
                updateDisplay();
                return;
            }
        }
        
        // Default case: Append both the display and computation values
        state.currentDisplay += displayValue;
        state.computationString += pressValue;
        updateDisplay();
    }
}
// Start the calculator
initializeCalculator();