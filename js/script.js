function onCalculateMortgage() {
	if (!isFormValid()) {
		return;
	}

	renameCalculateButton();
	darkenResultValueLabels();
}

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
		$fieldElem.classList.add('error');
		$fieldElemError.classList.remove('field-error-hidden');
		formIsValid = false;
	} else {
		$fieldElem.classList.remove('error');
		$fieldElemError.classList.add('field-error-hidden');
	}
	
	return formIsValid;
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

// Live updates of text fields beside the sliders
function updateSliderTextField(slider, value) {
	$textField = slider.nextElementSibling.nextElementSibling;
	$textField.value = value;
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