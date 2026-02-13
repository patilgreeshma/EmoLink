import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
    try {
        console.log('--- 1. Register User ---');
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                lifeStage: 'Early Career'
            })
        });
        const registerData = await registerRes.json();
        console.log('Status:', registerRes.status);
        console.log('Response:', registerData);

        if (!registerData.token) {
            console.error('Registration failed, stopping tests.');
            return;
        }

        const token = registerData.token;
        const userId = registerData._id;

        console.log('\n--- 2. Get User Profile (Protected Route) ---');
        const profileRes = await fetch(`${API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const profileData = await profileRes.json();
        console.log('Status:', profileRes.status);
        console.log('Response:', profileData);

        console.log('\n--- 3. Create Post (Protected Route) ---');
        const postRes = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'This is a test post about growth!',
                growthTags: ['Learning', 'Coding']
            })
        });
        const postData = await postRes.json();
        console.log('Status:', postRes.status);
        console.log('Response:', postData);

    } catch (error) {
        console.error('Error running tests:', error);
    }
};

runTests();
