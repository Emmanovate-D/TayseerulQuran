// User Roles
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TUTOR: 'tutor',
  STAFF: 'staff',
  STUDENT: 'student'
};

// Permissions
const PERMISSIONS = {
  // Course Management
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',
  VIEW_COURSE: 'view_course',
  
  // User Management
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_USER: 'view_user',
  
  // Student Management
  CREATE_STUDENT: 'create_student',
  EDIT_STUDENT: 'edit_student',
  DELETE_STUDENT: 'delete_student',
  VIEW_STUDENT: 'view_student',
  ASSIGN_STUDENT: 'assign_student',
  
  // Tutor Management
  CREATE_TUTOR: 'create_tutor',
  EDIT_TUTOR: 'edit_tutor',
  DELETE_TUTOR: 'delete_tutor',
  VIEW_TUTOR: 'view_tutor',
  APPROVE_TUTOR: 'approve_tutor',
  
  // Blog Management
  CREATE_BLOG: 'create_blog',
  EDIT_BLOG: 'edit_blog',
  DELETE_BLOG: 'delete_blog',
  VIEW_BLOG: 'view_blog',
  
  // Payment Management
  VIEW_PAYMENT: 'view_payment',
  PROCESS_PAYMENT: 'process_payment',
  
  // Role & Permission Management
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
  ASSIGN_ROLES: 'assign_roles',
  
  // Content Management
  MANAGE_CONTENT: 'manage_content',
  
  // Reports
  VIEW_REPORTS: 'view_reports'
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Response Messages
const MESSAGES = {
  SUCCESS: 'Operation successful',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
};

module.exports = {
  ROLES,
  PERMISSIONS,
  HTTP_STATUS,
  MESSAGES
};

