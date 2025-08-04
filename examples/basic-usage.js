const { Limitly } = require('../dist/index.js');

// Initialize the SDK
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY || 'your_limitly_api_key'
});

async function main() {
  try {
    // Validate a request
    console.log('Validating request...');
    const result = await limitly.validation.validate(
      'user_api_key_here',
      '/api/users',
      'GET'
    );

    if (result.success) {
      console.log('✅ Request allowed');
      console.log('Current usage:', result.details?.current_usage);
      console.log('Limit:', result.details?.limit);
    } else {
      console.log('❌ Request denied:', result.error);
    }

    // List API Keys
    console.log('\nListing API Keys...');
    const keys = await limitly.apiKeys.list();
    console.log('API Keys:', keys.data?.length || 0, 'found');

    // Create a new API Key
    console.log('\nCreating new API Key...');
    const newKey = await limitly.apiKeys.create({
      name: 'Test API Key',
      user_id: 123
    });
    console.log('New API Key created:', newKey.data?.api_key);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 