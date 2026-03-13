using Microsoft.Data.SqlClient;
using System.Data;


namespace VirtualTimeCapsule.DataLayer
{
    public class SqlServerDB
    {
        private static string? _cachedConn;
        public string? conn;

        public SqlServerDB()
        {
            if (string.IsNullOrEmpty(_cachedConn))
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();
                
                _cachedConn = config.GetConnectionString("DefaultConnection");
            }
            conn = _cachedConn;
        }

        public DataTable GetDataTable(string query)
        {
            SqlCommand cmd = new SqlCommand();
            SqlConnection sqlConn = new SqlConnection();
            SqlDataAdapter da = new SqlDataAdapter();
            DataTable tblData = new DataTable();

            cmd.CommandText = query;
            sqlConn.ConnectionString = conn;
            sqlConn.Open();
            cmd.Connection = sqlConn;
            cmd.CommandType = CommandType.Text;
            da.SelectCommand = cmd;
            da.Fill(tblData);
            sqlConn.Close();
            return tblData;
        }
        public int ExecuteOnlyQuery(string query)
        {
            SqlConnection sqlConn = new SqlConnection();
            SqlCommand cmd = new SqlCommand();

            cmd.CommandText = query;
            sqlConn.ConnectionString = conn;
            sqlConn.Open();
            cmd.Connection = sqlConn;
            cmd.CommandType = CommandType.Text;
            int count = cmd.ExecuteNonQuery();
            sqlConn.Close();
            return count;
        }
        public DataTable GetDataTable(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            using (SqlConnection sqlConn = new SqlConnection(conn))
            {
                using (SqlCommand cmd = new SqlCommand(procedureName, sqlConn))
                {
                    cmd.CommandType = commandType;

                    // Adding Parameters if provided
                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }

                    sqlConn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        DataTable tblData = new DataTable();
                        da.Fill(tblData);
                        return tblData;
                    }
                }
            }
        }
        public int ExecuteNonQuery(string procedureName, CommandType commandType, SqlParameter[] parameters)
        {
            int a = 0;
            using (SqlConnection sqlConn = new SqlConnection(conn))
            {
                using (SqlCommand cmd = new SqlCommand(procedureName, sqlConn))
                {
                    cmd.CommandType = commandType;

                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }
                    sqlConn.Open();
                    a = cmd.ExecuteNonQuery();
                }
                sqlConn.Close();
            }
            return a;
        }
    }
}
