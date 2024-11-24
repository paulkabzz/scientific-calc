// Import styles
import '../style.css';

// Core calculator state
interface CalculatorState {
    currentDisplay: string;
    computationString: string;
    lastNumber: string | null;
    lastResult: number | null;
    shouldStartFresh: boolean;
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
    { value: "AC", type: 'function', press: '', display: 'AC' },
    { value: "%", type: 'function', press: '/100', display: '%' },
    { value: "+/-", type: 'function', press: 'negate(', display: '-' },
    { value: "÷", type: 'operator', press: '/', display: '÷' },

    // Row 2
    { value: "2ⁿᵈ", type: 'function', press: '', display: '2ⁿᵈ' },
    { value: "x²", type: 'function', press: '**2', display: '²', secondFunction: "x⁻²", secondFnPress: '**(-2)', secondFnDisplay: '⁻²' },
    { value: "x³", type: 'function', press: '**3', display: '³', secondFunction: "x⁻³", secondFnPress: '**(-3)', secondFnDisplay: '⁻³' },
    { value: "xʸ", type: 'function', press: '**', display: '^', secondFunction: "ʸ√x", secondFnPress: '**(1/', secondFnDisplay: '√' },
    { value: "eˣ", type: 'function', press: 'Math.exp(', display: 'e^(', secondFunction: "yˣ", secondFnPress: '**', secondFnDisplay: '^' },
    { value: "10ˣ", type: 'function', press: '10**', display: '10^', secondFunction: "2ˣ", secondFnPress: '2**', secondFnDisplay: '2^' },
    { value: "7", type: 'number', press: '7', display: '7' },
    { value: "8", type: 'number', press: '8', display: '8' },
    { value: "9", type: 'number', press: '9', display: '9' },
    { value: "×", type: 'operator', press: '*', display: '×' },

    // Row 3
    { value: "x⁻¹", type: 'function', press: '**(-1)', display: '⁻¹', secondFunction: "x", secondFnPress: '', secondFnDisplay: 'x' },
    { value: "²√x", type: 'function', press: 'Math.sqrt(', display: '√(' },
    { value: "³√x", type: 'function', press: 'Math.cbrt(', display: '∛(' },
    { value: "ʸ√x", type: 'function', press: '**(1/', display: '√' },
    { value: "logᵧ", type: 'function', press: 'Math.log(', display: 'log(', secondFunction: "ln", secondFnPress: 'Math.log(', secondFnDisplay: 'ln(' },
    { value: "log₂", type: 'function', press: 'Math.log2(', display: 'log₂(', secondFunction: "log", secondFnPress: 'Math.log10(', secondFnDisplay: 'log(' },
    { value: "4", type: 'number', press: '4', display: '4' },
    { value: "5", type: 'number', press: '5', display: '5' },
    { value: "6", type: 'number', press: '6', display: '6' },
    { value: "−", type: 'operator', press: '-', display: '−' },

    // Row 4
    { value: "x!", type: 'function', press: 'factorial(', display: '!' },
    { value: "sin", type: 'function', press: 'Math.sin(', display: 'sin(', secondFunction: "sin⁻¹", secondFnPress: 'Math.asin(', secondFnDisplay: 'sin⁻¹(' },
    { value: "cos", type: 'function', press: 'Math.cos(', display: 'cos(', secondFunction: "cos⁻¹", secondFnPress: 'Math.acos(', secondFnDisplay: 'cos⁻¹(' },
    { value: "tan", type: 'function', press: 'Math.tan(', display: 'tan(', secondFunction: "tan⁻¹", secondFnPress: 'Math.atan(', secondFnDisplay: 'tan⁻¹(' },
    { value: "e", type: 'function', press: 'Math.E', display: 'e' },
    { value: "EE", type: 'function', press: '*10**', display: 'E' },
    { value: "1", type: 'number', press: '1', display: '1' },
    { value: "2", type: 'number', press: '2', display: '2' },
    { value: "3", type: 'number', press: '3', display: '3' },
    { value: "+", type: 'operator', press: '+', display: '+' },

