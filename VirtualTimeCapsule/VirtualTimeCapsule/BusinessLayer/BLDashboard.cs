using System.Data;
using Microsoft.Data.SqlClient;
using VirtualTimeCapsule.DataLayer;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLDashboard
    {
        SqlServerDB sqlConnectionObj = new SqlServerDB();

        public object GetDashboardStatistics()
        {
            try
            {
                // Total Users
                string queryUsers = "SELECT COUNT(*) FROM REGISTRATION";
                int totalUsers = Convert.ToInt32(sqlConnectionObj.GetDataTable(queryUsers).Rows[0][0]);

                // Total Capsules
                string queryCapsules = "SELECT COUNT(*) FROM CAPSULES";
                int totalCapsules = Convert.ToInt32(sqlConnectionObj.GetDataTable(queryCapsules).Rows[0][0]);

                // Locked Capsules (Pending) - Assuming STATUS = 'ACTIVE' implies not yet sent/unlocked
                string queryLocked = "SELECT COUNT(*) FROM CAPSULES WHERE STATUS = 'ACTIVE'";
                int lockedCapsules = Convert.ToInt32(sqlConnectionObj.GetDataTable(queryLocked).Rows[0][0]);

                // Opened Capsules (Unlocked/Completed) - Assuming STATUS = 'COMPLETED' implies already sent/opened
                string queryOpened = "SELECT COUNT(*) FROM CAPSULES WHERE STATUS = 'COMPLETED'";
                int openedCapsules = Convert.ToInt32(sqlConnectionObj.GetDataTable(queryOpened).Rows[0][0]);

                return new
                {
                    TotalUsers = totalUsers,
                    TotalCapsules = totalCapsules,
                    LockedCapsules = lockedCapsules,
                    OpenedCapsules = openedCapsules
                };
            }
            catch
            {
                return new
                {
                    TotalUsers = 0,
                    TotalCapsules = 0,
                    LockedCapsules = 0,
                    OpenedCapsules = 0
                };
            }
        }

        // GET USER INFO WITH CAPSULE COUNTS
        public List<object> GetUserInfo()
        {
            List<object> users = new List<object>();
            try
            {
                string query = @"
                    SELECT 
                        R.USERID, 
                        R.FIRSTNAME, 
                        R.LASTNAME,
                        R.EMAIL, 
                        (SELECT COUNT(*) FROM CAPSULES C WHERE C.USERID = R.USERID) AS TotalCapsules
                    FROM REGISTRATION R
                    ORDER BY R.USERID DESC";

                DataTable dt = sqlConnectionObj.GetDataTable(query);

                foreach (DataRow row in dt.Rows)
                {
                    users.Add(new
                    {
                        UserId = Convert.ToInt32(row["USERID"]),
                        FirstName = row["FIRSTNAME"]?.ToString(),
                        LastName = row["LASTNAME"]?.ToString(),
                        Email = row["EMAIL"]?.ToString(),
                        TotalCapsules = Convert.ToInt32(row["TotalCapsules"])
                    });
                }
            }
            catch { }
            return users;
        }

        // DELETE USER (Cascading) - Each step is separate to avoid multi-statement parameter issues
        public bool DeleteUser(int userId)
        {
            try
            {
                SqlServerDB db = new SqlServerDB();

                // Step 1: Delete Memories linked to this user's capsules
                try {
                    string q1 = "DELETE FROM MEMORIES WHERE CAPSULEID IN (SELECT CAPSULEID FROM CAPSULES WHERE USERID = @UserId)";
                    db.ExecuteNonQuery(q1, CommandType.Text, new SqlParameter[] { new SqlParameter("@UserId", userId) });
                } catch { /* User may have no memories - ignore */ }

                // Step 2: Delete Invite Contributors linked to this user's capsules
                try {
                    string q2 = "DELETE FROM INVITE_CONTRIBUTOR WHERE CAPSULEID IN (SELECT CAPSULEID FROM CAPSULES WHERE USERID = @UserId)";
                    db.ExecuteNonQuery(q2, CommandType.Text, new SqlParameter[] { new SqlParameter("@UserId", userId) });
                } catch { /* User may have no contributors - ignore */ }

                // Step 3: Delete Capsules owned by this user
                try {
                    string q3 = "DELETE FROM CAPSULES WHERE USERID = @UserId";
                    db.ExecuteNonQuery(q3, CommandType.Text, new SqlParameter[] { new SqlParameter("@UserId", userId) });
                } catch { /* User may have no capsules - ignore */ }

                // Step 4: Delete Profile (optional table - may not exist for all users)
                try {
                    string q4 = "DELETE FROM PROFILE WHERE USERID = @UserId";
                    db.ExecuteNonQuery(q4, CommandType.Text, new SqlParameter[] { new SqlParameter("@UserId", userId) });
                } catch { /* Profile may not exist for this user - ignore */ }

                // Step 5: Delete from REGISTRATION - this MUST succeed
                string qUser = "DELETE FROM REGISTRATION WHERE USERID = @UserId";
                int rows = db.ExecuteNonQuery(qUser, CommandType.Text, new SqlParameter[] { new SqlParameter("@UserId", userId) });

                return rows > 0;
            }
            catch { return false; }
        }
        // GET ALL CAPSULES INFO FOR ADMIN DASHBOARD
        public List<object> GetCapsulesInfo()
        {
            List<object> capsules = new List<object>();
            try
            {
                string query = @"
                    SELECT 
                        C.CAPSULEID,
                        C.STATUS,
                        R.EMAIL AS SenderEmail,
                        IC.EMAIL AS ReceiverEmail,
                        IC.UNLOCKDATE,
                        IC.UNLOCKTIME,
                        (SELECT COUNT(*) FROM MEMORIES M WHERE M.CAPSULEID = C.CAPSULEID) AS MemoryCount
                    FROM CAPSULES C
                    LEFT JOIN REGISTRATION R ON C.USERID = R.USERID
                    LEFT JOIN INVITE_CONTRIBUTOR IC ON C.CAPSULEID = IC.CAPSULEID
                    ORDER BY C.CAPSULEID DESC";

                DataTable dt = sqlConnectionObj.GetDataTable(query);

                foreach (DataRow row in dt.Rows)
                {
                    capsules.Add(new
                    {
                        CapsuleId = Convert.ToInt32(row["CAPSULEID"]),
                        Status = row["STATUS"]?.ToString(),
                        SenderEmail = row["SenderEmail"]?.ToString(),
                        ReceiverEmail = row["ReceiverEmail"]?.ToString(),
                        UnlockDate = row["UNLOCKDATE"] == DBNull.Value ? null : Convert.ToDateTime(row["UNLOCKDATE"]).ToString("yyyy-MM-dd"),
                        UnlockTime = row["UNLOCKTIME"] == DBNull.Value ? null : row["UNLOCKTIME"].ToString(),
                        MemoryCount = Convert.ToInt32(row["MemoryCount"])
                    });
                }
            }
            catch { }
            return capsules;
        }
    }
}
