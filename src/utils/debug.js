const debug = (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔍 ${message}`);
    if (data) {
        console.log('Data:', JSON.stringify(data, null, 2));
    }
};

const debugError = (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${message}`);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
};

module.exports = { debug, debugError };
