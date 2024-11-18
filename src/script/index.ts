import '../style.css';
// let operation: string = "";
let lastNumber: string | null = null;
const resultDisplay: HTMLElement | null = document.querySelector('.result');
const operationsDisplay: HTMLElement | null = document.querySelector('.operations');
let displayOperation: string = "";
let computeOperation: string = "";
const buttonContainer: HTMLElement | null = document.querySelector('.buttons-container');
let lastResult: number | null = null;
let shouldStartFresh: boolean = true;


let isSecondFunctionActive: boolean = false;
let isRadianMode: boolean = true;
// let memory: number = 0;

const degToRad = (degrees: number): number => degrees * (Math.PI / 180);
const radToDeg = (radians: number): number => radians * (180 / Math.PI);

type Button = {
    value: string;
    type: 'number' | 'operator' | 'function' | 'period' | 'paren';
    press: string;
    display?: string;  // How it should appear on screen
    secondFnDisplay?: string;
    secondFunction?: string;
    secondFnPress?: string; 
};

const buttonDetails: Button[] = [
    { value: "(", type: 'paren', press: '(', display: '(' },
    { value: ")", type: 'paren', press: ')', display: ')' },
    { value: "mc", type: 'function', press: '', display: 'mc' },
    { value: "m+", type: 'function', press: '', display: 'm+' },
    { value: "m-", type: 'function', press: '', display: 'm-' },
    { value: "mr", type: 'function', press: '', display: 'mr' },
    { value: "AC", type: 'function', press: '', display: 'AC' },
    { value: "%", type: 'function', press: '/100', display: '%' },
    { value: "+/-", type: 'function', press: '*(-1)', display: '±' },
    { value: "÷", type: 'operator', press: '/', display: '÷' },
    { value: "2ⁿᵈ", type: 'function', press: '', display: '2ⁿᵈ' },
    { value: "x²", type: 'function', press: '**2', display: '²', secondFunction: "x⁻²", secondFnPress: '**(-2)', secondFnDisplay: '⁻²' },
    { value: "x³", type: 'function', press: '**3', display: '³', secondFunction: "x⁻³", secondFnPress: '**(-3)', secondFnDisplay: '⁻³' },
    { value: "xʸ", type: 'function', press: '**', display: '^', secondFunction: "ʸ√x", secondFnPress: '**(1/', secondFnDisplay: '√' },
    { value: "eˣ", type: 'function', press: 'Math.exp(', display: 'e^', secondFunction: "yˣ", secondFnPress: '**', secondFnDisplay: '^' },
    { value: "10ˣ", type: 'function', press: '10**', display: '10^', secondFunction: "2ˣ", secondFnPress: '2**', secondFnDisplay: '2^' },
    { value: "7", type: 'number', press: '7', display: '7' },
    { value: "8", type: 'number', press: '8', display: '8' },
    { value: "9", type: 'number', press: '9', display: '9' },
    { value: "×", type: 'operator', press: '*', display: '×' },
    { value: "x⁻¹", type: 'function', press: '**(-1)', display: '⁻¹', secondFunction: "x", secondFnPress: '', secondFnDisplay: 'x' },
    { value: "²√x", type: 'function', press: 'Math.sqrt(', display: '√' },
    { value: "³√x", type: 'function', press: 'Math.cbrt(', display: '∛' },
    { value: "ʸ√x", type: 'function', press: '**(1/', display: '√' },
    { value: "logᵧ", type: 'function', press: 'Math.log(', display: 'log_', secondFunction: "ln", secondFnPress: 'Math.log(', secondFnDisplay: 'ln(' },
    { value: "log₂", type: 'function', press: 'Math.log2(', display: 'log₂', secondFunction: "log", secondFnPress: 'Math.log10(', secondFnDisplay: 'log' },
    { value: "4", type: 'number', press: '4', display: '4' },
    { value: "5", type: 'number', press: '5', display: '5' },
    { value: "6", type: 'number', press: '6', display: '6' },
    { value: "−", type: 'operator', press: '-', display: '−' },
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

const handleRandom = (): void => {
    const randomNum = Math.random();
    displayOperation = randomNum.toString();
    computeOperation = randomNum.toString();
    lastResult = randomNum;
    lastNumber = randomNum.toString();
    updateDisplays();
};

const handleExponentBase = (buttonDetail: Button) => {
    const baseValue = buttonDetail.value === "eˣ" ? "Math.E" :
                     buttonDetail.value === "10ˣ" ? "10" :
                     buttonDetail.value === "2ˣ" ? "2" : "";
    
    if (baseValue) {
        displayOperation = buttonDetail.display + "(";
        computeOperation = `${baseValue}**(`;
        shouldStartFresh = false;
    }
};

const handleFactorial = () => {
    const numberToFactorial = lastNumber || lastResult?.toString() || "0";
    displayOperation = `${numberToFactorial}!`;
    computeOperation = `factorial(${numberToFactorial})`;
    lastNumber = null;
    updateDisplays();
};


// const memoryFunctions = {
//     mc: () => { memory = 0; },
//     mPlus: () => { 
//         if (lastResult !== null) memory += lastResult; 
//     },
//     mMinus: () => { 
//         if (lastResult !== null) memory -= lastResult; 
//     },
//     mr: () => {
//         displayOperation += memory.toString();
//         computeOperation += memory.toString();
//         updateDisplays();
//     }
// };

const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return Number(num.toPrecision(10)).toString();
};

