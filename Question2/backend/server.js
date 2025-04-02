const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const AUTH_CREDENTIALS = {
  email: "satyamswain227@gmail.com",
  name: "satyam subham swain",
  rollNo: "22053543",
  accessCode: "nwpwrZ",
  clientID: "fc93bb31-d389-4c66-a93d-87b28e681f96",
  clientSecret: "KZJbMwdmTWCZJshg"
};

let authToken = '';
let userPostCounts = {};
let allPosts = [];

async function getAuthToken() {
  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/auth',
      AUTH_CREDENTIALS
    );
    authToken = response.data['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzMDA4LCJpYXQiOjE3NDM2MDI3MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZjOTNiYjMxLWQzODktNGM2Ni1hOTNkLTg3YjI4ZTY4MWY5NiIsInN1YiI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSIsIm5hbWUiOiJzYXR5YW0gc3ViaGFtIHN3YWluIiwicm9sbE5vIjoiMjIwNTM1NDMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJmYzkzYmIzMS1kMzg5LTRjNjYtYTkzZC04N2IyOGU2ODFmOTYiLCJjbGllbnRTZWNyZXQiOiJLWkpiTXdkbVRXQ1pKc2hnIn0.Y4GXu__Ts-JzNcYEKa6_dJI9CIHE2HNlj2VOFA_96xs']; 
    console.log('Authentication successful');
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

async function initializeData() {
  try {
    await getAuthToken();
    
    const config = {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzMDA4LCJpYXQiOjE3NDM2MDI3MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZjOTNiYjMxLWQzODktNGM2Ni1hOTNkLTg3YjI4ZTY4MWY5NiIsInN1YiI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSIsIm5hbWUiOiJzYXR5YW0gc3ViaGFtIHN3YWluIiwicm9sbE5vIjoiMjIwNTM1NDMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJmYzkzYmIzMS1kMzg5LTRjNjYtYTkzZC04N2IyOGU2ODFmOTYiLCJjbGllbnRTZWNyZXQiOiJLWkpiTXdkbVRXQ1pKc2hnIn0.Y4GXu__Ts-JzNcYEKa6_dJI9CIHE2HNlj2VOFA_96xs`
      }
    };

    const usersResponse = await axios.get(
      'http://20.244.56.144/evaluation-service/users',
      config
    );
    const users = usersResponse.data.users;
    
    for (const userId in users) {
      userPostCounts[userId] = 0;
    }
    
    for (const userId in users) {
      const postsResponse = await axios.get(
        `http://20.244.56.144/evaluation-service/users/${userId}/posts`,
        config
      );
      const posts = postsResponse.data.posts;
      
      userPostCounts[userId] = posts.length;
      
      for (const post of posts) {
        const commentsResponse = await axios.get(
          `http://20.244.56.144/evaluation-service/posts/${post.id}/comments`,
          config
        );
        post.commentCount = commentsResponse.data.comments.length;
        post.timestamp = new Date();
        allPosts.push(post);
      }
    }
    
    allPosts.sort((a, b) => b.timestamp - a.timestamp);
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

initializeData();


app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});