    // Row 5
    { value: "sinh", type: 'function', press: 'Math.sinh(', display: 'sinh(', secondFunction: "sinh⁻¹", secondFnPress: 'Math.asinh(', secondFnDisplay: 'sinh⁻¹(' },
    { value: "cosh", type: 'function', press: 'Math.cosh(', display: 'cosh(', secondFunction: "cosh⁻¹", secondFnPress: 'Math.acosh(', secondFnDisplay: 'cosh⁻¹(' },
    { value: "tanh", type: 'function', press: 'Math.tanh(', display: 'tanh(', secondFunction: "tanh⁻¹", secondFnPress: 'Math.atanh(', secondFnDisplay: 'tanh⁻¹(' },
    { value: "π", type: 'function', press: 'Math.PI', display: 'π' },
    { value: "Rad", type: 'function', press: '', display: 'Rad', secondFunction: 'Deg', secondFnDisplay: 'Deg', secondFnPress: 'Deg'},
    { value: "Rand", type: 'function', press: 'Math.random()', display: '' },
    { value: "0", type: 'number', press: '0', display: '0' },
    { value: ".", type: 'period', press: '.', display: '.' },
    { value: "=", type: 'operator', press: '=', display: '=' }
];

// Math Utility Functions
const MathUtils = {
    degToRad: (degrees: number): number => degrees * (Math.PI / 180),
    radToDeg: (radians: number): number => radians * (180 / Math.PI),
    factorial: (n: number): number => {
        // Convert to number if it's a string
        const num = Number(n);
        if (isNaN(num)) return NaN;
        if (num < 0) return NaN;  // Prevent factorial of negative numbers
        if (num === 0) return 1;
        let result = 1;
        for (let i = Math.floor(num); i >= 1; i--) {
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
            if (!state.computationString) return;

            // Add missing closing parentheses if needed
            const missingParens = (state.computationString.match(/\(/g) || []).length - 
                                (state.computationString.match(/\)/g) || []).length;
            if (missingParens > 0) {
                state.computationString += ')'.repeat(missingParens);
                state.currentDisplay += ')'.repeat(missingParens);
            }

            const result = evaluateExpression(state.computationString);
            
            if (!isNaN(result)) {
                state.lastResult = result;
                // state.currentDisplay = result.toString();
                state.computationString = result.toString();
                state.lastNumber = result.toString();
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
        negate: MathUtils.negate
    };

    try {
        const processedExpr = expr
            .replace(/Math\.(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|cbrt|log|log10|log2|exp)\(/g, '$1(')
            .replace(/Math\.PI/g, 'PI')
            .replace(/Math\.E/g, 'E')
            .trim();

        return new Function(
            ...Object.keys(mathContext),
            `"use strict"; return ${processedExpr};`
        )(...Object.values(mathContext));
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
    if (buttonDetail.type === 'operator') {
        state.shouldStartFresh = false;
    }
    
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
        // Handle constants (e, π) being pressed multiple times
        if (['e', 'π'].includes(buttonDetail.value) && state.currentDisplay) {
                state.currentDisplay += '×';
                state.computationString += '*';
        }
        
        // Handle nested functions (sin, cos, tan, log, etc.)
        else if (buttonDetail.type === 'function' && 
                 ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'log', 'ln'].includes(buttonDetail.value)) {
            // Don't add multiplication if it's a nested function
            state.currentDisplay += displayValue;
            state.computationString += pressValue;
            updateDisplay();
            return;
        }
        
        state.currentDisplay += displayValue;
        state.computationString += pressValue;
        updateDisplay();
    }
}

// Start the calculator
initializeCalculator();


// f(x) = ln(2-x)^-1 +  sqrt(1+x)

// ln(2-x): x != 2; x != 1 x< 2 -> ln(2-x) != 0 || ln(2-x) > 0
// sqrt(1+x): x >= -1 -> sqrt(1+x) > 0

// xE [-1 ,1) U (1, 2)

