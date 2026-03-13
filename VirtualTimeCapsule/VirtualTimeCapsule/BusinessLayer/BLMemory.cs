using Microsoft.Data.SqlClient;
using System;
using System.Data;
using VirtualTimeCapsule.DataLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.BusinessLayer
{
    public class BLMemory
    {
        SqlServerDB sqlConnectionObj = new SqlServerDB();

        public bool AddMemory(MemoryClass memory)
        {
            try
            {
                // Validate input
                if (memory == null)
                    return false;

                if (memory.CapsuleId <= 0)
                    return false;

                string procedureName = "sp_InsertMemory";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@CapsuleId", memory.CapsuleId),

                    new SqlParameter("@Message",
                        memory.Message != null ? memory.Message : (object)DBNull.Value),

                    new SqlParameter("@FilePath",
                        memory.FilePath != null ? memory.FilePath : (object)DBNull.Value),

                    new SqlParameter("@FileType",
                        memory.FileType != null ? memory.FileType : (object)DBNull.Value)
                };

                int rowsAffected = sqlConnectionObj.ExecuteNonQuery(
                    procedureName,
                    CommandType.StoredProcedure,
                    parameters
                );   

                if (rowsAffected > 0)
                    return true;

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Database Error in AddMemory: " + ex.Message);
                return false;
            }
        }

        public List<MemoryClass> GetMemoriesByCapsule(int capsuleId)
        {
            List<MemoryClass> memories = new List<MemoryClass>();

            try
            {
                string query = "SELECT * FROM MEMORIES WHERE CAPSULEID=@CapsuleId";

                SqlParameter[] parameters =
                {
            new SqlParameter("@CapsuleId", capsuleId)
        };

                DataTable dt = sqlConnectionObj.GetDataTable(
                    query,
                    CommandType.Text,
                    parameters
                );

                foreach (DataRow row in dt.Rows)
                {
                    memories.Add(new MemoryClass
                    {
                        Message = row["MESSAGE"]?.ToString(),
                        FilePath = row["FILEPATH"]?.ToString(),
                        FileType = row["FILETYPE"]?.ToString()
                    });
                }
            }
            catch
            {
            }

            return memories;
        }
    }
}