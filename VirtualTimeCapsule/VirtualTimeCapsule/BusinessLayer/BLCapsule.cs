using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using VirtualTimeCapsule.DataLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLCapsule
    {
        SqlServerDB sqlConnectionObj = new SqlServerDB();

        // CREATE CAPSULE
        public int CreateCapsule(int userId)
        {
            try
            {
                string procedureName = "sp_InsertCapsule";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@UserId", userId)
                };

                DataTable dt = sqlConnectionObj.GetDataTable(
                    procedureName,
                    CommandType.StoredProcedure,
                    parameters
                );

                if (dt.Rows.Count > 0)
                {
                    return Convert.ToInt32(dt.Rows[0]["CapsuleId"]);
                }

                return 0;
            }
            catch
            {
                return 0;
            }
        }

        // GET CAPSULES BY USER
        public List<CapsuleClass> GetCapsulesByUser(int userId)
        {
            List<CapsuleClass> capsules = new List<CapsuleClass>();

            try
            {
                SqlParameter[] parameters =
                {
            new SqlParameter("@UserId", userId)
        };

                DataTable dt = sqlConnectionObj.GetDataTable(
                    "sp_GetCapsulesByUser",
                    CommandType.StoredProcedure,
                    parameters
                );

                foreach (DataRow row in dt.Rows)
                {
                    capsules.Add(new CapsuleClass
                    {
                        CapsuleId = Convert.ToInt32(row["CAPSULEID"]),
                        CreatedDate = Convert.ToDateTime(row["CREATEDDATE"]),

                        FirstName = row["FIRSTNAME"]?.ToString(),
                        LastName = row["LASTNAME"]?.ToString(),
                        Email = row["EMAIL"]?.ToString(),

                        UnlockDate = row["UNLOCKDATE"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(row["UNLOCKDATE"]),

                        UnlockTime = row["UNLOCKTIME"] == DBNull.Value
                            ? null
                            : (TimeSpan?)row["UNLOCKTIME"],

                        Note = row["NOTE"]?.ToString(),
                        Status = row["CAPSULESTATUS"]?.ToString()
                    });
                }
            }
            catch
            {
            }

            return capsules;
        }

        // DELETE CAPSULE
        public bool DeleteCapsule(int capsuleId)
        {
            try
            {
                string query = @"
                DELETE FROM MEMORIES WHERE CAPSULEID=@CapsuleId
                DELETE FROM INVITE_CONTRIBUTOR WHERE CAPSULEID=@CapsuleId
                DELETE FROM CAPSULES WHERE CAPSULEID=@CapsuleId";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@CapsuleId", capsuleId)
                };

                int rows = sqlConnectionObj.ExecuteNonQuery(
                    query,
                    CommandType.Text,
                    parameters
                );

                return rows > 0;
            }
            catch
            {
                return false;
            }
        }

        //ACTIVE CAPSULE
        public bool ActivateCapsule(int capsuleId)
        {
            try
            {
                // DB column is named STATUS in the schema provided
                string query = "UPDATE CAPSULES SET STATUS='ACTIVE' WHERE CAPSULEID=@CapsuleId";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@CapsuleId", capsuleId)
                };

                int rows = sqlConnectionObj.ExecuteNonQuery(
                    query,
                    CommandType.Text,
                    parameters
                );

                return rows > 0;
            }
            catch
            {
                return false;
            }
        }

        // GET UNLOCKED BUT NOT YET SENT CAPSULES
        public List<CapsuleClass> GetUnlockedPendingCapsules(DateTime currentDateTime)
        {
            List<CapsuleClass> capsules = new List<CapsuleClass>();
            try
            {
                // We use C.STATUS = 'ACTIVE' to find capsules that haven't been emailed yet.
                string query = @"
                    SELECT 
                        C.CAPSULEID, 
                        IC.FIRSTNAME, 
                        IC.LASTNAME, 
                        IC.EMAIL, 
                        IC.NOTE,
                        R.FIRSTNAME + ' ' + R.LASTNAME AS SENDERNAME
                    FROM CAPSULES C
                    INNER JOIN INVITE_CONTRIBUTOR IC ON C.CAPSULEID = IC.CAPSULEID
                    INNER JOIN REGISTRATION R ON C.USERID = R.USERID
                    WHERE C.STATUS = 'ACTIVE' 
                    AND DATEADD(second, DATEDIFF(second, 0, IC.UNLOCKTIME), CAST(IC.UNLOCKDATE AS DATETIME)) <= @Now";

                SqlParameter[] parameters = {
                    new SqlParameter("@Now", currentDateTime)
                };

                DataTable dt = sqlConnectionObj.GetDataTable(query, CommandType.Text, parameters);

                foreach (DataRow row in dt.Rows)
                {
                    capsules.Add(new CapsuleClass
                    {
                        CapsuleId = Convert.ToInt32(row["CAPSULEID"]),
                        FirstName = row["FIRSTNAME"]?.ToString(),
                        LastName = row["LASTNAME"]?.ToString(),
                        Email = row["EMAIL"]?.ToString(),
                        Note = row["NOTE"]?.ToString(),
                        SenderName = row["SENDERNAME"]?.ToString()
                    });
                }
            }
            catch (Exception) { }
            return capsules;
        }

        // UPDATE STATUS TO SENT (Marking both the Invite and the Capsule itself)
        public bool MarkCapsuleAsSent(int capsuleId)
        {
            try
            {
                // We mark the Capsule as 'COMPLETED' so our background service doesn't pick it up again.
                // We mark the Invite as 'SENDED' for the UI.
                string query = @"
                    UPDATE INVITE_CONTRIBUTOR SET STATUS='SENDED' WHERE CAPSULEID=@CapsuleId;
                    UPDATE CAPSULES SET STATUS='COMPLETED' WHERE CAPSULEID=@CapsuleId;";

                SqlParameter[] parameters = { new SqlParameter("@CapsuleId", capsuleId) };
                int rows = sqlConnectionObj.ExecuteNonQuery(query, CommandType.Text, parameters);
                return rows > 0;
            }
            catch { return false; }
        }
    }
}