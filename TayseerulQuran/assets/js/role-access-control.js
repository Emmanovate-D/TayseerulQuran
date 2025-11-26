// Role-Based Access Control System
const RoleAccessControl = {
    // Current user role (set on login)
    currentUser: {
        role: 'super_admin', // 'super_admin', 'admin', 'staff'
        permissions: []
    },

    // Permission definitions
    permissions: {
        // Course Management
        'add_course': 'Add New Course',
        'edit_course': 'Edit Existing Course',
        'delete_course': 'Delete Course',
        'view_courses': 'View All Courses',
        
        // Student Management
        'view_students': 'View Students List',
        'view_student_profile': 'View Student Profile',
        'assign_students_to_teachers': 'Assign Students to Teachers',
        'edit_student': 'Edit Student Information',
        'delete_student': 'Delete Student',
        
        // Tutor Management
        'view_tutors': 'View Tutors List',
        'approve_tutor': 'Approve Tutor After Signup',
        'reject_tutor': 'Reject Tutor Application',
        'view_tutor_profile': 'View Tutor Profile',
        'edit_tutor': 'Edit Tutor Information',
        'delete_tutor': 'Delete Tutor',
        
        // Payment Management
        'view_payments': 'View All Payments',
        'export_payments': 'Export Payment Data',
        'refund_payment': 'Process Payment Refund',
        
        // Admin Role Management
        'view_admins': 'View Admins List',
        'create_admin': 'Create New Admin',
        'edit_admin': 'Edit Admin Information',
        'set_admin_roles': 'Set Roles for Admins',
        'assign_permissions': 'Assign Permissions to Admins',
        'delete_admin': 'Delete Admin',
        
        // Blog Management
        'create_blog_post': 'Create Blog Post',
        'edit_blog_post': 'Edit Blog Post',
        'delete_blog_post': 'Delete Blog Post',
        'publish_blog_post': 'Publish Blog Post',
        'view_blog_posts': 'View Blog Posts',
        
        // Content Management
        'edit_homepage_content': 'Edit Homepage Content',
        'edit_about_page': 'Edit About Page',
        'edit_courses_page': 'Edit Courses Page',
        'edit_contact_page': 'Edit Contact Page',
        'edit_footer_content': 'Edit Footer Content',
        'edit_header_content': 'Edit Header Content',
        'view_all_pages': 'View All Pages'
    },

    // Role definitions with default permissions
    rolePermissions: {
        'super_admin': [
            'add_course', 'edit_course', 'delete_course', 'view_courses',
            'view_students', 'view_student_profile', 'assign_students_to_teachers', 'edit_student', 'delete_student',
            'view_tutors', 'approve_tutor', 'reject_tutor', 'view_tutor_profile', 'edit_tutor', 'delete_tutor',
            'view_payments', 'export_payments', 'refund_payment',
            'view_admins', 'create_admin', 'edit_admin', 'set_admin_roles', 'assign_permissions', 'delete_admin',
            'create_blog_post', 'edit_blog_post', 'delete_blog_post', 'publish_blog_post', 'view_blog_posts',
            'edit_homepage_content', 'edit_about_page', 'edit_courses_page', 'edit_contact_page', 'edit_footer_content', 'edit_header_content', 'view_all_pages'
        ],
        'admin': [], // Permissions assigned by Super Admin
        'staff': [
            'view_courses', 'view_students', 'view_student_profile', 'view_tutors', 'view_tutor_profile', 'view_payments', 'view_blog_posts', 'view_all_pages'
        ]
    },

    // Initialize role system
    init: function(role, customPermissions = []) {
        this.currentUser.role = role;
        if (customPermissions.length > 0) {
            this.currentUser.permissions = customPermissions;
        } else {
            this.currentUser.permissions = this.rolePermissions[role] || [];
        }
        this.applyAccessControl();
    },

    // Check if user has permission
    hasPermission: function(permission) {
        if (this.currentUser.role === 'super_admin') {
            return true; // Super admin has all permissions
        }
        return this.currentUser.permissions.includes(permission);
    },

    // Check if user has any of the permissions
    hasAnyPermission: function(permissions) {
        return permissions.some(perm => this.hasPermission(perm));
    },

    // Check if user has all permissions
    hasAllPermissions: function(permissions) {
        return permissions.every(perm => this.hasPermission(permission));
    },

    // Apply access control to page elements
    applyAccessControl: function() {
        // Hide elements with data-permission attribute if user doesn't have permission
        document.querySelectorAll('[data-permission]').forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            if (!this.hasPermission(requiredPermission)) {
                element.style.display = 'none';
            }
        });

        // Disable elements with data-permission-required attribute
        document.querySelectorAll('[data-permission-required]').forEach(element => {
            const requiredPermission = element.getAttribute('data-permission-required');
            if (!this.hasPermission(requiredPermission)) {
                element.disabled = true;
                element.classList.add('disabled');
                element.style.opacity = '0.5';
                element.style.cursor = 'not-allowed';
            }
        });

        // Hide sections with data-role attribute
        document.querySelectorAll('[data-role]').forEach(element => {
            const allowedRoles = element.getAttribute('data-role').split(',');
            if (!allowedRoles.includes(this.currentUser.role)) {
                element.style.display = 'none';
            }
        });

        // Show role-specific content
        document.querySelectorAll('[data-show-role]').forEach(element => {
            const showRoles = element.getAttribute('data-show-role').split(',');
            if (showRoles.includes(this.currentUser.role)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    },

    // Get user role
    getRole: function() {
        return this.currentUser.role;
    },

    // Get user permissions
    getPermissions: function() {
        return this.currentUser.permissions;
    },

    // Check if user is super admin
    isSuperAdmin: function() {
        return this.currentUser.role === 'super_admin';
    },

    // Check if user is admin
    isAdmin: function() {
        return this.currentUser.role === 'admin';
    },

    // Check if user is staff
    isStaff: function() {
        return this.currentUser.role === 'staff';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get role from localStorage or URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || localStorage.getItem('userRole') || 'super_admin';
    const savedPermissions = localStorage.getItem('userPermissions');
    const permissions = savedPermissions ? JSON.parse(savedPermissions) : [];
    
    RoleAccessControl.init(role, permissions);
    
    // Update role indicator in header if exists
    const roleIndicator = document.getElementById('current-role');
    if (roleIndicator) {
        roleIndicator.textContent = role.replace('_', ' ').toUpperCase();
    }
});

// Export for use in other scripts
window.RoleAccessControl = RoleAccessControl;


