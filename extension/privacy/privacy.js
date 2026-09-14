

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
    /\b(?:\d[ -]?){13,19}\b/g;


// API keys / secret tokens
const apiKeyRegex =
    /\b(?:sk-|pk-|api[_-]?key[_-]?)[A-Za-z0-9_-]{16,}\b/gi;


// Aadhaar-like 12 digit number
// Requires proper 4-4-4 grouping and prevents
// matching the first 12 digits of a longer card number.
const aadhaarRegex =
    /(?<!\d)\d{4}[ -]\d{4}[ -]\d{4}(?![ -]?\d)/g;


// =========================
// TEXT SANITIZATION
// =========================

export function sanitizeText(text) {

    if (!text || typeof text !== "string") {
        return text;
    }

    let sanitized = text;


    // =========================
    // EMAIL
    // =========================

    sanitized = sanitized.replace(
        emailRegex,
        "[EMAIL]"
    );


    // =========================
    // PHONE
    // =========================

    sanitized = sanitized.replace(
        phoneRegex,
        "[PHONE]"
    );


    // =========================
    // API KEYS
    // =========================

    sanitized = sanitized.replace(
        apiKeyRegex,
        "[API_KEY]"
    );


    // =========================
    // CARD
    // IMPORTANT:
    // CARD MUST BE DETECTED BEFORE
    // AADHAAR TO AVOID OVERLAP
    // =========================

    sanitized = sanitized.replace(
        cardRegex,
        "[CARD]"
    );


    // =========================
    // AADHAAR / GOVERNMENT ID
    // =========================

    sanitized = sanitized.replace(
        aadhaarRegex,
        "[GOV_ID]"
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

        console.log(
            "🔐 PASSWORD FIELD DETECTED"
        );

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

        console.log(
            "📧 EMAIL FIELD DETECTED"
        );

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

        console.log(
            "📱 PHONE FIELD DETECTED"
        );

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

        console.log(
            "💳 CARD FIELD DETECTED"
        );

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

        console.log(
            "🔒 CARD SECURITY CODE FIELD DETECTED"
        );

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

        console.log(
            "🪪 GOVERNMENT ID FIELD DETECTED"
        );

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

        console.log(
            "🏦 BANK INFORMATION FIELD DETECTED"
        );

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

        console.log(
            "🔑 API KEY / TOKEN FIELD DETECTED"
        );

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

        console.log(
            "📍 ADDRESS FIELD DETECTED"
        );

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


// =========================
// PRIVACY TEST
// =========================

console.log(
    "🧪 PRIVACY TEST START"
);


console.log(
    "EMAIL:",
    sanitizeText(
        "Contact me at test@example.com"
    )
);


console.log(
    "PHONE:",
    sanitizeText(
        "Call +91 9876543210"
    )
);


console.log(
    "AADHAAR:",
    sanitizeText(
        "ID: 1234 5678 9012"
    )
);


console.log(
    "CARD:",
    sanitizeText(
        "Card: 4111 1111 1111 1111"
    )
);


console.log(
    "🧪 PRIVACY TEST END"
);

