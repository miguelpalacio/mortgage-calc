function onCalculateMortgage() {
	if (!isFormValid()) {
		return;
	}

	const result = {
		principleAndInterest: 0,
		tax: 0,
		insurance: 0,
		totalPayment: 0
	};

	calculatePrincipleAndInterest(result);
	calculateTax(result);
	calculateInsurance(result);
	calculateMonthlyPayment(result);

	updateResultLabels(result);
	darkenResultValueLabels();
	renameCalculateButton();
}

// -------------------------------------
// Validity of entered values
// -------------------------------------

function isFormValid() {
	let formIsValid = true;

	formIsValid = highlightCurrencyInputErrors(formIsValid, 'loanAmount');
	formIsValid = highlightCurrencyInputErrors(formIsValid, 'annualTax');
	formIsValid = highlightCurrencyInputErrors(formIsValid, 'annualInsurance');

	return formIsValid;
}

function highlightCurrencyInputErrors (formIsValid, fieldId) {
	const $fieldElem = document.getElementById(fieldId);
	const $fieldElemError = document.getElementById(fieldId + 'Error');

	if ($fieldElem.value.length === 0 || $fieldElem.value === '.') {
		// Invalid input
		$fieldElem.classList.add('error');
		$fieldElemError.classList.remove('field-error-hidden');
		formIsValid = false;
	} else {
		// Valid input
		$fieldElem.classList.remove('error');
		$fieldElemError.classList.add('field-error-hidden');
	}
	
	return formIsValid;
}

// Do not allow non-numeric characters (only allow ONE '.' for decimals)
function validateCurrencyInput(textField, event) {
	// Workaround for IE's lack of "String.includes" support
	let pointPresent = false;
	const value = textField.value;
	for (let i = 0, l = value.length; i < l; i++) {
		if (value.charAt(i) === '.') {
			pointPresent = true;
			break;
		}
	}

	if ((event.charCode === 46 && pointPresent) ||
		(event.charCode !== 46 && (event.charCode < 48 || event.charCode > 57))) {
		event.preventDefault();
	}
}

// -------------------------------------
// Calculations
// -------------------------------------

function calculatePrincipleAndInterest (result) {
	const rateOfInterest = Number(document.getElementById('rateOfInterest').value);
	const loanAmount = Number(document.getElementById('loanAmount').value);
	const yearsOfMortgage = Number(document.getElementById('yearsOfMortage').value);

	result.principleAndInterest = ((rateOfInterest / 100) / 12) * loanAmount /
		(1 - Math.pow(1 + ((rateOfInterest / 100) / 12), -yearsOfMortgage * 12));
}

function calculateTax (result) {
	const annualTax = Number(document.getElementById('annualTax').value);

	result.tax = annualTax / 12;
}

function calculateInsurance (result) {
	const annualInsurance = Number(document.getElementById('annualInsurance').value);

	result.insurance = annualInsurance / 12;
}

function calculateMonthlyPayment (result) {
	result.totalPayment = result.principleAndInterest + result.tax + result.insurance;
}

// -------------------------------------
// Update labels in calculator-results
// -------------------------------------

function updateResultLabels (result) {
	for (const key in result) {
		const $label = document.getElementById(key + 'Label');
		const value = result[key];

		const valueHasDecimals = value !== parseInt(value);

		$label.innerHTML = '$ ' + (valueHasDecimals ? value.toFixed(2) : value);
	}
}

// -------------------------------------
// Misc
// -------------------------------------

// Live updates of text fields beside the sliders
function updateSliderTextField(slider, value) {
	$textField = slider.nextElementSibling.nextElementSibling;
	$textField.value = value;
}

function renameCalculateButton() {
	document.getElementById('calculateButton').value = 'RECALCULATE';
}

// Remove opacity property of result-label elements
function darkenResultValueLabels() {
	$resultValueElems = document.getElementsByClassName('result-value');
	for (let i = 0, l = $resultValueElems.length; i < l; i++) {
		const elem = $resultValueElems.item(i);
		elem.classList.remove('no-value');
	}
}