const clearAll = () => {
    displayOperation = "";
    computeOperation = "";
    lastResult = null;
    updateDisplays();
};

const evaluateExpression = (expr: string): number => {
    try {
        // Create a complete math context with all needed functions
        const mathContext = {
            // Basic Math constants
            E: Math.E,
            PI: Math.PI,
            
            // Basic Math functions
            abs: Math.abs,
            sqrt: Math.sqrt,
            cbrt: Math.cbrt,
            exp: Math.exp,
            log: Math.log,
            log10: Math.log10,
            log2: Math.log2,
            pow: Math.pow,
            random: Math.random,
            
            // Trigonometric functions
            sin: (x: number) => isRadianMode ? Math.sin(x) : Math.sin(degToRad(x)),
            cos: (x: number) => isRadianMode ? Math.cos(x) : Math.cos(degToRad(x)),
            tan: (x: number) => isRadianMode ? Math.tan(x) : Math.tan(degToRad(x)),
            asin: (x: number) => isRadianMode ? Math.asin(x) : radToDeg(Math.asin(x)),
            acos: (x: number) => isRadianMode ? Math.acos(x) : radToDeg(Math.acos(x)),
            atan: (x: number) => isRadianMode ? Math.atan(x) : radToDeg(Math.atan(x)),
            
            // Hyperbolic functions
            sinh: Math.sinh,
            cosh: Math.cosh,
            tanh: Math.tanh,
            asinh: Math.asinh,
            acosh: Math.acosh,
            atanh: Math.atanh,
        };

        const evalContext = {
            Math: mathContext,
            factorial: (n: number): number => {
                if (n < 0) return NaN;
                let res: number = 1;
                for (let i: number = Math.floor(n); i >= 1; i--) {
                    res *= i;
                }
                return res;
            }
        };
        
        // Replace Math.function calls with direct function calls
        const processedExpr = expr
            .replace(/Math\.(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|cbrt|log|log10|log2|exp)\(/g, '$1(')
            .replace(/Math\.PI/g, 'PI')
            .replace(/Math\.E/g, 'E');

        const result = new Function(
            ...Object.keys(mathContext), 
            'factorial',
            `return ${processedExpr}`
        )(
            ...Object.values(mathContext),
            evalContext.factorial
        );
        
        return result;
    } catch (error) {
        console.error('Evaluation error:', error);
        return NaN;
    }
};

// const handleExponentOperation = (buttonDetail: Button) => {
//     if (lastNumber === null && lastResult === null) return;
    
//     const baseNumber = lastNumber || lastResult?.toString() || "";
//     const operation = isSecondFunctionActive && buttonDetail.secondFnPress 
//         ? buttonDetail.secondFnPress 
//         : buttonDetail.press;
        
//     displayOperation =(baseNumber + (buttonDetail.display || buttonDetail.value)).replace(/x/,"");
//     computeOperation = baseNumber + operation;
    
//     lastNumber = null;
//     updateDisplays();
// };

// Create buttons
buttonDetails.forEach((buttonDetail: Button) => {
    const button: HTMLElement = document.createElement("button");
    button.textContent = buttonDetail.value;
    button.classList.add('button');
    button.classList.add('1st-fn');
    
    // Add specific class based on button type
    switch (buttonDetail.type) {
        case 'paren':
            button.classList.add('paren');
            break;
        case 'function':
            if (/AC|\+\/-|%/.test(buttonDetail.value)) {
                button.classList.add('special-function');
            } else {
                button.classList.add('function');
            }
            break;
        case 'operator':
            button.classList.add('operator');
            break;
        case 'period':
            button.classList.add('period');
            break;
        case 'number':
            button.classList.add('number');
            break;
    }
    
    buttonContainer?.appendChild(button);
});

const buttons: NodeListOf<Element> = document.querySelectorAll(".button");

// Toggle second function mode
const toggleSecondFunction = () => {
    isSecondFunctionActive = !isSecondFunctionActive;
    
    buttons.forEach(button => {
        const buttonDetail = buttonDetails.find(detail => 
            detail.value === button.textContent || 
            detail.secondFunction === button.textContent
        );
        
        if (buttonDetail?.secondFunction) {
            button.textContent = isSecondFunctionActive ? 
                buttonDetail.secondFunction : 
                buttonDetail.value;
        }
    });
};

const updateDisplays = () => {
    if (operationsDisplay) {
        operationsDisplay.textContent = displayOperation || "0";
    }
    if (resultDisplay && lastResult !== null) {
        resultDisplay.textContent = formatNumber(lastResult);
    }
};

// Handle button clicks// Handle button clicks
buttonContainer?.addEventListener("click", (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button')) return;
    
    const buttonText = target.textContent;
    if (!buttonText) return;
    
    const buttonDetail = buttonDetails.find(detail => 
        detail.value === buttonText || 
        detail.secondFunction === buttonText
    );
    
    if (!buttonDetail) return;
    
    if (buttonText === "2ⁿᵈ") {
        toggleSecondFunction();
        target.classList.toggle("secondFunctionActive");
        return;
    }
    
    // Check if we should start fresh after last calculation
    if (shouldStartFresh && lastResult !== null && 
        buttonDetail.type === 'function' && 
        !['m+', 'm-', 'mr', 'mc', 'Rad', 'AC'].includes(buttonDetail.value)) {
        displayOperation = "";
        computeOperation = "";
        lastResult = null;
        shouldStartFresh = false;
    }
    
    switch (buttonDetail.value) {
        case "AC":
            clearAll();
            lastNumber = null;
            shouldStartFresh = true;
            break;
            
        case "Rand":
            handleRandom();
            break;
            
        case "x!":
            handleFactorial();
            break;
            
        case "eˣ":
        case "10ˣ":
        case "2ˣ":
            handleExponentBase(buttonDetail);
            break;
            
        case "=":
            try {
                if (computeOperation) {
                    const openParens = (computeOperation.match(/\(/g) || []).length;
                    const closeParens = (computeOperation.match(/\)/g) || []).length;
                    const missingParens = openParens - closeParens;
                    if (missingParens > 0) {
                        computeOperation += ")".repeat(missingParens);
                        displayOperation += ")".repeat(missingParens);
                    }
                    
                    lastResult = evaluateExpression(computeOperation);
                    if (!isNaN(lastResult)) {
                        displayOperation = lastResult.toString();
                        computeOperation = lastResult.toString();
                        lastNumber = lastResult.toString();
                        shouldStartFresh = true;  // Set to start fresh after calculation
                    } else {
                        displayOperation = "Error";
                        computeOperation = "";
                        lastResult = null;
                        lastNumber = null;
                    }
                    updateDisplays();
                }
            } catch (error) {
                console.error('Calculation error:', error);
                displayOperation = "Error";
                computeOperation = "";
                lastResult = null;
                lastNumber = null;
                updateDisplays();
            }
            break;
            
        default:
            // If it's an operator, don't start fresh
            if (buttonDetail.type === 'operator') {
                shouldStartFresh = false;
            }
            
            if (buttonDetail.type === 'number') {
                lastNumber = (lastNumber || "") + buttonDetail.value;
            }
            
            const displayToAdd = isSecondFunctionActive && buttonDetail.secondFunction
                ? buttonDetail.secondFnDisplay || buttonDetail.secondFunction
                : buttonDetail.display || buttonDetail.value;
                
            const pressToAdd = isSecondFunctionActive && buttonDetail.secondFunction
                ? buttonDetail.secondFnPress
                : buttonDetail.press;
                
            if (pressToAdd) {
                displayOperation += displayToAdd;
                computeOperation += pressToAdd;
                updateDisplays();
            }
    }
});
updateDisplays();


// Credit: This drag-and-drop functionality was inspired by W3Schools
// Source: https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt: HTMLElement): void {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
    const header = document.getElementById(elmnt.id + "header");
    if (header) {
      header.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e: MouseEvent) {
      e = e || window.event as MouseEvent; 
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e: MouseEvent) {
      e = e || window.event as MouseEvent;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Update the element's position
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
}
  
dragElement(document.querySelector(".wrapper") as HTMLElement);
  