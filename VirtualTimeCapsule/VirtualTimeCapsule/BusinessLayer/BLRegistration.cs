using Microsoft.Data.SqlClient;
using System.Data;
using VirtualTimeCapsule.DataLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLRegistration
    {
        SqlServerDB sqlConnectionObj = new SqlServerDB();

        // REGISTER API
        public bool RegisterValues(RegistrationClass registration)
        {
            try
            {
                string procedureName = "sp_InsertRegistration";

                // Normalize Email
                string normalizedEmail = registration.Email.ToLower().Trim();

                // Hash password ONLY here (single hashing)
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registration.Password.Trim());

                SqlParameter[] sqlParameters = new SqlParameter[]
                {
                    new SqlParameter("@FirstName", registration.FirstName),
                    new SqlParameter("@LastName", registration.LastName),
                    new SqlParameter("@Email", normalizedEmail),
                    new SqlParameter("@Password", hashedPassword),
                    new SqlParameter("@Role", registration.Role)
                };

                // Execute SP (ignore affected rows because SET NOCOUNT ON is used)
                sqlConnectionObj.ExecuteNonQuery(
                    procedureName,
                    CommandType.StoredProcedure,
                    sqlParameters
                );

                return true; //Success if no exception
            }
            catch (Exception)
            {
                return false; // Fail only if exception occurs
            }
        }

        //  LOGIN API
        public RegistrationClass? GetUserByEmail(string email)
        {
            try
            {
                string query = "SELECT * FROM REGISTRATION WHERE LOWER(EMAIL) = LOWER(@Email)";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@Email", email.Trim())
                };

                DataTable dt = sqlConnectionObj.GetDataTable(
                    query,
                    CommandType.Text,
                    parameters
                );

                if (dt.Rows.Count == 0)
                    return null;

                return new RegistrationClass
                {
                    UserId = Convert.ToInt32(dt.Rows[0]["USERID"]),
                    FirstName = dt.Rows[0]["FIRSTNAME"]?.ToString(),
                    LastName = dt.Rows[0]["LASTNAME"]?.ToString(),
                    Email = dt.Rows[0]["EMAIL"]?.ToString(),
                    Password = dt.Rows[0]["PASSWORD"]?.ToString(), // hashed password
                    Role = Convert.ToInt32(dt.Rows[0]["ROLE"])
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}