document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const userList = document.getElementById('user-list');
    const addCourseForm = document.getElementById('add-course-form');
    const addUserForm = document.getElementById('add-user-form');
  
    const fetchData = async (url, container, templateFunction) => {
      const response = await fetch(url);
      const data = await response.json();
  
      container.innerHTML = '';
      data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = templateFunction(item);
        container.appendChild(listItem);
      });
    };
  
    const fetchCourses = async () => {
      await fetchData('/courses', courseList, courseTemplate);
    };
  
    const fetchUsers = async () => {
      await fetchData('/users', userList, userTemplate);
    };
  
    const courseTemplate = (course) => {
      return `${course.title} - ${course.instructor}: ${course.description} (Price: ${course.price})`;
    };
  
    const userTemplate = (user) => {
      return `${user.username} - ${user.email}`;
    };
  
    addCourseForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.getElementById('course-title').value;
      const instructor = document.getElementById('course-instructor').value;
      const description = document.getElementById('course-description').value;
      const price = document.getElementById('course-price').value;
  
      await fetch('/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, instructor, description, price }),
      });
  
      fetchCourses();
    });
  
    addUserForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      fetchUsers();
    });
  
    fetchCourses();
    fetchUsers();
  });
  