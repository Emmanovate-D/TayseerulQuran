/**
 * API Test Script
 * Run this after starting the server: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🧪 Test 1: Health Check');
  try {
    const result = await makeRequest('GET', '/api/health');
    if (result.status === 200 && result.data.success) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n🧪 Test 2: User Registration');
  try {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    const result = await makeRequest('POST', '/api/auth/register', userData);
    if (result.status === 201 && result.data.success && result.data.data.token) {
      authToken = result.data.data.token;
      console.log('✅ Registration passed');
      console.log('   Token received:', authToken.substring(0, 20) + '...');
      return true;
    } else {
      console.log('❌ Registration failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🧪 Test 3: User Login');
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const result = await makeRequest('POST', '/api/auth/login', loginData);
    if (result.status === 200 && result.data.success && result.data.data.token) {
      authToken = result.data.data.token;
      console.log('✅ Login passed');
      console.log('   Token received:', authToken.substring(0, 20) + '...');
      return true;
    } else {
      console.log('❌ Login failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

async function testGetProfile() {
  console.log('\n🧪 Test 4: Get Profile (Authenticated)');
  if (!authToken) {
    console.log('⚠️  Skipping - No auth token available');
    return false;
  }

  try {
    const result = await makeRequest('GET', '/api/auth/profile', null, authToken);
    if (result.status === 200 && result.data.success) {
      console.log('✅ Get profile passed');
      return true;
    } else {
      console.log('❌ Get profile failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Get profile error:', error.message);
    return false;
  }
}

async function testGetCourses() {
  console.log('\n🧪 Test 5: Get Courses (Public)');
  try {
    const result = await makeRequest('GET', '/api/courses');
    if (result.status === 200 && result.data.success) {
      console.log('✅ Get courses passed');
      return true;
    } else {
      console.log('❌ Get courses failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Get courses error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('📡 Base URL:', BASE_URL);
  console.log('⏳ Make sure the server is running on port 3000\n');

  const results = {
    healthCheck: await testHealthCheck(),
    register: await testRegister(),
    login: await testLogin(),
    getProfile: await testGetProfile(),
    getCourses: await testGetCourses(),
  };

  console.log('\n📊 Test Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Health Check:     ${results.healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Registration:     ${results.register ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login:            ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get Profile:      ${results.getProfile ? '✅ PASS' : '⚠️  SKIP'}`);
  console.log(`Get Courses:      ${results.getCourses ? '✅ PASS' : '❌ FAIL'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.values(results).filter(r => r !== undefined).length;

  console.log(`\n✅ Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check server logs for details.');
  }
}

// Run tests
runTests().catch(console.error);

