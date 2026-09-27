const { ALLOWED_ACTIONS } = require("./actionSchema");

function validateAction(action) {

    if (!action || typeof action !== "object") {
        return {
            valid: false,
            reason: "Action must be an object"
        };
    }

    if (!ALLOWED_ACTIONS.includes(action.action)) {
        return {
            valid: false,
            reason: `Invalid action: ${action.action}`
        };
    }

    if (
        typeof action.confidence !== "number" ||
        action.confidence < 0 ||
        action.confidence > 1
    ) {
        return {
            valid: false,
            reason: "Confidence must be between 0 and 1"
        };
    }

    if (typeof action.target !== "string") {
        return {
            valid: false,
            reason: "Target must be a string"
        };
    }

    if (typeof action.value !== "string") {
        return {
            valid: false,
            reason: "Value must be a string"
        };
    }

    return {
        valid: true,
        action
    };
}

module.exports = {
    validateAction
};