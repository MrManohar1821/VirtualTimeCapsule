using System.Data;
using Microsoft.Data.SqlClient;
using VirtualTimeCapsule.DataLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLProfile
    {
        SqlServerDB db = new SqlServerDB();

        // =====================================
        // GET PROFILE
        // =====================================
        public ProfileClass GetProfile(int userId)
        {
            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", userId)
            };

            DataTable dt = db.GetDataTable(
                "sp_GetProfileByUserId",
                CommandType.StoredProcedure,
                parameters
            );

            if (dt.Rows.Count == 0)
                return null;

            DataRow row = dt.Rows[0];

            return new ProfileClass
            {
                UserId = Convert.ToInt32(row["USERID"]),
                FirstName = row["FIRSTNAME"]?.ToString(),
                LastName = row["LASTNAME"]?.ToString(),
                Email = row["EMAIL"]?.ToString(),
                Phone = row["PHONE"] == DBNull.Value ? null : row["PHONE"].ToString(),
                ProfileImage = row["PROFILEIMAGE"] == DBNull.Value ? null : row["PROFILEIMAGE"].ToString()
            };
        }

        // =====================================
        // UPDATE PROFILE
        // =====================================
        public bool UpdateProfile(ProfileClass model)
        {
            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", model.UserId),
                new SqlParameter("@FirstName", model.FirstName),
                new SqlParameter("@LastName", model.LastName),
                new SqlParameter("@Email", model.Email),
                new SqlParameter("@Phone", (object?)model.Phone ?? DBNull.Value),
                new SqlParameter("@ProfileImage", (object?)model.ProfileImage ?? DBNull.Value)
            };

            try
            {
                db.ExecuteNonQuery(
                    "sp_UpdateProfile",
                    CommandType.StoredProcedure,
                    parameters
                );

                // If no exception → success
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}