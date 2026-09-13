// =========================
// Ms WebPilot Privacy Layer
// =========================

console.log("🔒 PRIVACY MODULE LOADED");


// =========================
// TEXT PATTERNS
// =========================

// Email
const emailRegex =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;


// Indian phone number
const phoneRegex =
    /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g;


// Credit / debit card-like number
const cardRegex =
    /\b(?:\d[ -]*?){13,19}\b/g;


// API keys / secret tokens
const apiKeyRegex =
    /\b(?:sk-|pk-|api[_-]?key[_-]?)[A-Za-z0-9_-]{16,}\b/gi;


// Aadhaar-like 12 digit number
const aadhaarRegex =
    /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;


// =========================
// TEXT SANITIZATION
// =========================

export function sanitizeText(text) {

    if (!text || typeof text !== "string") {
        return text;
    }

    let sanitized = text;

    // Email
    sanitized = sanitized.replace(
        emailRegex,
        "[EMAIL]"
    );

    // Phone
    sanitized = sanitized.replace(
        phoneRegex,
        "[PHONE]"
    );

    // API keys
    sanitized = sanitized.replace(
        apiKeyRegex,
        "[API_KEY]"
    );

    // Aadhaar-like numbers
    sanitized = sanitized.replace(
        aadhaarRegex,
        "[GOV_ID]"
    );

    // Card-like numbers
    sanitized = sanitized.replace(
        cardRegex,
        "[CARD]"
    );

    return sanitized;
}


// =========================
// FIELD NAME HELPERS
// =========================

function containsAny(value, keywords) {

    return keywords.some(
        keyword => value.includes(keyword)
    );
}


// =========================
// INPUT SANITIZATION
// =========================

export function sanitizeInput(element) {

    if (!element) {
        return null;
    }

    const type =
        (element.getAttribute("type") || "")
            .toLowerCase();

    const name =
        (element.getAttribute("name") || "")
            .toLowerCase();

    const id =
        (element.getAttribute("id") || "")
            .toLowerCase();

    const autocomplete =
        (element.getAttribute("autocomplete") || "")
            .toLowerCase();

    const placeholder =
        (element.getAttribute("placeholder") || "")
            .toLowerCase();


    const fieldInfo =
        `${name} ${id} ${autocomplete} ${placeholder}`;


    // =========================
    // PASSWORD
    // =========================

    if (
        type === "password" ||
        containsAny(fieldInfo, [
            "password",
            "passwd",
            "pwd"
        ])
    ) {
        return "[PASSWORD]";
    }


    // =========================
    // EMAIL
    // =========================

    if (
        type === "email" ||
        autocomplete.includes("email") ||
        containsAny(fieldInfo, [
            "email",
            "e-mail"
        ])
    ) {
        return "[EMAIL]";
    }


    // =========================
    // PHONE
    // =========================

    if (
        type === "tel" ||
        autocomplete.includes("tel") ||
        containsAny(fieldInfo, [
            "phone",
            "mobile",
            "telephone",
            "contact"
        ])
    ) {
        return "[PHONE]";
    }


    // =========================
    // CARD
    // =========================

    if (
        autocomplete.includes("cc-number") ||
        containsAny(fieldInfo, [
            "cardnumber",
            "card-number",
            "creditcard",
            "credit-card",
            "debitcard",
            "debit-card",
            "cc-number"
        ])
    ) {
        return "[CARD]";
    }


    // =========================
    // CARD SECURITY CODE
    // =========================

    if (
        autocomplete.includes("cc-csc") ||
        containsAny(fieldInfo, [
            "cvv",
            "cvc",
            "securitycode",
            "security-code",
            "cc-csc"
        ])
    ) {
        return "[CARD_SECURITY_CODE]";
    }


    // =========================
    // GOVERNMENT ID
    // =========================

    if (
        containsAny(fieldInfo, [
            "aadhaar",
            "aadhar",
            "passport",
            "driverlicense",
            "driver-license",
            "drivinglicense",
            "driving-license",
            "license-number",
            "licensenumber",
            "national-id",
            "nationalid",
            "government-id",
            "governmentid",
            "govt-id",
            "govtid"
        ])
    ) {
        return "[GOV_ID]";
    }


    // =========================
    // BANK INFORMATION
    // =========================

    if (
        containsAny(fieldInfo, [
            "bankaccount",
            "bank-account",
            "accountnumber",
            "account-number",
            "ifsc",
            "iban",
            "swift"
        ])
    ) {
        return "[BANK_INFO]";
    }


    // =========================
    // API KEY / TOKEN
    // =========================

    if (
        containsAny(fieldInfo, [
            "apikey",
            "api-key",
            "access-token",
            "accesstoken",
            "auth-token",
            "authtoken",
            "secret-key",
            "secretkey",
            "token"
        ])
    ) {
        return "[API_KEY]";
    }


    // =========================
    // ADDRESS
    // =========================

    if (
        autocomplete.includes("street-address") ||
        containsAny(fieldInfo, [
            "address",
            "street",
            "postalcode",
            "postal-code",
            "zipcode",
            "zip-code",
            "pincode",
            "pin-code"
        ])
    ) {
        return "[ADDRESS]";
    }


    // =========================
    // NORMAL FIELD
    // =========================

    return sanitizeText(
        element.value ||
        element.textContent ||
        ""
    );
}