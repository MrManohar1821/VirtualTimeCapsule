using Microsoft.Data.SqlClient;
using System.Data;
using VirtualTimeCapsule.DataLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLContributor
    {
        SqlServerDB sqlConnectionObj = new SqlServerDB();

        public bool InsertContributor(ContributorClass contributor)
        {
            try
            {
                string procedureName = "sp_InsertContributor";

                SqlParameter[] parameters =
                {
            new SqlParameter("@CapsuleId", contributor.CapsuleId),
            new SqlParameter("@FirstName", contributor.FirstName),
            new SqlParameter("@LastName", contributor.LastName),
            new SqlParameter("@Email", contributor.Email),
            new SqlParameter("@UnlockDate", contributor.UnlockDate),
            new SqlParameter("@UnlockTime", contributor.UnlockTime),
            new SqlParameter("@Note", contributor.Note ?? (object)DBNull.Value)
        };

                int rows = sqlConnectionObj.ExecuteNonQuery(
                    procedureName,
                    CommandType.StoredProcedure,
                    parameters
                );

                return rows > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
