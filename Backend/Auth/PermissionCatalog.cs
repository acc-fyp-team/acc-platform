namespace Backend.Auth
{
    // Every module and action the Control Unit can grant.
    // Keeping them in one place stops typos like "Client" vs "Clients".
    public static class PermissionCatalog
    {
        public static readonly string[] Modules =
        {
            "Clients",
            "Employees",
            "Projects",
            "Attendance",
            "Materials",
            "Salaries",
            "Billing",
            "Expenses",
            "Reports",
            "Users",
            "Settings"
        };

        public static readonly string[] Actions =
        {
            "View",
            "Add",
            "Edit",
            "Delete",
            "Manage"
        };
    }
}
