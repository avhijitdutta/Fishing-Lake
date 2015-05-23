app.filter("customCurrency", function (numberFilter) {
    function isNumeric(value) {
        return (!isNaN(parseFloat(value)) && isFinite(value));
    }

    return function (inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits) {
        if (isNumeric(inputNumber)) {
            // Default values for the optional arguments
            currencySymbol = (typeof currencySymbol === "undefined") ? "$" : currencySymbol;
            decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
            thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
            decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 2 : decimalDigits;

            if (decimalDigits < 0) decimalDigits = 0;

            // Format the input number through the number filter
            // The resulting number will have "," as a thousands separator
            // and "." as a decimal separator.
            var formattedNumber = numberFilter(inputNumber, decimalDigits);

            // Extract the integral and the decimal parts
            var numberParts = formattedNumber.split(".");

            // Replace the "," symbol in the integral part
            // with the specified thousands separator.
            numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);

            // Compose the final result
            var result = currencySymbol + numberParts[0];

            if (numberParts.length == 2) {
                result += decimalSeparator + numberParts[1];
            }

            return result;
        }
        else {
            return inputNumber;
        }
    };
});

app.filter('euro', function () {
    return function (text) {
        text = text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
        var t = text + '<span class="desc">,00</span><span class="cur">€</span>';
        console.log(t)
        return t;
    };
});