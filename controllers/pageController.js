const getHomePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

const getAuthPage = (req, res) => {
  res.render('auth', { title: 'Auth System - Login & Register' });
};

const getDashboardPage = (req, res) => {
  res.render('dashboard', { title: 'Dashboard - Auth System' });
};

const getUsersPage = (req, res) => {
  res.render('users', { title: 'User Management - Admin Panel' });
};

export { getHomePage, getAuthPage, getDashboardPage, getUsersPage };
