// Helper func which adds a comma to large numbers (ty stackoverflow)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changePrice(classNames, conversionRate) {
    classNames.forEach(element => {

        console.log(element);
        
        // get all elements by class name
        var prices = document.getElementsByClassName(element);
        console.log(prices.length);
        // for every price with this class name
        for (var i = 0; i < prices.length; i++) {
            var priceHTML = prices[i].innerHTML;

            // Format properly
            priceHTML = priceHTML.replaceAll("\n", ""); // Remove newLines
            priceHTML = priceHTML.replaceAll("\t", ""); // Remove Tabs
            priceHTML = priceHTML.replaceAll("<div class=\"your_price_label\">Your Price:</div><div>", ""); // Remove trash
            priceHTML = priceHTML.replaceAll("</div>", ""); // remove
            priceHTML = priceHTML.replace(".", ""); // remove dot
            priceHTML = priceHTML.replace(",", "."); // replace comma with dot

            var regexRule = new RegExp(/^[0-9]+.[0-9]{2} TL$/);
            if (!regexRule.test(priceHTML)) {
                continue;
            }
            // Convert price and round accordingly (2 dec)
            var price = parseFloat(priceHTML);
            var priceInEUR = Math.round(price * conversionRate * 100) / 100;

            // change in document for this item (will print like: "9.54€ (199.32 TL)" )
            prices[i].innerHTML = priceInEUR.toFixed(2) + "€ " + "(" + numberWithCommas(price.toFixed(2)) + " TL)";
        }
    });
}

function changeBalance(conversionRate) {
    var priceHTML = document.getElementById("header_wallet_balance").innerHTML;

    // Change dec "," to "." 
    priceHTML = priceHTML.replace(".", "X");
    priceHTML = priceHTML.replace(",", ".");
    priceHTML = priceHTML.replace("X", ",");

    // Convert price and round accordingly (2 dec)
    var price = parseFloat(priceHTML);
    var priceInEUR = Math.round(price * conversionRate * 100) / 100;

    // change in document for this item
    document.getElementById("header_wallet_balance").innerHTML = priceInEUR.toFixed(2) + "€ " + "(" + price.toFixed(2) + " TL)";
}

// All the classNames for the divs that contain prices we want to change
var classNames = ["game_purchase_price price", "discount_final_price your_price", "discount_final_price",
    "discount_original_price", "game_area_dlc_price", "salepreviewwidgets_StoreSalePriceBox_Wh0L8"];

// API Call and change for every price in doc
fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/try/eur.json")
    .then(response => {
        return response.json();
    })
    .then(value => {
        // Convert balance (at the top)
        changeBalance(value.eur);
        // Convert prices of above defined class names
        changePrice(classNames, value.eur);
    });